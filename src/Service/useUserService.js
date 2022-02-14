import { useDispatch } from "react-redux";
import { useHttp } from "./Http/useHttp";
import { login } from "../ReduxStorage/actions/userActions";
import { useValidator } from "./validator/useValidator";

export const useUserService = () => {
  const { request, loading } = useHttp();
  const dispatch = useDispatch();
  const validatorService = useValidator();

  const processLogin = async (loginData) => {
    validatorService.validateUserLogin(loginData);
    const data = await request("/login", "POST", loginData);
    login({ ...data.user, accessToken: data.accessToken });
  };

  const processRegister = async (registerData) => {
    validatorService.validateUser(registerData);

    const data = await request("/registedaders", "POST", registerData);

    dispatch(login({ ...data.user, accessToken: data.accessToken }));
  };

  const getUser = async (id) => await request(`/users?id=${id}`, "GET", null);

  const updateUser = async (id, user, token) => {
    validatorService.validateUser(user);

    const updatedUser = await request(`/640/users/${id}`, "PATCH", user, {
      Authorization: `Bearer ${token}`,
    });
    dispatch(login({ ...updatedUser, accessToken: token }));
  };

  return { processRegister, processLogin, getUser, updateUser, loading };
};
