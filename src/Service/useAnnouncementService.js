import { useDispatch, useSelector } from "react-redux";
import { useHttp } from "./useHttp";
import {
  addAnnouncements,
  addToEndAnnouncements,
  setAnnouncements,
} from "../ReduxStorage/actions/announcementActions";
import validator from "validator";

export const useAnnouncementService = () => {
  const { request, loading, xTotalCount } = useHttp();
  const dispatch = useDispatch();
  const announcements = useSelector(
    (state) => state.announcementReducers.announcements
  );
  const getAnnouncements = async (page, limit) => {
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
  };

  const getUserAnnouncements = async (id) => {
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
  };

  const deleteAnnouncement = async (id, token) => {
    await request(`/664/announcements/${id}`, "DELETE", null, {
      Authorization: `Bearer ${token}`,
    });
    setAnnouncements(
      announcements.filter((announcement) => announcement.id !== id)
    );
  };

  const patchAnnouncement = async (id, changes, user, token) => {
    if (!validator.isLength(changes.title, { min: 1, max: 500 })) {
      throw new Error("It`s required field, signs limit - 500");
    }
    if (!validator.isLength(changes.body, { min: 1, max: 1500 })) {
      throw new Error("It`s required field, signs limit - 1500");
    }
    await request(
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
      ...changes,
      user: user,
    };
    dispatch(setAnnouncements(newAnnouncements));
  };

  const createAnnouncement = async (announcement, user, token) => {
    if (!validator.isLength(announcement.title, { min: 1, max: 500 })) {
      throw new Error("It`s required field, signs limit - 500");
    }
    if (!validator.isLength(announcement.body, { min: 1, max: 1500 })) {
      throw new Error("It`s required field, signs limit - 1500");
    }
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
  };

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
