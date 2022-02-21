import { useCallback, useState } from "react";
import { useApiAnnouncementService } from "../ApiRequests/useApiAnnouncementService";
import { useReduxAnnouncementService } from "../ReduxRequests/useReduxAnnouncementService";

export const useAnnouncementService = () => {
  const [announcementLoading, setAnnouncementLoading] = useState(false);
  const apiAnnouncementService = useApiAnnouncementService();
  const reduxAnnouncementService = useReduxAnnouncementService();
  const xTotalCount = apiAnnouncementService.xTotalCount;
  const getAnnouncements = useCallback(
    async (page, limit) => {
      try {
        setAnnouncementLoading(true);
        const announcementsFromDB =
          await apiAnnouncementService.getAnnouncementsApi(page, limit);
        reduxAnnouncementService.setAnnouncementsRedux(announcementsFromDB);
      } catch (e) {
        throw new Error(e.message);
      } finally {
        setAnnouncementLoading(false);
      }
    },
    [apiAnnouncementService, reduxAnnouncementService]
  );

  const getUserAnnouncements = useCallback(
    async (id) => {
      try {
        setAnnouncementLoading(true);
        const announcementsFromDB =
          await apiAnnouncementService.getUserAnnouncementsApi(id);
        reduxAnnouncementService.setUserAnnouncementsRedux(announcementsFromDB);
      } catch (e) {
        throw new Error(e.message);
      } finally {
        setAnnouncementLoading(false);
      }
    },
    [apiAnnouncementService, reduxAnnouncementService]
  );

  const deleteAnnouncement = useCallback(
    async (id) => {
      try {
        setAnnouncementLoading(true);
        await apiAnnouncementService.deleteAnnouncementApi(id);
        reduxAnnouncementService.deleteAnnouncementRedux(id);
      } catch (e) {
        throw new Error(e.message);
      } finally {
        setAnnouncementLoading(false);
      }
    },
    [apiAnnouncementService, reduxAnnouncementService]
  );

  const patchAnnouncement = useCallback(
    async (id, changes) => {
      try {
        setAnnouncementLoading(true);
        const updatedAnnouncement =
          await apiAnnouncementService.patchAnnouncementApi(id, changes);
        reduxAnnouncementService.patchAnnouncementRedux(updatedAnnouncement);
      } catch (e) {
        throw new Error(e.message);
      } finally {
        setAnnouncementLoading(false);
      }
    },
    [apiAnnouncementService, reduxAnnouncementService]
  );

  const createAnnouncement = useCallback(
    async (announcement) => {
      try {
        setAnnouncementLoading(true);
        const newAnnouncementFromDB =
          await apiAnnouncementService.createAnnouncementApi(announcement);
        reduxAnnouncementService.createAnnouncementRedux(newAnnouncementFromDB);
      } catch (e) {
        throw new Error(e.message);
      } finally {
        setAnnouncementLoading(false);
      }
    },
    [apiAnnouncementService, reduxAnnouncementService]
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
