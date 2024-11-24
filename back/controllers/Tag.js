import { getChoseong } from "es-hangul";
import mongoose from "mongoose";
import {
  TagModel,
  ReviewModel,
  ReviewLikeModel,
  CommentModel,
} from "../utils/Model.js";
import asyncHandler from "../utils/ControllerUtils.js";

/**
 * 유저의 상위 4개 선호 태그를 가져오는 함수
 * @param {mongoose.Schema.Types.ObjectId} userId - 유저 ID
 * @returns {Object[]} 유저의 상위 4개 선호 태그 목록
 */
export async function getFavoriteTags(userId) {
  try {
    const favoriteTagsPerUser = await TagModel.aggregate([
      {
        $match: { userId }, // userId로 매칭
      },
      {
        $sort: { preference: -1, lastInteractedAt: -1 }, // 선호도, 마지막 상호작용 시간 기준으로 내림차순 정렬
      },
      {
        $limit: 4, // 상위 4개 태그만 선택
      },
      {
        $project: {
          _id: 0,
          tagName: 1, // 태그 이름만 선택
        },
      },
    ]);

    const tagList = favoriteTagsPerUser.map((tag) => tag.tagName);
    return tagList;
  } catch (error) {
    console.error("사용자별 상위 태그 계산 에러:", error);
  }
}

/**
 * 태그 선호도 업데이트 함수
 * @param {mongoose.Schema.Types.ObjectId} userId - 유저 ID
 * @param {string[]} tagList - 태그 리스트
 * @param {number} increment - 선호도 증가량
 */
export async function increaseTagPreference(userId, tagList, increment) {
  const bulkOps = tagList.map((tagName) => {
    return {
      updateOne: {
        filter: { tagName, userId },
        update: {
          $inc: { preference: increment },
          lastInteractedAt: Date.now(),
          koreanInitials: getChoseong(tagName),
        },
        upsert: true,
      },
    };
  });

  await TagModel.bulkWrite(bulkOps);
}

/**
 * 태그 선호도 감소 함수
 * @param {mongoose.Schema.Types.ObjectId} userId - 유저 ID
 * @param {string[]} tagList - 태그 리스트
 * @param {number} decrement - 선호도 감소량
 */
export async function decreaseTagPreference(userId, tagList, decrement) {
  await TagModel.updateMany(
    { tagName: { $in: tagList }, userId },
    { $inc: { preference: -1 * decrement } }
  );

  await TagModel.deleteMany({
    userId,
    preference: { $lte: 0 },
  });
}

/**
 * 6시간 이내에 리뷰 작성, 또는 추천되거나 댓글이 달린 태그들을 기반으로 상위 5개의 인기 태그 조회
 * @returns {Object[]} 인기 태그 목록
 */
export const getPopularTags = asyncHandler(async (req, res) => {
  const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);

  // 추천 점수 계산
  const likes = await ReviewLikeModel.aggregate([
    { $match: { likedAt: { $gte: sixHoursAgo } } },
    {
      // lookup 연산자를 사용하여 리뷰 조회
      $lookup: {
        from: "reviews", // reviews 컬렉션에서 조회
        localField: "reviewId", // ReviewLikeModel의 reviewId 필드를 참조
        foreignField: "_id", // ReviewModel의 _id 필드를 참조
        as: "review", // 조회 결과를 review 배열로 저장
      },
    },
    { $unwind: "$review" }, // unwind 연산자를 사용하여 리뷰 배열을 개별 리뷰로 분리
    { $unwind: "$review.tags" }, // unwind 연산자를 사용하여 태그 배열을 개별 태그로 분리
    { $group: { _id: "$review.tags", score: { $sum: 3 } } }, // 태그별 점수 합산
  ]);

  // 작성 점수 계산
  const reviews = await ReviewModel.aggregate([
    { $match: { uploadTime: { $gte: sixHoursAgo } } },
    { $unwind: "$tags" },
    { $group: { _id: "$tags", score: { $sum: 1 } } },
  ]);

  // 댓글 점수 계산
  const comments = await CommentModel.aggregate([
    { $match: { uploadTime: { $gte: sixHoursAgo } } },
    {
      // lookup 연산자를 사용하여 리뷰 조회
      $lookup: {
        from: "reviews", // reviews 컬렉션에서 조회
        localField: "reviewId", // CommentModel의 reviewId 필드를 참조
        foreignField: "_id", // ReviewModel의 _id 필드를 참조
        as: "review", // 조회 결과를 review 배열로 저장
      },
    },
    { $unwind: "$review" }, // unwind 연산자를 사용하여 리뷰 배열을 개별 리뷰로 분리
    { $unwind: "$review.tags" }, // unwind 연산자를 사용하여 태그 배열을 개별 태그로 분리
    { $group: { _id: "$review.tags", score: { $sum: 2 } } }, // 태그별 점수 합산
  ]);

  // 점수 합산
  const combinedScores = [...likes, ...reviews, ...comments].reduce(
    (acc, { _id, score }) => {
      acc[_id] = (acc[_id] || 0) + score;
      return acc;
    },
    {}
  );

  // 점수 기준으로 정렬 후 상위 5개 태그만 선택
  const sortedTags = Object.entries(combinedScores)
    .sort(([, a], [, b]) => b - a)
    .map(([tagName]) => tagName)
    .slice(0, 5);

  res.status(200).json(sortedTags);
});

/**
 * 검색어 연관 태그 조회
 */
export const searchRelatedTags = asyncHandler(async (req, res) => {
  const { query } = req.query;
  const queryWithoutSpace = query.replace(/\s/g, "");

  // 초성 추출
  const koreanInitials = getChoseong(query);
  const koreanInitialsWithoutSpace = koreanInitials.replace(/\s/g, "");

  // 조건 배열 동적 생성
  const conditions = [
    { tagName: { $regex: query, $options: "i" } },
    { tagName: { $regex: queryWithoutSpace, $options: "i" } },
  ];

  // 초성 쿼리가 비어있지 않은 경우에만 조건 추가
  if (koreanInitials) {
    conditions.push({
      koreanInitials: { $regex: koreanInitials, $options: "i" },
    });
  }
  if (koreanInitialsWithoutSpace) {
    conditions.push({
      koreanInitials: { $regex: koreanInitialsWithoutSpace, $options: "i" },
    });
  }

  const relatedTags = await TagModel.find({
    $or: conditions,
  }).limit(10);

  const tagNames = relatedTags.map((tag) => tag.tagName); // 태그 이름만 추출
  res.status(200).json(tagNames);
});
