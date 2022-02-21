import { useCallback, useState } from "react";
import { useApiPostService } from "../ApiRequests/useApiPostService";
import { useReduxPostService } from "../ReduxRequests/useReduxPostService";

export const usePostService = () => {
  const [postLoading, setPostLoading] = useState(false);
  const apiPostService = useApiPostService();
  const reduxPostService = useReduxPostService();
  const xTotalCount = apiPostService.xTotalCount;

  const getPosts = useCallback(
    async (page, limit) => {
      try {
        setPostLoading(true);
        const postsFromDB = await apiPostService.getPostsApi(page, limit);
        reduxPostService.setPostsRedux(postsFromDB);
      } catch (e) {
        throw new Error(e.message);
      } finally {
        setPostLoading(false);
      }
    },
    [apiPostService, reduxPostService]
  );

  const getUserPosts = useCallback(
    async (id) => {
      try {
        const postsFromDB = await apiPostService.getUserPostsApi(id);
        reduxPostService.setUserPostsRedux(postsFromDB);
      } catch (e) {
        throw new Error(e.message);
      } finally {
        setPostLoading(false);
      }
    },
    [apiPostService, reduxPostService]
  );

  const deletePost = useCallback(
    async (id) => {
      try {
        setPostLoading(true);
        await apiPostService.deletePostApi(id);
        reduxPostService.deletePostRedux(id);
      } catch (e) {
        throw new Error(e.message);
      } finally {
        setPostLoading(false);
      }
    },
    [apiPostService, reduxPostService]
  );

  const patchPost = useCallback(
    async (id, changes) => {
      try {
        setPostLoading(true);
        const updatedPost = await apiPostService.patchPostApi(id, changes);
        console.log(changes);
        reduxPostService.patchPostRedux(updatedPost);
      } catch (e) {
        throw new Error(e.message);
      } finally {
        setPostLoading(false);
      }
    },
    [apiPostService, reduxPostService]
  );

  const createPost = useCallback(
    async (post) => {
      try {
        setPostLoading(true);
        const newPostFromDB = await apiPostService.createPostApi(post);
        reduxPostService.createPostRedux(newPostFromDB);
      } catch (e) {
        throw new Error(e.message);
      } finally {
        setPostLoading(false);
      }
    },
    [apiPostService, reduxPostService]
  );

  return {
    getPosts,
    deletePost,
    patchPost,
    getUserPosts,
    createPost,
    postLoading,
    xTotalCount,
  };
};
