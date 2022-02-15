import { useDispatch, useSelector } from "react-redux";
import { useHttp } from "./Http/useHttp";
import {
  addAnnouncements,
  addToEndAnnouncements,
  setAnnouncements,
} from "../ReduxStorage/actions/announcementActions";
import { useValidator } from "./validator/useValidator";
import { useCallback, useState } from "react";

export const useAnnouncementService = () => {
  const { request, xTotalCount } = useHttp();
  const dispatch = useDispatch();
  const validatorService = useValidator();
  const [announcementLoading, setAnnouncementLoading] = useState(false);
  const announcements = useSelector(
    (state) => state.announcementReducers.announcements
  );
  const getAnnouncements = useCallback(
    async (page, limit) => {
      try {
        setAnnouncementLoading(true);
        const announcementsFromDB = await request(
          `/announcements?_page=${page}&_limit=${limit}&_expand=user&_sort=createdAt&_order=desc`,
          "GET",
          null
        );
        if (!announcementsFromDB) return null;

        const newAnnouncements = announcementsFromDB.filter(
          (announcementFromDB) =>
            announcements.find(
              (announcement) => announcement.id === announcementFromDB.id
            ) === undefined
        );
        //filter announcements that are already in storage

        if (!newAnnouncements) return null;

        dispatch(addToEndAnnouncements(newAnnouncements));
      } catch (e) {
        throw new Error(e.message);
      } finally {
        setAnnouncementLoading(false);
      }
    },
    [dispatch, announcements, request]
  );

  const getUserAnnouncements = useCallback(
    async (id) => {
      try {
        setAnnouncementLoading(true);
        const announcementsFromDB = await request(
          `/announcements?_expand=user&userId_like=${id}&_sort=createdAt&_order=desc`,
          "GET",
          null
        );
        if (!announcementsFromDB) return null;

        const newAnnouncements = announcementsFromDB.filter(
          (announcementsFromDB) =>
            announcements.find(
              (announcement) => announcement.id === announcementsFromDB.id
            ) === undefined
        );
        if (!newAnnouncements) return null;

        dispatch(addAnnouncements(newAnnouncements));
      } catch (e) {
        throw new Error(e.message);
      } finally {
        setAnnouncementLoading(false);
      }
    },
    [dispatch, announcements, request]
  );

  const deleteAnnouncement = useCallback(
    async (id, token) => {
      try {
        setAnnouncementLoading(true);
        await request(`/664/announcements/${id}`, "DELETE", null, {
          Authorization: `Bearer ${token}`,
        });
        dispatch(
          setAnnouncements(
            announcements.filter((announcement) => announcement.id !== id)
          )
        );
      } catch (e) {
        throw new Error(e.message);
      } finally {
        setAnnouncementLoading(false);
      }
    },
    [dispatch, announcements, request]
  );

  const patchAnnouncement = useCallback(
    async (id, changes, user, token) => {
      try {
        setAnnouncementLoading(true);
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
        const newAnnouncements = Array.from(announcements);
        const announcementIndex = announcements.findIndex(
          (announcement) => announcement.id === Number(id)
        );
        newAnnouncements[announcementIndex] = {
          ...updatedAnnouncement,
          user: user,
        };
        dispatch(setAnnouncements(newAnnouncements));
      } catch (e) {
        throw new Error(e.message);
      } finally {
        setAnnouncementLoading(false);
      }
    },
    [dispatch, announcements, request, validatorService]
  );

  const createAnnouncement = useCallback(
    async (announcement, user, token) => {
      try {
        setAnnouncementLoading(true);
        validatorService.validateAnnouncement(announcement);
        const newAnnouncementFromDB = await request(
          "/664/announcements",
          "POST",
          announcement,
          {
            Authorization: `Bearer ${token}`,
          }
        );
        dispatch(
          addAnnouncements([
            {
              ...newAnnouncementFromDB,
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
      } catch (e) {
        throw new Error(e.message);
      } finally {
        setAnnouncementLoading(false);
      }
    },
    [dispatch, request, validatorService]
  );

  return {
    getAnnouncements,
    deleteAnnouncement,
    patchAnnouncement,
    getUserAnnouncements,
    createAnnouncement,
    announcementLoading,
    xTotalCount,
  };
};
