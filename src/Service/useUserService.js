import { useHttp } from "../Hook/useHttp";

export const useUserService = () => {
  const { request, loading } = useHttp();
  const login = async (loginData) => await request("/login", "POST", loginData);

  const register = async (registerData) =>
    await request("/register", "POST", registerData);

  const getUser = async (id) => await request(`/users?id=${id}`, "GET", null);

  const updateUser = async (id, user, token) =>
    await request(`/640/users/${id}`, "PATCH", user, {
      Authorization: `Bearer ${token}`,
    });

  return { register, login, getUser, updateUser, loading };
};
