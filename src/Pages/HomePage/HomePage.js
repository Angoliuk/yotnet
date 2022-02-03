import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button } from "../../Components/Button/Button";
import { Input } from "../../Components/Input/Input";
import { Modal } from "../../Components/Modal/Modal";
import PostCard from "../../Components/PostCard/PostCard";
import { Textarea } from "../../Components/Textarea/Textarea";
import { PagesWrapper } from "../../hoc/PagesWrapper/PagesWrapper";
import { useHttp } from "../../Hook/useHttp";
import { addPosts, addToEndPosts } from "../../ReduxStorage/actions/postActions";
import './HomePage.css'
import validator from 'validator'
import { addAnnouncements } from "../../ReduxStorage/actions/announcementActions";
import { Loader } from "../../Components/Loader/Loader";

function HomePage(props) {

    const {request} = useHttp()
    const {userInfo, showAlertHandler, posts, addToEndPosts, addAnnouncements, addPosts} = props
    const [showNewPostBlock, setShowNewPostBlock] = useState(false)
    const [pageNum, setPageNum] = useState(1)
    const [loadNewPosts, setLoadNewPosts] = useState(true)
    const [creatingNewPost, setCreatingNewPost] = useState(false)

    const [newPost, setNewPost] = useState({
        title: '',
        body: '',
        isAnnouncement: false,
    })

    const dataRequest = useCallback(async () => {

        try {     

            const postsFromDB = await request(`/posts?_page=${pageNum}&_limit=10&_expand=user&_sort=createdAt&_order=desc`, 'GET', null)
            if (!postsFromDB) return null

            const newPosts = postsFromDB.filter((postFromDB) => posts.find((post) => post.id === postFromDB.id) === undefined)
            if(!newPosts) return null
            
            addToEndPosts(newPosts)
            setPageNum(prevState => prevState + 1)
            setTimeout(() => setLoadNewPosts(false), 2000)
            
        } catch (e) {
            showAlertHandler({
                show: true,
                text: `Error, try to reload this page. ${e}`,
                type: 'error',
            })
        }

        
    }, [request, loadNewPosts])

    useEffect(() => {
        if (!loadNewPosts) {return null}
        dataRequest()
    }, [dataRequest, loadNewPosts])

    useEffect(() => {
        document.addEventListener('scroll', scrollHandler)
        return function () {
            document.removeEventListener('scroll', scrollHandler)
        }
    }, [])

    const scrollHandler = (e) => {

        if (e.target.documentElement.scrollHeight - (window.innerHeight + e.target.documentElement.scrollTop) < 100) {
            
            setLoadNewPosts(true)

        }

    }

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

            setCreatingNewPost(true)
            
            if (newPost.isAnnouncement) {

                if(!validator.isLength(newPost.title, {min: 1, max: 100})){throw new Error('It`s required field, signs limit - 100')}
                if(!validator.isLength(newPost.body, {min: 1, max: 250})){throw new Error('It`s required field, signs limit - 250')}

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

                if(!validator.isLength(newPost.title, {min: 1, max: 150})){throw new Error('It`s required field, signs limit - 150')}
                if(!validator.isLength(newPost.body, {min: 1, max: 600})){throw new Error('It`s required field, signs limit - 600')}

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
            setCreatingNewPost(false)

        } catch (e) {
            setNewPost({
                title: '',
                body: '',
            })
            setShowNewPostBlock(false)
            showAlertHandler({
                show: true,
                text: `${e}`,
                type: 'error',
            })
        }
    }

    const PostsBlock = useCallback(() => {
        return(
            posts.map((post, i) => {
                return(
                    <PostCard showAlertHandler={showAlertHandler} key={i} postId={post.id} />
                )
            })
        )
    }, [posts])

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
            creatingNewPost
            ?   Modal(<Loader />)
            :   null
            }   

            <PostsBlock />

            {
            !loadNewPosts
            ?   <div className="homeLoaderInPostsBlock"><Loader /></div>
            :   null
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
        addToEndPosts: (newPosts) => dispatch(addToEndPosts(newPosts)),
        addPosts: (newPosts) => dispatch(addPosts(newPosts)),
        addAnnouncements: (newAnnouncements) => dispatch(addAnnouncements(newAnnouncements)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PagesWrapper(HomePage))