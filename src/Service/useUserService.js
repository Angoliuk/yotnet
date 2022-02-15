import { useDispatch } from "react-redux";
import { useHttp } from "./Http/useHttp";
import { login } from "../ReduxStorage/actions/userActions";
import { useValidator } from "./validator/useValidator";
import { useCallback, useState } from "react";

export const useUserService = () => {
  const { request } = useHttp();
  const dispatch = useDispatch();
  const [userLoading, setUserLoading] = useState(false);
  const validatorService = useValidator();

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
        await request(`/users?id=${id}`, "GET", null);
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
        validatorService.validateUser(user);

        const updatedUser = await request(`/640/users/${id}`, "PATCH", user, {
          Authorization: `Bearer ${token}`,
        });
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
