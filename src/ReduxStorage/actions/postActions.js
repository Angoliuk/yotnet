import { ADD_COMMENTS, ADD_POSTS, UPDATE_COMMENTS, UPDATE_POSTS } from "./actionsTypes";

export function setPosts(posts) {
    return{
        type: UPDATE_POSTS,
        payload: posts
    }
}

export function setComments(comments) {
    return{
        type: UPDATE_COMMENTS,
        payload: comments 
    }
}

export function addComments(comments) {
    return{
        type: ADD_COMMENTS,
        payload: comments
    }
}

export function addPosts(posts) {
    return{
        type: ADD_POSTS,
        payload: posts 
    }
}