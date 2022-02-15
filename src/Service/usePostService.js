import { useDispatch, useSelector } from "react-redux";
import { useHttp } from "./Http/useHttp";
import {
  addPosts,
  addToEndPosts,
  setPosts,
} from "../ReduxStorage/actions/postActions";
import { useValidator } from "./validator/useValidator";
import { useCallback, useState } from "react";

export const usePostService = () => {
  const { request, xTotalCount } = useHttp();
  const dispatch = useDispatch();
  const validatorService = useValidator();
  const [postLoading, setPostLoading] = useState(false);
  const posts = useSelector((state) => state.postReducers.posts);

  const getPosts = useCallback(
    async (page, limit) => {
      try {
        setPostLoading(true);
        const postsFromDB = await request(
          `/posts?_page=${page}&_limit=${limit}&_expand=user&_sort=createdAt&_order=desc`,
          "GET",
          null
        );
        if (!postsFromDB) return null;
        const newPosts = postsFromDB.filter(
          (postFromDB) =>
            posts.find((post) => post.id === postFromDB.id) === undefined
        );
        //filter posts that are already in storage
        if (!newPosts) return null;

        dispatch(addToEndPosts(newPosts));
      } catch (e) {
        throw new Error(e.message);
      } finally {
        setPostLoading(false);
      }
    },
    [dispatch, posts, request]
  );

  const getUserPosts = useCallback(
    async (id) => {
      try {
        setPostLoading(true);
        const postsFromDB = await request(
          `/posts?_expand=user&userId_like=${id}&_sort=createdAt&_order=desc`,
          "GET",
          null
        );
        if (!postsFromDB) return null;

        const newPosts = postsFromDB.filter(
          (postFromDB) =>
            posts.find((post) => post.id === postFromDB.id) === undefined
        );
        if (!newPosts) return null;

        dispatch(addPosts(newPosts));
      } catch (e) {
        throw new Error(e.message);
      } finally {
        setPostLoading(false);
      }
    },
    [dispatch, posts, request]
  );

  const deletePost = useCallback(
    async (id, token) => {
      try {
        setPostLoading(true);
        await request(`/664/posts/${id}`, "DELETE", null, {
          Authorization: `Bearer ${token}`,
        });
        dispatch(setPosts(posts.filter((post) => post.id !== id)));
      } catch (e) {
        throw new Error(e.message);
      } finally {
        setPostLoading(false);
      }
    },
    [dispatch, posts, request]
  );

  const patchPost = useCallback(
    async (id, changes, user, token) => {
      try {
        setPostLoading(true);
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
        const newPosts = Array.from(posts);
        const postIndex = posts.findIndex((post) => post.id === Number(id));
        newPosts[postIndex] = { ...updatedPost, user: user };
        dispatch(setPosts(newPosts));
      } catch (e) {
        throw new Error(e.message);
      } finally {
        setPostLoading(false);
      }
    },
    [dispatch, posts, request, validatorService]
  );

  const createPost = useCallback(
    async (post, user, token) => {
      try {
        setPostLoading(true);
        validatorService.validatePost(post);
        const newPostFromDB = await request("/664/posts", "POST", post, {
          Authorization: `Bearer ${token}`,
        });
        dispatch(
          addPosts([
            {
              ...newPostFromDB,
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
        setPostLoading(false);
      }
    },
    [dispatch, request, validatorService]
  );

  return {
    getPosts,
    deletePost,
    patchPost,
    getUserPosts,
    createPost,
    xTotalCount,
    postLoading,
  };
};
