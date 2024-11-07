import { TagModel } from "../utils/Model.js";

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
  const bulkOps = tagList.map((tagName) => ({
    updateOne: {
      filter: { tagName, kakaoId: userId },
      update: {
        $inc: { preference: increment },
        lastInteractedAt: Date.now(),
      },
      upsert: true,
    },
  }));

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
