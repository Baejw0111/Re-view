import { generalApiClient } from "./util";

/**
 * 인기 태그 조회 API
 */
export const fetchPopularTags = async () => {
  const response = await generalApiClient.get("/tag/popular");

  return response.data;
};

/**
 * 검색어 연관 태그 조회 API
 */
export const fetchSearchRelatedTags = async (query: string) => {
  const response = await generalApiClient.get(`/tag/search?query=${query}`);

  return response.data;
};
