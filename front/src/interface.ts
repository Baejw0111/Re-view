// 유저 정보
export interface User {
  name: string;
  email: string;
  password: string;
}

// 리뷰 정보
export interface Review {
  author: string;
  uploadTime: Date;
  title: string;
  comments: string;
  ratings: number[];
  tags: string[];
}

// 태그 정보
export interface Tag {
  tagName: string;
  appliedCount: number;
}
