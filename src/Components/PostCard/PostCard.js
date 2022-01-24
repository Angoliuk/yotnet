import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { useHttp } from "../../Hook/useHttp";
import { addComments, setPosts } from "../../ReduxStorage/actions/postActions";
import { Button } from "../Button/Button";
import CommentCard from "../CommentCard/CommentCard";
import { Textarea } from "../Textarea/Textarea";
import './PostCard.css'
import validator from "validator";

function PostCard(props) {

    const [showComments, setShowComments] = useState(false)
    const {posts, setPosts, userInfo, showAlertHandler, comments, addComments, postId} = props
    const post = posts.find((post) => post.id === postId)
    const createdAtDate = new Date(post.createdAt).toLocaleString()
    const {request} = useHttp()
    const [newComment, setNewComment] = useState({
        text: ''
    })

    const dataRequest = useCallback( async (comments) =>{
        try {
            const commentsFromBD = await request(`/comments?postId=${postId}&_sort=createdAt&_order=desc&_expand=user`, 'GET', null, {'Authorization': `Bearer ${userInfo.accessToken}`})
            if (!commentsFromBD) return null
            if (comments) {
                const newComments = commentsFromBD.filter((commentFromBD) => comments.find((comment) => comment.id === commentFromBD.id) === undefined)
                addComments(newComments)
            }else{
                addComments(commentsFromBD)
            }
        } catch (e) {
            showAlertHandler({
                show: true,
                text: 'Error, try to reload this page',
                type: 'error',
            })
        } 
        }, [postId, request, addComments])

    const showCommentsHandler = () => {
        setShowComments(!showComments)
        if (!showComments) {
            dataRequest(comments)
        }
    }

    const newCommentInputHandler = (event) => {
        setNewComment({
            ...newComment,
            [event.target.name]: event.target.value
        })
    }

    const createNewComment = async () => {
        try {
            if (
            validator.isLength(newComment.text, {min: 1, max: 1000}) 
            && userInfo.id
            ){
                const newCommentFromBD = await request(`/664/comments`, 'POST', {body: newComment.text, createdAt: new Date(), updatedAt: new Date(), postId: postId, userId: userInfo.id}, {'Authorization': `Bearer ${userInfo.accessToken}`})
                addComments([{
                        ...newCommentFromBD, 
                        user: {
                            id: userInfo.id, 
                            firstname: userInfo.firstname, 
                            lastname: userInfo.lastname, 
                            email: userInfo.email, 
                            age:userInfo.age,
                        }
                    }])
            } else {
                throw new Error('write something')
            }
            setNewComment({
                ...newComment,
                text: '',
            })
        } catch (e) {
            showAlertHandler({
                show: true,
                text: `Error, try to create comment again`,
                type: 'error',
            })
        }
    }

    const deletePost = async () => {
        try {
            await request(`/664/posts/${postId}`, 'DELETE', null, {'Authorization': `Bearer ${userInfo.accessToken}`})
            setPosts(posts.filter((post) => post.id !== postId))
        } catch (e) {
            showAlertHandler({
                show: true,
                text: `Error, try to delete post again`,
                type: 'error',
            })
        }
    }

    const ButtonsForUserPosts = () => {
        return(
            <div className="ButtonsForUserPostsBlock">
                <Link to={`/post/${postId}`}>
                    <Button
                        text='Edit'
                        name={`editButton${postId}`}
                        className="editButton button"
                        classNameBlock="editButtonBlock"
                    />
                </Link>
                <Button 
                    text='Delete'
                    name={`deleteButton${postId}`}
                    className="deleteButton button"
                    onClick={deletePost}
                />
            </div>
        )
    }

    const CommentsBlock = useCallback(() => {
        return(
            comments
                .filter((comment) => comment.postId === postId)
                    .map((comment) => <CommentCard key={comment.id} commentId={comment.id} userId={userInfo.id} showAlertHandler={props.showAlertHandler}/>)
        )
    }, [comments, postId, userInfo.id])

    return(
        <div className="postCard">
            <div className="postInfoBlock">
                <div className="postAuthorInfoBlock">
                    <div className="postAuthorPicBlock">
                        <img alt='author pic' className="postAuthorPic"  src={post?.user?.avatar ? post.user.avatar : "https://picsum.photos/60"}/>
                    </div>
                    <div className="postInfoTextBlock">
                        <p>{post.user.firstname} {post.user.lastname}</p>
                        <p className="postDate">{createdAtDate}</p>
                    </div>
                </div>
                {
                userInfo.id === post.user.id
                ?   <ButtonsForUserPosts />
                :   null
                }
            </div>
            <div className="postMainBlock">
                <h3>{post.title}</h3>
                <p>{post.body}</p>
            </div>
            <div>
                <p className="showCommentsText" onClick={showCommentsHandler}>
                    comments 
                    {
                    showComments 
                        ?   <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path d="M12 21l-12-18h24z"/></svg>
                        :   <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path d="M21 12l-18 12v-24z"/></svg>
                    }
                </p>
                {showComments && comments
                    ?   <div>
                            {
                            userInfo.accessToken
                            ?   <div>
                                    <Textarea 
                                        name='text'
                                        value={newComment.text}
                                        onChange={newCommentInputHandler}
                                        rows={5}
                                    />

                                    <Button
                                        text='comment'
                                        name={`commentButton${postId}`}
                                        className="commentButton"
                                        classNameBlock="commentButtonBlock"
                                        onClick={createNewComment}
                                    />
                                </div>
                            :   null
                            }
                            <CommentsBlock />
                        </div>
                    :   null
                }
            </div>

        </div>
    )
}

function mapStateToProps(state) {
    return{
        userInfo: state.userReducers,
        posts: state.postReducers.posts,
        comments: state.postReducers.comments,
    }
}

function mapDispatchToProps(dispatch) {
    return{
        setPosts: (posts) => dispatch(setPosts(posts)),
        addComments: (newComments) => dispatch(addComments(newComments))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostCard)
