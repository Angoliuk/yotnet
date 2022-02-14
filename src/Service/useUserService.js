import { useDispatch } from "react-redux";
import { useHttp } from "./useHttp";
import { login } from "../ReduxStorage/actions/userActions";
import validator from "validator";

export const useUserService = () => {
  const { request, loading } = useHttp();
  const dispatch = useDispatch();

  const processLogin = async (loginData) => {
    if (!validator.isEmail(loginData.email)) {
      throw new Error("Enter valid Email");
    }
    if (!validator.isLength(loginData.password, { min: 6, max: undefined })) {
      throw new Error("Too short password, minimal lenght - 6");
    }
    const data = await request("/login", "POST", loginData);
    login({ ...data.user, accessToken: data.accessToken });
  };

  const processRegister = async (registerData) => {
    if (!validator.isEmail(registerData.email)) throw new Error("Wrong Email");

    if (!validator.isLength(registerData.password, { min: 6, max: undefined }))
      throw new Error("Too short password, minimal lenght - 6");

    if (!registerData.lastname || !registerData.firstname)
      throw new Error("Enter your name");

    if (registerData.age < 14) throw new Error("You need to be at least 14");

    const data = await request("/register", "POST", registerData);

    dispatch(login({ ...data.user, accessToken: data.accessToken }));
  };

  const getUser = async (id) => await request(`/users?id=${id}`, "GET", null);

  const updateUser = async (id, user, token) => {
    if (!validator.isEmail(user.email)) throw new Error("Enter valid Email");

    if (user.password.length < 6 && user.password.length > 0)
      throw new Error("Minimal lenght of password - 6");

    if (!user.lastname || !user.firstname) throw new Error("Enter your name");

    if (user.age < 14) throw new Error("You need to be at least 14");

    const updatedUser = await request(`/640/users/${id}`, "PATCH", user, {
      Authorization: `Bearer ${token}`,
    });
    dispatch(login({ ...updatedUser, accessToken: token }));
  };

  return { processRegister, processLogin, getUser, updateUser, loading };
};
