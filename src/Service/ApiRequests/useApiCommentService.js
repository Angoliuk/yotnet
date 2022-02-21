import { useCallback } from "react";
import { useSelector } from "react-redux";
import { useHttp } from "../Http/useHttp";
import { useValidator } from "../validator/useValidator";

export const useApiCommentService = () => {
  const { request, xTotalCount } = useHttp();
  const validatorService = useValidator();
  const token = useSelector((state) => state.userReducers.accessToken);

  const getCommentsApi = useCallback(
    async (id) => {
      try {
        const commentsFromDB = await request(
          `/comments?postId=${id}&_sort=createdAt&_order=desc&_expand=user`,
          "GET"
        );
        return commentsFromDB;
      } catch (e) {
        throw new Error(e.message);
      }
    },
    [request]
  );

  const deleteCommentApi = useCallback(
    async (id) => {
      try {
        await request(`/664/comments/${id}`, "DELETE", null, {
          Authorization: `Bearer ${token}`,
        });
      } catch (e) {
        throw new Error(e.message);
      }
    },
    [request, token]
  );

  const patchCommentApi = useCallback(
    async (id, changes) => {
      try {
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
        return changedComment;
      } catch (e) {
        throw new Error(e.message);
      }
    },
    [request, validatorService, token]
  );

  const createCommentApi = useCallback(
    async (comment) => {
      try {
        validatorService.validateComment(comment);
        const newCommentFromDB = await request(
          `/664/comments`,
          "POST",
          comment,
          {
            Authorization: `Bearer ${token}`,
          }
        );
        return newCommentFromDB;
      } catch (e) {
        throw new Error(e.message);
      }
    },
    [request, validatorService, token]
  );

  return {
    getCommentsApi,
    deleteCommentApi,
    patchCommentApi,
    createCommentApi,
    xTotalCount,
  };
};
