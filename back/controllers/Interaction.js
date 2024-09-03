import { ReviewModel, CommentModel } from "../utils/model.js";

export const getLikes = async (req, res) => {
  try {
    const { id } = req.params;
    const { likesCount } = await ReviewModel.findById(id);
    res.status(200).json({ likesCount });
  } catch (error) {
    console.error("추천수 조회 중 에러 발생:", error);
    res
      .status(500)
      .json({ message: "서버 에러가 발생했습니다.", error: error });
  }
};

export const getComments = async (req, res) => {
  try {
    const { id } = req.params;
    const comments = await CommentModel.find({ reviewId: id });
    console.log(comments);
    res.status(200).json(comments);
  } catch (error) {
    console.error("댓글 조회 중 에러 발생:", error);
    res
      .status(500)
      .json({ message: "서버 에러가 발생했습니다.", error: error });
  }
};

export const addLike = async (req, res) => {
  try {
    const { id } = req.params;
    await ReviewModel.findByIdAndUpdate(id, {
      $inc: { likes: 1 },
    });
    res.status(200).json("추천 완료!");
  } catch (error) {
    console.error("추천 중 에러 발생:", error);
    res
      .status(500)
      .json({ message: "서버 에러가 발생했습니다.", error: error });
  }
};

export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = new CommentModel({
      reviewId: id,
      content: req.body.comment,
    });
    await comment.save();
    res.status(200).json({ message: "댓글 추가 완료" });
  } catch (error) {
    console.error("댓글 추가 중 에러 발생:", error);
    res
      .status(500)
      .json({ message: "서버 에러가 발생했습니다.", error: error });
  }
};

export const cancelLike = async (req, res) => {
  try {
    const { id } = req.params;
    await ReviewModel.findByIdAndUpdate(id, { $inc: { likes: -1 } });
    res.status(200).json({ message: "추천 삭제 완료" });
  } catch (error) {
    console.error("추천 삭제 중 에러 발생:", error);
    res
      .status(500)
      .json({ message: "서버 에러가 발생했습니다.", error: error });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const comment = await CommentModel.findOneAndDelete({
      reviewId: id,
      content,
    });
    res.status(200).json({ message: "댓글 삭제 완료" });
  } catch (error) {
    console.error("댓글 삭제 중 에러 발생:", error);
    res
      .status(500)
      .json({ message: "서버 에러가 발생했습니다.", error: error });
  }
};
