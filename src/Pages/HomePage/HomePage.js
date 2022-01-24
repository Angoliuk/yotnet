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

function HomePage(props) {

    const {request} = useHttp()

    const {userInfo, showAlertHandler, posts, addPosts} = props
    const [showNewPostBlock, setShowNewPostBlock] = useState(false)

    const dataRequest = useCallback(async () => {
        try {            
            const data = await request(`/posts?_page=1&_limit=20&_expand=user&_sort=createdAt&_order=desc`, 'GET', null)
            // &userId_like=${userId}
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
    })

    const newPostInputHandler = useCallback((event) => {
        setNewPost({
            ...newPost,
            [event.target.name]: event.target.value
        })
    }, [newPost])

    const createNewPost = async () => {
        try {
            if (
            validator.isLength(newPost.title, {min: 1, max: 150})
            && validator.isLength(newPost.body, {min: 1, max: 1000})
            && userInfo.id
            ){
                const newPostFromBD = await request('/664/posts', 'POST', {title: newPost.title, body: newPost.body, createdAt: new Date(), updatedAt: new Date(), userId: userInfo.id}, {'Authorization': `Bearer ${userInfo.accessToken}`})
                addPosts([{
                    ...newPostFromBD,
                    user: {
                        id: userInfo.id, 
                        firstname: userInfo.firstname, 
                        lastname: userInfo.lastname, 
                        email: userInfo.email, 
                        age: userInfo.age,
                    }
                }])
            } else {
                throw new Error('write something')
            }
            setShowNewPostBlock(false)
            setNewPost({
                title: '',
                body: '',
            })
        } catch (e) {
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

                        <Button 
                            onClick={createNewPost} 
                            text='Create post' 
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
            posts
            ?   <Posts />
            :   <div>loading</div>
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
        addPosts: (newPosts) => dispatch(addPosts(newPosts))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PagesWrapper(HomePage))