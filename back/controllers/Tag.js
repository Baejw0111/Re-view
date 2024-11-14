import { getChoseong } from "es-hangul";
import { Types } from "mongoose";
import { TagModel, ReviewModel, ReviewLikeModel } from "../utils/Model.js";
import asyncHandler from "../utils/ControllerUtils.js";

/**
 * 사용자의 상위 4개 선호 태그를 가져오는 함수
 * @param {number} userId - 사용자 ID
 * @returns {Object[]} 사용자별 상위 4개 선호 태그 목록
 */
export async function getTop4TagsPerUser(userId) {
  try {
    const topTagsPerUser = await TagModel.aggregate([
      {
        $match: { kakaoId: userId }, // userId로 매칭
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

    const tagList = topTagsPerUser.map((tag) => tag.tagName);
    return tagList;
  } catch (error) {
    console.error("사용자별 상위 태그 계산 에러:", error);
  }
}

/**
 * 태그 선호도 업데이트 함수
 * @param {number} userId - 사용자 ID
 * @param {string[]} tagList - 태그 리스트
 * @param {number} increment - 선호도 증가량
 */
export async function increaseTagPreference(userId, tagList, increment) {
  const bulkOps = tagList.map((tagName) => {
    return {
      updateOne: {
        filter: { tagName, kakaoId: userId },
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
 * @param {number} userId - 사용자 ID
 * @param {string[]} tagList - 태그 리스트
 * @param {number} decrement - 선호도 감소량
 */
export async function decreaseTagPreference(userId, tagList, decrement) {
  await TagModel.updateMany(
    { tagName: { $in: tagList }, kakaoId: userId },
    { $inc: { preference: -1 * decrement } }
  );

  await TagModel.deleteMany({
    kakaoId: userId,
    preference: { $lte: 0 },
  });
}

/**
 * 6시간 이내 추천된 리뷰 기반 인기 태그 조회
 * @returns {Object[]} 인기 태그 목록
 */
export const getPopularTags = asyncHandler(async (req, res) => {
  const sixHourAgo = new Date(Date.now() - 6 * 60 * 60 * 1000); // 6시간 전 시간 계산

  // 지난 6시간 동안 추천된 리뷰 ID 가져오기
  const likedReviews = await ReviewLikeModel.aggregate([
    {
      $match: { likedAt: { $gte: sixHourAgo } },
    },
    {
      $group: {
        _id: "$reviewId",
        count: { $sum: 1 },
      },
    },
  ]);

  const likedReviewIds = likedReviews.map(
    (review) => new Types.ObjectId(review._id)
  );

  // 추천된 리뷰의 태그와 최근 작성된 리뷰의 태그를 한번에 집계
  const combinedTags = await ReviewModel.aggregate([
    {
      $facet: {
        likedTags: [
          { $match: { _id: { $in: likedReviewIds } } },
          { $unwind: "$tags" },
          { $group: { _id: "$tags", count: { $sum: 3 } } }, // 추천된 리뷰의 태그는 5점
        ],
        recentTags: [
          { $match: { uploadTime: { $gte: sixHourAgo } } },
          { $unwind: "$tags" },
          { $group: { _id: "$tags", count: { $sum: 1 } } }, // 최근 작성된 리뷰의 태그는 1점
        ],
      },
    },
    {
      $project: {
        allTags: {
          $concatArrays: ["$likedTags", "$recentTags"],
        },
      },
    },
    { $unwind: "$allTags" },
    {
      $group: {
        _id: "$allTags._id",
        totalCount: { $sum: "$allTags.count" },
      },
    },
    { $sort: { totalCount: -1 } },
    { $limit: 5 },
    { $project: { _id: 1, totalCount: 1 } },
  ]);

  console.log(combinedTags);

  const popularTagList = combinedTags.map((tag) => tag._id);

  res.status(200).json(popularTagList);
});

/**
 * 검색어 연관 태그 조회
 */
export const getSearchRelatedTags = asyncHandler(async (req, res) => {
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
