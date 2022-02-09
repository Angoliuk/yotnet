import React, { useCallback, useState,  } from "react";
import { connect } from "react-redux";
import validator from 'validator'
import { useHttp } from "../../../Hook/useHttp";
import { Button } from "../../Common/Button/Button";
import { Textarea } from "../../Common/Textarea/Textarea";
import { Input } from "../../Common/Input/Input";
import { Modal } from "../../Common/Modal/Modal";
import { addPosts } from "../../../ReduxStorage/actions/postActions";
import { addAnnouncements } from "../../../ReduxStorage/actions/announcementActions";
import { Loader } from "../../Common/Loader/Loader";
import "./NewUploadBlock.css"

const NewUploadBlock = (props) => {

    const {request} = useHttp()
    const {userInfo, showAlertHandler, addAnnouncements, addPosts} = props

    const [showNewPostBlock, setShowNewPostBlock] = useState(false)
    const [creatingNewPost, setCreatingNewPost] = useState(false)

    const [newPost, setNewPost] = useState({
        title: '',
        body: '',
        isAnnouncement: false,
    })

    const newPostInputHandler = useCallback((event) => {

        event.target.name === "isAnnouncement"
        ?   setNewPost({
                ...newPost,
                [event.target.name]: event.target.checked,
            })
        :   setNewPost({
                ...newPost,
                [event.target.name]: event.target.value,
            })
        
    }, [newPost])

    const createPost = async () => {

        if(!validator.isLength(newPost.title, {min: 1, max: 1000})){throw new Error('It`s required field, signs limit - 1000')}
        if(!validator.isLength(newPost.body, {min: 1, max: 3000})){throw new Error('It`s required field, signs limit - 3000')}

        const newPostFromDB = await request(
            '/664/posts', 
            'POST', 
            {
                title: newPost.title, 
                body: newPost.body, 
                createdAt: new Date(), 
                updatedAt: new Date(), 
                userId: userInfo.id
            }, 
            {'Authorization': `Bearer ${userInfo.accessToken}`}
        )

        addPosts([{
            ...newPostFromDB,
            user: {
                id: userInfo.id, 
                firstname: userInfo.firstname, 
                lastname: userInfo.lastname, 
                email: userInfo.email, 
                age: userInfo.age,
            }
        }])
    }

    const createAnnouncement = async () => {

        if(!validator.isLength(newPost.title, {min: 1, max: 500})){throw new Error('It`s required field, signs limit - 500')}
        if(!validator.isLength(newPost.body, {min: 1, max: 1500})){throw new Error('It`s required field, signs limit - 1500')}

        const newAnnouncementFromDB = await request(
            '/664/announcements', 
            'POST', 
            {
                title: newPost.title, 
                body: newPost.body, 
                createdAt: new Date(), 
                updatedAt: new Date(), 
                userId: userInfo.id
            }, 
            {'Authorization': `Bearer ${userInfo.accessToken}`}
        )

        addAnnouncements([{
            ...newAnnouncementFromDB,
            user: {
                id: userInfo.id, 
                firstname: userInfo.firstname, 
                lastname: userInfo.lastname, 
                email: userInfo.email, 
                age: userInfo.age,
            }
        }])
    }

    const createNewPost = async () => {
        
        try {

            setCreatingNewPost(true)
            
            newPost.isAnnouncement
            ?   createAnnouncement()
            :   createPost()

        } catch (e) {
            showAlertHandler({
                show: true,
                text: `${e}`,
                type: 'error',
            })
        } finally{
            setNewPost({
                title: '',
                body: '',
            })
            setCreatingNewPost(false)
            setShowNewPostBlock(false)
        }
    }

    return(
        <>

            {
            creatingNewPost
            ?   Modal(<Loader />)
            :   null
            }   

            {
            userInfo.accessToken
            ?   <Button 
                    text='What`s on your mind?'
                    name='showNewPostBlock'
                    classNameBlock="showNewPostBlockButtonBlock"
                    className="showNewPostBlockButton button"
                    onClick={() =>setShowNewPostBlock(!showNewPostBlock)} 
                />
            :   null
            }

            {
            showNewPostBlock
            ?   Modal(
                    <div className="createPostBlock">

                        <Input 
                            name='title' 
                            value={newPost.title} 
                            placeholder="Title"
                            className="createPostInput input" 
                            onChange={newPostInputHandler} 
                            classNameBlock="createPostInputBlock"
                        />

                        <Textarea 
                            name='body'
                            value={newPost.body}
                            onChange={newPostInputHandler}
                            rows={15}
                            className="createPostTextarea textarea"
                            placeholder="What`s on your mind?"
                        />

                        <div className="isAnnouncementBlock">

                            <input 
                                onChange={newPostInputHandler} 
                                placeholder='' 
                                type="checkbox"
                                name='isAnnouncement' 
                                id="isAnnouncement"
                                className="isAnnouncementCheckbox"
                            />
                            <label htmlFor="isAnnouncement">Post as announcement</label>

                        </div>
                        
                        <Button 
                            onClick={createNewPost} 
                            text='Create' 
                            name='createPostButton' 
                            className="createPostButton button"
                        />

                        <Button 
                            onClick={() => setShowNewPostBlock(false)} 
                            text='Cancel' 
                            name='cancelCreatePostButton' 
                            className="cancelCreatePostButton button"
                        />
                        
                    </div>
                )
            :   null
            }

        </>
    )
}

function mapStateToProps(state) {
    return{
        userInfo: state.userReducers,
    }
}

function mapDispatchToProps(dispatch) {
    return{
        addPosts: (newPosts) => dispatch(addPosts(newPosts)),
        addAnnouncements: (newAnnouncements) => dispatch(addAnnouncements(newAnnouncements)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewUploadBlock)