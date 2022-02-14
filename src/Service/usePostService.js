import { useDispatch, useSelector } from "react-redux";
import { useHttp } from "./Http/useHttp";
import {
  addPosts,
  addToEndPosts,
  setPosts,
} from "../ReduxStorage/actions/postActions";
import { useValidator } from "./validator/useValidator";

export const usePostService = () => {
  const { request, loading, xTotalCount } = useHttp();
  const dispatch = useDispatch();
  const validatorService = useValidator();
  const posts = useSelector((state) => state.postReducers.posts);
  const getPosts = async (page, limit) => {
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
  };

  const getUserPosts = async (id) => {
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
  };

  const deletePost = async (id, token) => {
    await request(`/664/posts/${id}`, "DELETE", null, {
      Authorization: `Bearer ${token}`,
    });
    setPosts(posts.filter((post) => post.id !== id));
  };

  const patchPost = async (id, changes, user, token) => {
    validatorService.validatePost(changes);
    await request(
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
    newPosts[postIndex] = { ...changes, user: user };
    dispatch(setPosts(newPosts));
  };

  const createPost = async (post, user, token) => {
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
  };

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
