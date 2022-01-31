import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button } from "../../Components/Button/Button";
import { Input } from "../../Components/Input/Input";
import { Modal } from "../../Components/Modal/Modal";
import PostCard from "../../Components/PostCard/PostCard";
import { Textarea } from "../../Components/Textarea/Textarea";
import { PagesWrapper } from "../../hoc/PagesWrapper/PagesWrapper";
import { useHttp } from "../../Hook/useHttp";
import { addPosts } from "../../ReduxStorage/actions/postActions";
import './HomePage.css'
import validator from 'validator'
import { addAnnouncements } from "../../ReduxStorage/actions/announcementActions";
import { Loader } from "../../Components/Loader/Loader";

function HomePage(props) {

    const {request, loading} = useHttp()

    const {userInfo, showAlertHandler, posts, addPosts, addAnnouncements} = props
    const [showNewPostBlock, setShowNewPostBlock] = useState(false)

    const dataRequest = useCallback(async () => {
        try {            
            const data = await request(`/posts?_page=1&_limit=20&_expand=user&_sort=createdAt&_order=desc`, 'GET', null)
            // &userId_like=${userId}
            //user posts and announcements
            addPosts(data)
        } catch (e) {
            showAlertHandler({
                show: true,
                text: 'Error, try to reload this page',
                type: 'error',
            })
        }
        
    }, [request, userInfo.accessToken])

    const [newPost, setNewPost] = useState({
        title: '',
        body: '',
        isAnnouncement: false,
    })

    const newPostInputHandler = useCallback((event) => {
        event.target.name === "isAnnouncement"
        ?   setNewPost({
                ...newPost,
                [event.target.name]: event.target.checked
            })
        :   setNewPost({
                ...newPost,
                [event.target.name]: event.target.value
            })
        
    }, [newPost])

    const createNewPost = async () => {
        try {
            
            if (newPost.isAnnouncement) {

                if (
                    !validator.isLength(newPost.title, {min: 1, max: 100})
                    || !validator.isLength(newPost.body, {min: 1, max: 250})
                    || !userInfo.id
                ){throw new Error('write something')}

                const newAnnouncementFromDB = await request('/664/announcements', 'POST', {title: newPost.title, body: newPost.body, createdAt: new Date(), updatedAt: new Date(), userId: userInfo.id}, {'Authorization': `Bearer ${userInfo.accessToken}`})
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

            } else {

                if (
                    !validator.isLength(newPost.title, {min: 1, max: 150})
                    || !validator.isLength(newPost.body, {min: 1, max: 600})
                    || !userInfo.id
                ){throw new Error('write something')}

                const newPostFromDB = await request('/664/posts', 'POST', {title: newPost.title, body: newPost.body, createdAt: new Date(), updatedAt: new Date(), userId: userInfo.id}, {'Authorization': `Bearer ${userInfo.accessToken}`})
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

            setShowNewPostBlock(false)
            setNewPost({
                title: '',
                body: '',
            })
        } catch (e) {
            setNewPost({
                title: '',
                body: '',
            })
            setShowNewPostBlock(false)
            showAlertHandler({
                show: true,
                text: 'Error, try to create post again',
                type: 'error',
            })
        }
    }

    const Posts = useCallback(() => {
        return(
            posts.map((post, i) => {
                return(
                    <PostCard showAlertHandler={showAlertHandler} key={i} postId={post.id} />
                )
            })
        )
    }, [posts])

    useEffect(() => {
        dataRequest()
    }, [dataRequest])

    return(
        <>
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
                        />

                        <Textarea 
                            name='body'
                            value={newPost.body}
                            onChange={newPostInputHandler}
                            rows={5}
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

            {
            posts && !loading
            ?   <Posts />
            :   Modal(<Loader />)
                
            }
        </>
    )
}

function mapStateToProps(state) {
    return{
        userInfo: state.userReducers,
        posts: state.postReducers.posts,
    }
}

function mapDispatchToProps(dispatch) {
    return{
        addPosts: (newPosts) => dispatch(addPosts(newPosts)),
        addAnnouncements: (newAnnouncements) => dispatch(addAnnouncements(newAnnouncements)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PagesWrapper(HomePage))