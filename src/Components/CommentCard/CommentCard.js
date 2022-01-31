import React, { useState } from "react";
import { connect } from "react-redux";
import { useHttp } from "../../Hook/useHttp";
import { setComments } from "../../ReduxStorage/actions/postActions";
import { Button } from "../Button/Button";
import { Textarea } from "../Textarea/Textarea";
import './CommentsCard.css'

function CommentCard(props) {

    const {request} = useHttp()
    const {showAlertHandler, comments, setComments, userId, user, commentId} = props
    const comment = comments.find((comment) => comment.id === commentId)
    const [editingComment, setEditingComment] = useState(false)
    const createdAtDate = new Date(comment.createdAt).toLocaleString()
    const [commentChanges, setCommentChanges] = useState({
        body: comment.body
    })

    const deleteComment = async () => {
        try {

            await request(`/comments/${commentId}`, 'DELETE', null)
            setComments(comments.filter((comment) => comment.id !== commentId))

        } catch (e) {
            showAlertHandler({
                show: true,
                text: `Error, try to delete comment again`,
                type: 'error',
            })
        }
    }

    const commentEditInputHandler = (event) => {
        setCommentChanges({
            ...commentChanges,
            [event.target.name]: event.target.value
        })
    }

    const saveChangedComment = async () => {
        try {

            const changedComment = await request(`/664/comments/${commentId}`, 'PATCH', {...commentChanges, updatedAt: new Date()}, {'Authorization': `Bearer ${user.accessToken}`})
            const newComments = Array.from(comments)
            const commentIndex = comments.findIndex((comment) => comment.id === changedComment.id)
            newComments[commentIndex] = {...changedComment, user: user}
            setComments(newComments)
            setEditingComment(false)
            
        } catch (e) {
            setEditingComment(false)
            showAlertHandler({
                show: true,
                text: 'Error, try to edit post again',
                type: 'error',
            })
        }
    }

    return(
        <div className="commentCard">
            <div className="commentInfoBlock">
                <div className="commentAuthorInfoBlock">
                    <div className="commentAuthorPicBlock">
                        <img alt='author pic' className="commentAuthorPic"  src={comment?.user?.avatar ? comment.user.avatar : "https://picsum.photos/60"}/>
                    </div>
                    <div className="commentInfoTextBlock">
                        <p>{comment.user.firstname} {comment?.user?.lastname}</p>
                        <p className="commentDate">{createdAtDate}</p>
                    </div>
                </div>
                {
                userId === comment.user.id && editingComment === false
                ?   <div className="ButtonsForUserPostsBlock">
                        <Button
                            text='Edit'
                            name={`editButton${commentId}`}
                            className="editButton button"
                            classNameBlock="editButtonBlock"
                            onClick={() => setEditingComment(true)}
                        />
                        <Button 
                            text='Delete'
                            name={`deleteButton${commentId}`}
                            className="deleteButton button"
                            onClick={deleteComment}
                        />
                    </div>
                :   null
                }
            </div>
            <div className="commentMainBlock">
                {
                userId === comment.user.id && editingComment
                ?   <>
                        <Textarea 
                            name='body'
                            value={commentChanges.body}
                            onChange={commentEditInputHandler}
                            rows={5}
                        />

                        <Button 
                            text='save changes'
                            name={`saveButton${commentId}`}
                            className="commentButton"
                            classNameBlock="commentButtonBlock"
                            onClick={saveChangedComment}
                        />
                    </>
                :   <p>{comment.body}</p>
                }
            </div>

        </div>
    )
}

function mapStateToProps(state) {
    return{
        comments: state.postReducers.comments,
        user: state.userReducers,
    }
}

function mapDispatchToProps(dispatch) {
    return{
        setComments: (comments) => dispatch(setComments(comments))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentCard)