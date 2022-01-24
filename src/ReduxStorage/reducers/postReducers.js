import { ADD_COMMENTS, ADD_POSTS, UPDATE_COMMENTS, UPDATE_POSTS } from "../actions/actionsTypes"

const initialState = {
    posts: [],
    comments: [],
}

export default function postReducers(state = initialState, action) {
    switch (action.type) {
        case UPDATE_POSTS:
            return{
                ...state,
                posts: action.payload
            }

        case UPDATE_COMMENTS:
            return{
                ...state,
                comments: action.payload
            }

        case ADD_COMMENTS:
            return{
                ...state,
                comments: [...action.payload, ...state.comments],
            }

        case ADD_POSTS:
            return{
                ...state,
                posts: [...action.payload, ...state.posts],
            }
    
        default:
            return state
    }
}