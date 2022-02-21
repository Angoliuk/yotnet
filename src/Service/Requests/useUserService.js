import { useCallback, useState } from "react";
import { useApiUserService } from "../ApiRequests/useApiUserService";
import { useReduxUserService } from "../ReduxRequests/useReduxUserService";

export const useUserService = () => {
  const [userLoading, setUserLoading] = useState(false);
  const apiUserService = useApiUserService();
  const reduxUserService = useReduxUserService();

  const login = useCallback(
    async (loginData) => {
      try {
        setUserLoading(true);
        const user = await apiUserService.loginApi(loginData);
        reduxUserService.loginRedux(user);
      } catch (e) {
        throw new Error(e.message);
      } finally {
        setUserLoading(false);
      }
    },
    [apiUserService, reduxUserService]
  );

  const register = useCallback(
    async (registerData) => {
      try {
        setUserLoading(true);
        const user = await apiUserService.registerApi(registerData);
        reduxUserService.loginRedux(user);
      } catch (e) {
        throw new Error(e.message);
      } finally {
        setUserLoading(false);
      }
    },
    [apiUserService, reduxUserService]
  );

  const updateUser = useCallback(
    async (id, user) => {
      try {
        setUserLoading(true);
        const updatedUser = await apiUserService.updateUserApi(id, user);
        reduxUserService.updateUserRedux(updatedUser);
      } catch (e) {
        throw new Error(e.message);
      } finally {
        setUserLoading(false);
      }
    },
    [apiUserService, reduxUserService]
  );

  return {
    register,
    login,
    updateUser,
    userLoading,
  };
};
