import { ADD_ANNOUNCEMENTS, ADD_TO_END_ANNOUNCEMENTS, UPDATE_ANNOUNCEMENTS } from "./actionsTypes";

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

export function addToEndAnnouncements(announcements) {
    return{
        type: ADD_TO_END_ANNOUNCEMENTS,
        payload: announcements,
    }
}