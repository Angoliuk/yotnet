import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addComments, setComments } from "../ReduxStorage/actions/postActions";
import { useHttp } from "./Http/useHttp";
import { useValidator } from "./validator/useValidator";

export const useCommentService = () => {
  const { request, xTotalCount } = useHttp();
  const dispatch = useDispatch();
  const validatorService = useValidator();
  const [commentLoading, setCommentLoading] = useState(false);
  const comments = useSelector((state) => state.postReducers.comments);

  const getComments = useCallback(
    async (id) => {
      try {
        setCommentLoading(true);
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
      } catch (e) {
        throw new Error(e.message);
      } finally {
        setCommentLoading(false);
      }
    },
    [comments, dispatch, request]
  );

  const deleteComment = useCallback(
    async (id) => {
      try {
        setCommentLoading(true);
        await request(`/comments/${id}`, "DELETE", null);
        dispatch(setComments(comments.filter((comment) => comment.id !== id)));
      } catch (e) {
        throw new Error(e.message);
      } finally {
        setCommentLoading(false);
      }
    },
    [comments, dispatch, request]
  );

  const patchComment = useCallback(
    async (id, changes, user, token) => {
      try {
        setCommentLoading(true);
        validatorService.validateComment(changes);
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
        newComments[commentIndex] = {
          ...newComments[commentIndex],
          ...changes,
        };
        dispatch(setComments(newComments));
      } catch (e) {
        throw new Error(e.message);
      } finally {
        setCommentLoading(false);
      }
    },
    [comments, dispatch, request, validatorService]
  );

  const createComment = useCallback(
    async (comment, user, token) => {
      try {
        setCommentLoading(true);
        validatorService.validateComment(comment);
        const newCommentFromDB = await request(
          `/664/comments`,
          "POST",
          comment,
          {
            Authorization: `Bearer ${token}`,
          }
        );
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
      } catch (e) {
        throw new Error(e.message);
      } finally {
        setCommentLoading(false);
      }
    },
    [dispatch, request, validatorService]
  );

  return {
    getComments,
    deleteComment,
    patchComment,
    createComment,
    xTotalCount,
    commentLoading,
  };
};
