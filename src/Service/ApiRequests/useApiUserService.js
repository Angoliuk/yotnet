import { useHttp } from "../Http/useHttp";
import { useValidator } from "../validator/useValidator";
import { useCallback } from "react";
import { useSelector } from "react-redux";

export const useApiUserService = () => {
  const { request } = useHttp();
  const token = useSelector((state) => state.userReducers.accessToken);
  const validatorService = useValidator();

  const loginApi = useCallback(
    async (loginData) => {
      try {
        validatorService.validateUserLogin(loginData);
        const user = await request("/login", "POST", loginData);
        return user;
      } catch (e) {
        throw new Error(e.message);
      }
    },
    [request, validatorService]
  );

  const registerApi = useCallback(
    async (registerData) => {
      try {
        validatorService.validateUser(registerData);
        const user = await request("/register", "POST", registerData);
        return user;
      } catch (e) {
        throw new Error(e.message);
      }
    },
    [request, validatorService]
  );

  const getUserApi = useCallback(
    async (id) => {
      try {
        const user = await request(`/users?id=${id}`, "GET");
        return user;
      } catch (e) {
        throw new Error(e.message);
      }
    },
    [request]
  );

  const updateUserApi = useCallback(
    async (id, user) => {
      try {
        if (user.password === "") delete user.password;
        validatorService.validateUserUpdate(user);

        const updatedUser = await request(`/640/users/${id}`, "PATCH", user, {
          Authorization: `Bearer ${token}`,
        });

        return updatedUser;
      } catch (e) {
        throw new Error(e.message);
      }
    },
    [request, validatorService, token]
  );

  return {
    registerApi,
    loginApi,
    getUserApi,
    updateUserApi,
  };
};
