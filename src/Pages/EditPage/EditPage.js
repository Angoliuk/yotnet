import React, { useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { Button } from "../../Components/Button/Button";
import { Input } from "../../Components/Input/Input";
import { Textarea } from "../../Components/Textarea/Textarea";
import { PagesWrapper } from "../../hoc/PagesWrapper/PagesWrapper";
import { useHttp } from "../../Hook/useHttp";
import validator from 'validator'
import './EditPage.css'
import { Modal } from "../../Components/Modal/Modal";
import { Loader } from "../../Components/Loader/Loader";

function EditPage(props) {

    const {id, postType} = useParams()
    const {request, loading} = useHttp()
    const {showAlertHandler} = props

    const post = 
        postType === 'post'
        ?   props.posts.find((post) => Number(id) === post.id)
        :   props.announcements.find((announcement) => Number(id) === announcement.id)
        
    const [postChanges, setPostChanges] = useState({
        body: post.body,
        title: post.title,
    })
    
    const savePostChanges = async () => {

        try {
            
            if (postType === 'post') {

                if(!validator.isLength(postChanges.title, {min: 1, max: 1000})){throw new Error('It`s required field, signs limit - 1000')}
                if(!validator.isLength(postChanges.body, {min: 1, max: 3000})){throw new Error('It`s required field, signs limit - 3000')}
                    
                await request(`/664/posts/${id}`, 'PATCH', {...postChanges, updatedAt: new Date()}, {'Authorization': `Bearer ${props.accessToken}`})
                window.location.reload();

            } else if(postType === 'announcement') {

                if(!validator.isLength(postChanges.title, {min: 1, max: 500})){throw new Error('It`s required field, signs limit - 500')}
                if(!validator.isLength(postChanges.body, {min: 1, max: 1500})){throw new Error('It`s required field, signs limit - 1500')}

                await request(`/664/announcements/${id}`, 'PATCH', {...postChanges, updatedAt: new Date()}, {'Authorization': `Bearer ${props.accessToken}`})
                window.location.reload();

            } else{
                throw new Error('Unknown type of post')
            }
            
        } catch (e) {
            showAlertHandler({
                show: true,
                text: `${e}`,
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
        <div className="editPostBlock">

            {
            loading
            ?   Modal(<Loader />)
            :   null
            }

            <Input 
                name='title' 
                value={postChanges.title} 
                placeholder="Title"
                className="editPostInput input" 
                onChange={postEditInputHandler} 
            />

            <Textarea 
                name='body'
                value={postChanges.body}
                onChange={postEditInputHandler}
                rows={5}
                className="editPostTextarea textarea"
                placeholder="What`s on your mind?"
            />

            <Button 
                text='Save'
                name='savePostButton'
                classNameBlock="editPostButtonBlock"
                className="editPostButton button"
                onClick={savePostChanges} 
            />

        </div>
    )
}

function mapStateToProps(state) {
    return{
        posts: state.postReducers.posts,
        announcements: state.announcementReducers.announcements,
        accessToken: state.userReducers.accessToken,
    }
}

export default connect(mapStateToProps)(PagesWrapper(EditPage))