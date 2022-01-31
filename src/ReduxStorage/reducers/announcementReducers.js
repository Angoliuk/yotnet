import { ADD_ANNOUNCEMENTS, UPDATE_ANNOUNCEMENTS } from "../actions/actionsTypes";


const initialState = {
    announcements: [],
}

export default function announcementReducers(state = initialState, action) {
    switch (action.type) {
        case ADD_ANNOUNCEMENTS:
            return{
                ...state,
                announcements: [...state.announcements, ...action.payload]
            } 

        case UPDATE_ANNOUNCEMENTS:
            return{
                ...state,
                announcements: action.payload
            }
    
        default:
            return state
    }
}