import { combineReducers } from "redux"
import userReducers from "./reducers/userReducers"
import postReducers from "./reducers/postReducers"

export default combineReducers({
    userReducers, postReducers,
})