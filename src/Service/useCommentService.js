import { useHttp } from "../Hook/useHttp";

export const useCommentService = () => {
  const { request, loading, xTotalCount } = useHttp();
  const getComments = async (id) =>
    await request(
      `/comments?postId=${id}&_sort=createdAt&_order=desc&_expand=user`,
      "GET",
      null
    );

  const deleteComment = async (id) =>
    await request(`/comments/${id}`, "DELETE", null);

  const patchComment = async (id, changes, token) =>
    await request(
      `/664/comments/${id}`,
      "PATCH",
      {
        ...changes,
        updatedAt: new Date(),
      },
      { Authorization: `Bearer ${token}` }
    );

  const createComment = async (comment, token) =>
    await request(`/664/comments`, "POST", comment, {
      Authorization: `Bearer ${token}`,
    });

  return {
    getComments,
    deleteComment,
    patchComment,
    createComment,
    xTotalCount,
    loading,
  };
};
