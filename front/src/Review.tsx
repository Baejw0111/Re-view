import { useState } from "react";
import axios from "axios";

export default function Review() {
  const [reviewData, setReviewData] = useState({
    author: "",
    uploadTime: "",
    title: "",
    comments: "",
    ratings: [],
    tags: []
  });


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setReviewData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const updatedReviewData = {
      ...reviewData,
      uploadTime: new Date().toISOString()
    };
    try {
      const response = await axios.post("http://localhost:8080/review", updatedReviewData);
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
      <input
        type="number"
        name="ratings"
        value={reviewData.ratings}
        onChange={handleInputChange}
      />
      <label>태그:</label>
      <input
        type="text"
        name="tags"
        value={reviewData.tags}
        onChange={handleInputChange}
      />
      <button type="submit">리뷰 제출</button>
    </form>
    /* TODO: 태그 추가 기능 구현
    */
    </>
  );
}