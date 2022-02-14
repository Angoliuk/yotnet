import { useHttp } from "../Hook/useHttp";

export const useAnnouncementService = () => {
  const { request, loading, xTotalCount } = useHttp();
  const getAnnouncements = async (page, limit) =>
    await request(
      `/announcements?_page=${page}&_limit=${limit}&_expand=user&_sort=createdAt&_order=desc`,
      "GET",
      null
    );

  const getUserAnnouncements = async (id) =>
    await request(
      `/announcements?_expand=user&userId_like=${id}&_sort=createdAt&_order=desc`,
      "GET",
      null
    );

  const deleteAnnouncement = async (id, token) =>
    await request(`/664/announcements/${id}`, "DELETE", null, {
      Authorization: `Bearer ${token}`,
    });

  const patchAnnouncement = async (id, changes, token) =>
    await request(
      `/664/announcements/${id}`,
      "PATCH",
      {
        ...changes,
        updatedAt: new Date(),
      },
      { Authorization: `Bearer ${token}` }
    );

  const createAnnouncement = async (announcement, token) =>
    await request("/664/announcements", "POST", announcement, {
      Authorization: `Bearer ${token}`,
    });

  return {
    getAnnouncements,
    deleteAnnouncement,
    patchAnnouncement,
    getUserAnnouncements,
    createAnnouncement,
    loading,
    xTotalCount,
  };
};
