import { useHttp } from "../Hook/useHttp";

export const usePostService = () => {
  const { request, loading, xTotalCount } = useHttp();
  const getPosts = async (page, limit) =>
    await request(
      `/posts?_page=${page}&_limit=${limit}&_expand=user&_sort=createdAt&_order=desc`,
      "GET",
      null
    );

  const getUserPosts = async (id) =>
    await request(
      `/posts?_expand=user&userId_like=${id}&_sort=createdAt&_order=desc`,
      "GET",
      null
    );

  const deletePost = async (id, token) =>
    await request(`/664/posts/${id}`, "DELETE", null, {
      Authorization: `Bearer ${token}`,
    });

  const patchPost = async (id, changes, token) =>
    await request(
      `/664/posts/${id}`,
      "PATCH",
      {
        ...changes,
        updatedAt: new Date(),
      },
      { Authorization: `Bearer ${token}` }
    );

  const createPost = async (post, token) =>
    await request("/664/posts", "POST", post, {
      Authorization: `Bearer ${token}`,
    });

  return {
    getPosts,
    deletePost,
    patchPost,
    getUserPosts,
    createPost,
    loading,
    xTotalCount,
  };
};
