import { useSelector } from "react-redux";
import { useHttp } from "../Http/useHttp";
import { useValidator } from "../validator/useValidator";
import { useCallback } from "react";

export const useApiAnnouncementService = () => {
  const { request, xTotalCount } = useHttp();
  const validatorService = useValidator();
  const token = useSelector((state) => state.userReducers.accessToken);
  const getAnnouncementsApi = useCallback(
    async (page, limit) => {
      try {
        const announcementsFromDB = await request(
          `/announcements?_page=${page}&_limit=${limit}&_expand=user&_sort=createdAt&_order=desc`,
          "GET"
        );
        return announcementsFromDB;
      } catch (e) {
        throw new Error(e.message);
      }
    },
    [request]
  );

  const getUserAnnouncementsApi = useCallback(
    async (id) => {
      try {
        const announcementsFromDB = await request(
          `/announcements?_expand=user&userId_like=${id}&_sort=createdAt&_order=desc`,
          "GET"
        );
        return announcementsFromDB;
      } catch (e) {
        throw new Error(e.message);
      }
    },
    [request]
  );

  const deleteAnnouncementApi = useCallback(
    async (id) => {
      try {
        await request(`/664/announcements/${id}`, "DELETE", null, {
          Authorization: `Bearer ${token}`,
        });
      } catch (e) {
        throw new Error(e.message);
      }
    },
    [request, token]
  );

  const patchAnnouncementApi = useCallback(
    async (id, changes) => {
      try {
        validatorService.validateAnnouncement(changes);
        const updatedAnnouncement = await request(
          `/664/announcements/${id}`,
          "PATCH",
          {
            ...changes,
            updatedAt: new Date(),
          },
          { Authorization: `Bearer ${token}` }
        );
        return updatedAnnouncement;
      } catch (e) {
        throw new Error(e.message);
      }
    },
    [request, validatorService, token]
  );

  const createAnnouncementApi = useCallback(
    async (announcement) => {
      try {
        validatorService.validateAnnouncement(announcement);
        const newAnnouncementFromDB = await request(
          "/664/announcements",
          "POST",
          announcement,
          {
            Authorization: `Bearer ${token}`,
          }
        );
        return newAnnouncementFromDB;
      } catch (e) {
        throw new Error(e.message);
      }
    },
    [token, request, validatorService]
  );

  return {
    getAnnouncementsApi,
    deleteAnnouncementApi,
    patchAnnouncementApi,
    getUserAnnouncementsApi,
    createAnnouncementApi,
    xTotalCount,
  };
};
