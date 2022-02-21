import { useHttp } from "../Http/useHttp";
import { useValidator } from "../validator/useValidator";
import { useCallback } from "react";
import { useSelector } from "react-redux";

export const useApiPostService = () => {
  const { request, xTotalCount } = useHttp();
  const validatorService = useValidator();
  const token = useSelector((state) => state.userReducers.accessToken);

  const getPostsApi = useCallback(
    async (page, limit) => {
      try {
        const postsFromDB = await request(
          `/posts?_page=${page}&_limit=${limit}&_expand=user&_sort=createdAt&_order=desc`,
          "GET"
        );
        return postsFromDB;
      } catch (e) {
        throw new Error(e.message);
      }
    },
    [request]
  );

  const getUserPostsApi = useCallback(
    async (id) => {
      try {
        const postsFromDB = await request(
          `/posts?_expand=user&userId_like=${id}&_sort=createdAt&_order=desc`,
          "GET"
        );
        return postsFromDB;
      } catch (e) {
        throw new Error(e.message);
      }
    },
    [request]
  );

  const deletePostApi = useCallback(
    async (id) => {
      try {
        await request(`/664/posts/${id}`, "DELETE", null, {
          Authorization: `Bearer ${token}`,
        });
      } catch (e) {
        throw new Error(e.message);
      }
    },
    [request, token]
  );

  const patchPostApi = useCallback(
    async (id, changes) => {
      try {
        validatorService.validatePost(changes);
        const updatedPost = await request(
          `/664/posts/${id}`,
          "PATCH",
          {
            ...changes,
            updatedAt: new Date(),
          },
          { Authorization: `Bearer ${token}` }
        );
        return updatedPost;
      } catch (e) {
        throw new Error(e.message);
      }
    },
    [request, validatorService, token]
  );

  const createPostApi = useCallback(
    async (post) => {
      try {
        validatorService.validatePost(post);
        const newPostFromDB = await request("/664/posts", "POST", post, {
          Authorization: `Bearer ${token}`,
        });
        return newPostFromDB;
      } catch (e) {
        throw new Error(e.message);
      }
    },
    [token, request, validatorService]
  );

  return {
    getPostsApi,
    deletePostApi,
    patchPostApi,
    getUserPostsApi,
    createPostApi,
    xTotalCount,
  };
};
