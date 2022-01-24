import React, { useState } from "react";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../Components/Button/Button";
import { Input } from "../../Components/Input/Input";
import { PagesWrapper } from "../../hoc/PagesWrapper/PagesWrapper";
import { useHttp } from "../../Hook/useHttp";
import validator from 'validator'

function PostPage(props) {
    const postId = Number(useParams().id)
    const post = props.posts.find((post) => postId === post.id)
    const [postChanges, setPostChanges] = useState({
        body: post.body,
        title: post.title,
    })
    const {showAlertHandler} = props
    const {request} = useHttp()
    const navigate = useNavigate()
    
    const savePostChanges = async () => {
        try {
            if (
            validator.isLength(postChanges.body, {min: 1, max: 1000}) 
            && validator.isLength(postChanges.title, {min: 1, max: 150})
            ){
                await request(`/664/posts/${postId}`, 'PATCH', {...postChanges, updatedAt: new Date()}, {'Authorization': `Bearer ${props.accessToken}`})
                navigate(-1)
            } else {
                throw new Error('Empty fields')
            }
        } catch (e) {
            showAlertHandler({
                show: true,
                text: 'Error, try to edit post again',
                type: 'error',
            })
        }
    }

    const postEditInputHandler = (event) => {
        setPostChanges({
            ...postChanges,
            [event.target.name]: event.target.value
        })
    }

    return(
        <div>
            <Input
                name='title' 
                value={postChanges.title}
                onChange={postEditInputHandler}  
            />

            <Input
                name='body' 
                value={postChanges.body}
                onChange={postEditInputHandler} 
            />

            <Button 
                text='Save'
                name='savePostButton'
                onClick={savePostChanges} 
            />
        </div>
    )
}

function mapStateToProps(state) {
    return{
        posts: state.postReducers.posts,
        accessToken: state.userReducers.accessToken,
    }
}

export default connect(mapStateToProps)(PagesWrapper(PostPage))