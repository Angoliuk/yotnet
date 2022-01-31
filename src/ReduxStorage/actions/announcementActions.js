import { ADD_ANNOUNCEMENTS, UPDATE_ANNOUNCEMENTS } from "./actionsTypes";

export function setAnnouncements(announcements) {
    return{
        type: UPDATE_ANNOUNCEMENTS,
        payload: announcements,
    }
}

export function addAnnouncements(announcements) {
    return{
        type: ADD_ANNOUNCEMENTS,
        payload: announcements,
    }
}