import React, { useState } from "react";
import axios from "axios";

/* TODO:
- 평점 부여 방식 커스텀
- 이미지 업로드 로직 구현
*/

export default function Review() {
  const [reviewData, setReviewData] = useState({
    author: "",
    uploadTime: "",
    title: "",
    comments: "",
    ratings: [] as number[],
    tags: [] as string[],
  }); // 서버에 보낼 폼 데이터
  const [newTag, setNewTag] = useState(""); // 새로운 태그 입력 상태
  const [newRating, setNewRating] = useState(0); // 새로운 평점 입력 상태

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setReviewData((prev) => ({ ...prev, [name]: value }));
  };

  const addTag = () => {
    // 입력값이 비어있지 않다면 배열에 추가
    if (newTag.trim() !== "") {
      setReviewData((prev) => ({ ...prev, tags: [...prev.tags, newTag] }));
      // 입력창 초기화
      setNewTag("");
    }
  };

  const addRating = () => {
    setReviewData((prev) => ({
      ...prev,
      ratings: [...prev.ratings, newRating],
    }));
    setNewRating(0);
  };

  const removeRating = (index: number) => {
    const newRatings = reviewData.ratings.filter((_, i) => i !== index);
    setReviewData((prev) => ({ ...prev, ratings: newRatings }));
  };

  const removeTag = (index: number) => {
    const newTags = reviewData.tags.filter((_, i) => i !== index);
    setReviewData((prev) => ({ ...prev, tags: newTags }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const updatedReviewData = {
      ...reviewData,
      uploadTime: new Date().toISOString(),
    };
    try {
      const response = await axios.post(
        "http://localhost:8080/review",
        updatedReviewData
      );
      console.log("서버 응답:", response.data);
    } catch (error) {
      console.error("리뷰 전송 에러:", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>작성자:</label>
        <input
          type="text"
          name="author"
          value={reviewData.author}
          onChange={handleInputChange}
        />
        <label>제목:</label>
        <input
          type="text"
          name="title"
          value={reviewData.title}
          onChange={handleInputChange}
        />
        <label>코멘트:</label>
        <input
          type="text"
          name="comments"
          value={reviewData.comments}
          onChange={handleInputChange}
        />
        <label>평점:</label>
        {reviewData.ratings.map((rating, index) => (
          <React.Fragment key={index}>
            <div>{rating}</div>
            <button type="button" onClick={() => removeRating(index)}>
              삭제
            </button>
          </React.Fragment>
        ))}
        <input
          type="number"
          name="newRating"
          value={newRating}
          onChange={(event) => {
            setNewRating(Number(event.target.value));
          }}
        />
        <button type="button" onClick={addRating}>
          평점 추가
        </button>
        <label>태그:</label>
        {reviewData.tags.map((tag, index) => (
          <React.Fragment key={index}>
            <div>{tag}</div>
            <button type="button" onClick={() => removeTag(index)}>
              삭제
            </button>
          </React.Fragment>
        ))}
        <input
          type="text"
          name="newTag"
          value={newTag}
          onChange={(event) => {
            setNewTag(event.target.value);
          }}
        />
        <button type="button" onClick={addTag}>
          태그 추가
        </button>
        <button type="submit">리뷰 제출</button>
      </form>
    </>
  );
}
