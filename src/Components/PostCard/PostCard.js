import React, { useCallback, useState } from "react";
import { connect } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { useHttp } from "../../Hook/useHttp";
import { addComments, setPosts } from "../../ReduxStorage/actions/postActions";
import { Button } from "../Button/Button";
import CommentCard from "../CommentCard/CommentCard";
import { Textarea } from "../Textarea/Textarea";
import './PostCard.css'
import validator from "validator";
import { Loader } from "../Loader/Loader";

function PostCard(props) {

    const {request, loading} = useHttp()
    const {posts, setPosts, userInfo, showAlertHandler, comments, addComments, postId} = props
    const [showComments, setShowComments] = useState(false)
    const post = posts.find((post) => post.id === postId)
    const createdAtDate = new Date(post.createdAt).toLocaleString()

    const [newComment, setNewComment] = useState({
        text: ''
    })

    const dataRequest = useCallback( async (comments) =>{
        try {
            
            const commentsFromBD = await request(`/comments?postId=${postId}&_sort=createdAt&_order=desc&_expand=user`, 'GET', null)
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
                text: `Error, try to reload this page. ${e.message}`,
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

            if(validator.isLength(newComment.text, {min: 1, max: 1000})){throw new Error('It`s required field, signs limit - 1000')}

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

            setNewComment({
                ...newComment,
                text: '',
            })

        } catch (e) {
            showAlertHandler({
                show: true,
                text: `Error!!! ${e.message}`,
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
                text: `Error, try to delete post again. ${e.message}`,
                type: 'error',
            })
        }
    }

    const ButtonsForUserPosts = () => {
        return(
            <div className="ButtonsForUserPostsBlock">

                <Link to={`/edit/post/${postId}`}>
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
                        <NavLink to={`/profile/${post.userId}`}><img alt='author pic' className="postAuthorPic"  src={post?.user?.avatar ? post.user.avatar : "https://picsum.photos/60"}/></ NavLink>
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

                {
                showComments
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

                        {
                        loading
                        ?   comments.filter((comment) => comment.postId === postId).length > 0
                            ?   <div>

                                    <div className="postLoaderInCommentsBlock"><Loader /></div>
                                    <CommentsBlock />

                                </div>
                            :   <div className="postLoaderInCommentsBlock"><Loader /></div>
                        :   comments.filter((comment) => comment.postId === postId).length > 0
                            ?   <CommentsBlock />
                            :   <p className="textNoComments"> You can write first comment<svg className="svgNoComments" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 32 32"><path fill="none" stroke="#29abe2" stroke-linecap="round" stroke-linejoin="round" d="M23.5,27.5H6.5l-1-15.19a.76.76,0,0,1,.77-.81H10a1.11,1.11,0,0,1,.89.44l1.22,1.56H23.5v2"/><path fill="none" stroke="#29abe2" stroke-linecap="round" stroke-linejoin="round" d="M26.3,20.7l.84-3.2H9.25L6.5,27.5H23.41a1.42,1.42,0,0,0,1.37-1.06l.76-2.88"/><path fill="none" stroke="#29abe2" stroke-linecap="round" stroke-linejoin="round" d="M16.5,24.5h0a1.42,1.42,0,0,1,2,0h0"/><line x1="13.5" x2="14.5" y1="21.5" y2="21.5" fill="none" stroke="#29abe2" stroke-linecap="round" stroke-linejoin="round"/><line x1="20.5" x2="21.5" y1="21.5" y2="21.5" fill="none" stroke="#29abe2" stroke-linecap="round" stroke-linejoin="round"/><path fill="none" stroke="#29abe2" stroke-linecap="round" stroke-linejoin="round" d="M20.62,3.61C18.25,4,16.5,5.37,16.5,7a2.57,2.57,0,0,0,.7,1.7l-.7,2.8,2.86-1.43A8.12,8.12,0,0,0,22,10.5c3,0,5.5-1.57,5.5-3.5,0-1.6-1.69-2.95-4-3.37"/><line x1="21.25" x2="22.75" y1="6.25" y2="7.75" fill="none" stroke="#29abe2" stroke-linecap="round" stroke-linejoin="round"/><line x1="22.75" x2="21.25" y1="6.25" y2="7.75" fill="none" stroke="#29abe2" stroke-linecap="round" stroke-linejoin="round"/></svg></p>
                        }

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
