/**
 * @description 유저 정보
 * @property {number} kakaoId - 카카오 아이디
 * @property {string} nickname - 유저 닉네임
 * @property {string} profileImage - 유저 프로필 이미지
 * @property {string[]} reviews - 유저 리뷰 목록
 * @property {string[]} likedReviews - 유저 좋아요한 리뷰 목록
 * @property {string[]} favoriteTags - 유저 즐겨찾기 태그
 * @property {string} notificationCheckTime - 유저 알림 확인 시간
 */
export interface UserInfo {
  kakaoId: number;
  nickname: string;
  profileImage: string;
  reviews: string[];
  likedReviews: string[];
  favoriteTags: string[];
  notificationCheckTime: string;
}

/**
 * @description 리뷰 정보
 * @property {number} authorId - 리뷰 작성자 ID
 * @property {string} uploadTime - 리뷰 업로드 시간
 * @property {string} title - 리뷰 제목
 * @property {string[]} images - 리뷰 이미지
 * @property {string} reviewText - 리뷰 내용
 * @property {number} rating - 리뷰 평점
 * @property {string[]} tags - 리뷰 태그
 * @property {number} likesCount - 리뷰 좋아요 수
 * @property {number} commentsCount - 리뷰 댓글 수
 * @property {string} _id - 리뷰 ID
 * @property {number} __v - 리뷰 버전
 * @property {boolean} isLikedByUser - 리뷰 좋아요 여부
 */
export interface ReviewInfo {
  authorId: number;
  uploadTime: string;
  title: string;
  images: string[];
  reviewText: string;
  rating: number;
  tags: string[];
  likesCount: number;
  commentsCount: number;
  _id: string;
  __v: number;
  isLikedByUser: boolean;
}

/**
 * @description 태그 정보
 * @property {string} tagName - 태그 이름
 * @property {number} appliedCount - 태그 적용 횟수
 */
export interface TagInfo {
  tagName: string;
  appliedCount: number;
}

/**
 * @description 댓글 정보
 * @property {string} _id - 댓글 ID
 * @property {number} __v - 댓글 버전
 * @property {number} authorId - 댓글 작성자 ID
 * @property {string} uploadTime - 댓글 업로드 시간
 * @property {string} content - 댓글 내용
 */
export interface CommentInfo {
  _id: string;
  __v: number;
  authorId: number;
  uploadTime: string;
  content: string;
}

/**
 * @description 알림 정보
 * @property {string} _id - 알림 ID
 * @property {number} kakaoId - 알림을 받을 유저의 카카오 ID
 * @property {string} time - 알림 생성 시간
 * @property {string} commentId - 알림과 관련된 댓글 ID
 * @property {string} reviewId - 알림과 관련된 리뷰 ID
 * @property {string} category - 알림 종류
 */
export interface NotificationInfo {
  _id: string;
  kakaoId: number;
  time: string;
  commentId: string;
  reviewId: string;
  category: string;
}
