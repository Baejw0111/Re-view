/**
 * @description 로그인 유저 정보
 * @property {number} socialId - 소셜 아이디
 * @property {string} nickname - 유저 닉네임
 * @property {string} profileImage - 유저 프로필 이미지
 * @property {string} notificationCheckTime - 알림 확인 시간
 */
export interface LoginUserInfo {
  socialId: number;
  nickname: string;
  profileImage: string;
  notificationCheckTime: string;
}

/**
 * @description 유저 정보
 * @property {number} socialId - 소셜 아이디
 * @property {string} nickname - 유저 닉네임
 * @property {string} profileImage - 유저 프로필 이미지
 * @property {string[]} favoriteTags - 선호하는 태그 목록
 * @property {number} reviewCount - 작성한 리뷰 개수
 * @property {number} totalRating - 총 평점
 */
export interface UserInfo {
  socialId: number;
  nickname: string;
  profileImage: string;
  favoriteTags: string[];
  reviewCount: number;
  totalRating: number;
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
 * @property {boolean} isSpoiler - 스포일러 여부
 * @property {string} _id - 리뷰 ID
 * @property {number} __v - 리뷰 버전
 */
export interface ReviewInfo {
  authorId: number;
  uploadTime: string;
  title: string;
  images: string[];
  reviewText: string;
  rating: number;
  tags: string[];
  isSpoiler: boolean;
  _id: string;
  __v: number;
}

/**
 * @description 댓글 정보
 * @property {string} _id - 댓글 ID
 * @property {number} authorId - 댓글 작성자 ID
 * @property {string} profileImage - 댓글 작성자 프로필 이미지
 * @property {string} nickname - 댓글 작성자 닉네임
 * @property {string} reviewId - 댓글이 작성된 리뷰 ID
 * @property {string} uploadTime - 댓글 업로드 시간
 * @property {string} content - 댓글 내용
 */
export interface CommentInfo {
  _id: string;
  authorId: number;
  profileImage: string;
  nickname: string;
  reviewId: string;
  uploadTime: string;
  content: string;
}

/**
 * @description 알림 정보
 * @property {string} _id - 알림 ID
 * @property {string} time - 알림 생성 시간
 * @property {string} commentId - 알림과 관련된 댓글 ID
 * @property {string} reviewId - 알림과 관련된 리뷰 ID
 * @property {string} category - 알림 종류
 * @property {string} profileImage - 알림 작성자 프로필 이미지
 * @property {string} nickname - 알림 작성자 닉네임
 * @property {string} title - 알림 제목
 * @property {string} reviewTitle - 알림과 관련된 리뷰 제목
 * @property {string} content - 알림 내용
 * @property {string} reviewThumbnail - 알림과 관련된 리뷰 썸네일
 */
export interface NotificationInfo {
  _id: string;
  time: string;
  commentId: string;
  reviewId: string;
  category: string;
  profileImage: string;
  nickname: string;
  title: string;
  reviewTitle: string;
  content: string;
  reviewThumbnail: string;
}

/**
 * @description 리뷰 폼 값
 * @property {string} title - 리뷰 제목
 * @property {FileList} images - 리뷰 이미지
 * @property {string} reviewText - 리뷰 내용
 * @property {number} rating - 리뷰 평점
 * @property {string[]} tags - 리뷰 태그
 * @property {boolean} isSpoiler - 스포일러 여부
 */
export interface ReviewFormValues {
  title: string;
  images: FileList;
  reviewText: string;
  rating: number;
  tags: string[];
  isSpoiler: boolean;
}
