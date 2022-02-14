import { useDispatch, useSelector } from "react-redux";
import { addComments, setComments } from "../ReduxStorage/actions/postActions";
import { useHttp } from "./useHttp";
import validator from "validator";

export const useCommentService = () => {
  const { request, loading, xTotalCount } = useHttp();
  const dispatch = useDispatch();
  const comments = useSelector((state) => state.postReducers.comments);
  const getComments = async (id) => {
    const commentsFromDB = await request(
      `/comments?postId=${id}&_sort=createdAt&_order=desc&_expand=user`,
      "GET",
      null
    );
    if (!commentsFromDB) return null;

    const newComments = commentsFromDB.filter(
      (commentFromDB) =>
        comments.find((comment) => comment.id === commentFromDB.id) ===
        undefined
    );

    dispatch(addComments(newComments));
  };

  const deleteComment = async (id) => {
    await request(`/comments/${id}`, "DELETE", null);
    dispatch(setComments(comments.filter((comment) => comment.id !== id)));
  };

  const patchComment = async (id, changes, user, token) => {
    const changedComment = await request(
      `/664/comments/${id}`,
      "PATCH",
      {
        ...changes,
        updatedAt: new Date(),
      },
      { Authorization: `Bearer ${token}` }
    );
    const newComments = Array.from(comments);
    const commentIndex = comments.findIndex(
      (comment) => comment.id === changedComment.id
    );
    newComments[commentIndex] = { ...changes, user: user };
    setComments(newComments);
  };

  const createComment = async (comment, user, token) => {
    if (!validator.isLength(comment.text, { min: 1, max: 1000 })) {
      throw new Error("It`s required field, signs limit - 1000");
    }
    const newCommentFromDB = await request(`/664/comments`, "POST", comment, {
      Authorization: `Bearer ${token}`,
    });
    dispatch(
      addComments([
        {
          ...newCommentFromDB,
          user: {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            age: user.age,
          },
        },
      ])
    );
  };

  return {
    getComments,
    deleteComment,
    patchComment,
    createComment,
    xTotalCount,
    loading,
  };
};
