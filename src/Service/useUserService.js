import { useDispatch, useSelector } from "react-redux";
import { useHttp } from "./Http/useHttp";
import { login } from "../ReduxStorage/actions/userActions";
import { useValidator } from "./validator/useValidator";
import { useCallback, useState } from "react";
import { setComments, setPosts } from "../ReduxStorage/actions/postActions";
import { setAnnouncements } from "../ReduxStorage/actions/announcementActions";

export const useUserService = () => {
  const { request } = useHttp();
  const dispatch = useDispatch();
  const [userLoading, setUserLoading] = useState(false);
  const validatorService = useValidator();
  const posts = useSelector((state) => state.postReducers.posts);
  const announcements = useSelector((state) => state.postReducers.posts);
  const comments = useSelector((state) => state.postReducers.posts);

  const processLogin = useCallback(
    async (loginData) => {
      try {
        setUserLoading(true);
        validatorService.validateUserLogin(loginData);
        const data = await request("/login", "POST", loginData);
        dispatch(login({ ...data.user, accessToken: data.accessToken }));
      } catch (e) {
        throw new Error(e.message);
      } finally {
        setUserLoading(false);
      }
    },
    [dispatch, request, validatorService]
  );

  const processRegister = useCallback(
    async (registerData) => {
      try {
        setUserLoading(true);
        validatorService.validateUser(registerData);
        const data = await request("/register", "POST", registerData);
        dispatch(login({ ...data.user, accessToken: data.accessToken }));
      } catch (e) {
        throw new Error(e.message);
      } finally {
        setUserLoading(false);
      }
    },
    [dispatch, request, validatorService]
  );

  const getUser = useCallback(
    async (id) => {
      try {
        setUserLoading(true);
        const user = await request(`/users?id=${id}`, "GET", null);
        return user;
      } catch (e) {
        throw new Error(e.message);
      } finally {
        setUserLoading(false);
      }
    },
    [request]
  );

  const updateUser = useCallback(
    async (id, user, token) => {
      try {
        setUserLoading(true);
        if (user.password === "") delete user.password;
        validatorService.validateUserUpdate(user);

        const updatedUser = await request(`/640/users/${id}`, "PATCH", user, {
          Authorization: `Bearer ${token}`,
        });

        posts
          .filter((post) => String(post.userId) === String(id))
          .map((item) => (item.user = updatedUser));
        comments
          .filter((comment) => String(comment.userId) === String(id))
          .map((item) => (item.user = updatedUser));
        announcements
          .filter((announcement) => String(announcement.userId) === String(id))
          .map((item) => (item.user = updatedUser));

        dispatch(setComments(comments));
        dispatch(setPosts(posts));
        dispatch(setAnnouncements(announcements));

        dispatch(login({ ...updatedUser, accessToken: token }));
      } catch (e) {
        throw new Error(e.message);
      } finally {
        setUserLoading(false);
      }
    },
    [dispatch, request, validatorService]
  );

  return { processRegister, processLogin, getUser, updateUser, userLoading };
};
