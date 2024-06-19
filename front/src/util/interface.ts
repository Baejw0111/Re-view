/**
 * @description 유저 정보
 * @param name 유저 이름
 * @param email 유저 이메일
 * @param password 유저 비밀번호
 */
export interface User {
  name: string;
  email: string;
  password: string;
}

/**
 * @description 리뷰 정보
 * @param author 리뷰 작성자
 * @param uploadTime 리뷰 업로드 시간
 * @param title 리뷰 제목
 * @param image 리뷰 이미지
 * @param comments 리뷰 내용
 * @param ratings 리뷰 평점
 */
export interface Review {
  author: string;
  uploadTime: Date;
  title: string;
  image: string;
  comments: string;
  ratings: number[];
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
