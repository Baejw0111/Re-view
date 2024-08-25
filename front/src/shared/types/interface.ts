/**
 * @description 유저 정보
 * @param nickname 유저 닉네임
 * @param profileImage 유저 프로필 이미지
 */
export interface UserInfo {
  nickname: string;
  profileImage: string;
  thumbnailImage: string;
}

/**
 * @description 리뷰 정보
 * @param author 리뷰 작성자
 * @param uploadTime 리뷰 업로드 시간
 * @param title 리뷰 제목
 * @param image 리뷰 이미지
 * @param reviewText 리뷰 내용
 * @param ratings 리뷰 평점
 * @param tags 리뷰 태그
 */
export interface Review {
  author: string;
  uploadTime: Date;
  title: string;
  images: string[];
  reviewText: string;
  rating: number;
  tags: string[];
}

/**
 * @description 태그 정보
 * @param tagName 태그 이름
 * @param appliedCount 태그 적용 횟수
 */
export interface Tag {
  tagName: string;
  appliedCount: number;
}
