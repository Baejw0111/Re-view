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
 * @param rating 리뷰 평점
 * @param tags 리뷰 태그
 * @param likesCount 리뷰 좋아요 수
 * @param commentsCount 리뷰 댓글 수
 * @param _id 리뷰 ID
 * @param __v 리뷰 버전
 */
export interface ReviewInfo {
  author: string;
  uploadTime: Date;
  title: string;
  images: string[];
  reviewText: string;
  rating: number;
  tags: string[];
  likesCount: number;
  commentsCount: number;
  _id: string;
  __v: number;
}

/**
 * @description 태그 정보
 * @param tagName 태그 이름
 * @param appliedCount 태그 적용 횟수
 */
export interface TagInfo {
  tagName: string;
  appliedCount: number;
}

/**
 * @description 댓글 정보
 * @param authorId 댓글 작성자 ID
 * @param uploadTime 댓글 업로드 시간
 * @param content 댓글 내용
 */
export interface CommentInfo {
  authorId: string;
  uploadTime: Date;
  content: string;
}
