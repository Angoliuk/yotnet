import React, { useState } from "react";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../Components/Common/Button/Button";
import { Input } from "../../Components/Common/Input/Input";
import { Textarea } from "../../Components/Common/Textarea/Textarea";
import { PagesWrapper } from "../../hoc/PagesWrapper/PagesWrapper";
import { useHttp } from "../../Hook/useHttp";
import validator from 'validator'
import './EditPage.css'
import { Modal } from "../../Components/Common/Modal/Modal";
import { Loader } from "../../Components/Common/Loader/Loader";
import { setPosts } from "../../ReduxStorage/actions/postActions";
import { setAnnouncements } from "../../ReduxStorage/actions/announcementActions";

function EditPage(props) {

    const {id, uploadType} = useParams()
    const {request, loading} = useHttp()
    const {showAlertHandler, user, posts, announcements, setPosts, setAnnouncements} = props
    const navigate = useNavigate()

    const upload = 
        uploadType === 'post'
        ?   posts.find((post) => Number(id) === post.id)
        :   announcements.find((announcement) => Number(id) === announcement.id)
        
    const [postChanges, setPostChanges] = useState({
        body: upload.body,
        title: upload.title,
    })

    const postEditInputHandler = (event) => {

        setPostChanges({
            ...postChanges,
            [event.target.name]: event.target.value
        })
        
    }

    const savePostChanges = async () => {

        if(!validator.isLength(postChanges.title, {min: 1, max: 1000})){throw new Error('It`s required field, signs limit - 1000')}
        if(!validator.isLength(postChanges.body, {min: 1, max: 3000})){throw new Error('It`s required field, signs limit - 3000')}
            
        const changedPost = await request(
            `/664/posts/${id}`, 
            'PATCH', 
            {
                ...postChanges, 
                updatedAt: new Date()
            }, 
            {'Authorization': `Bearer ${user.accessToken}`}
        )

        const newPosts = Array.from(posts)
        const postIndex = posts.findIndex((post) => post.id === Number(id))
        newPosts[postIndex] = {...changedPost, user: user}
        setPosts(newPosts)

        navigate('/')

    }

    const saveAnnouncementChanges = async () => {

        if(!validator.isLength(postChanges.title, {min: 1, max: 500})){throw new Error('It`s required field, signs limit - 500')}
        if(!validator.isLength(postChanges.body, {min: 1, max: 1500})){throw new Error('It`s required field, signs limit - 1500')}

        const changedAnnouncement = await request(
            `/664/announcements/${id}`, 
            'PATCH', 
            {
                ...postChanges, 
                updatedAt: new Date()
            }, 
            {'Authorization': `Bearer ${user.accessToken}`}
        )

        const newAnnouncements = Array.from(announcements)
        const announcementIndex = announcements.findIndex((announcement) => announcement.id === Number(id))
        newAnnouncements[announcementIndex] = {...changedAnnouncement, user: user}
        setAnnouncements(newAnnouncements)

        navigate('/')

    }
    
    const saveUploadChanges = async () => {

        try {
            
            if (uploadType === 'post') {

                savePostChanges()

            } else if(uploadType === 'announcement') {

                saveAnnouncementChanges()

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
                rows={15}
                className="editPostTextarea textarea"
                placeholder="What`s on your mind?"
            />

            <Button 
                text='Save'
                name='savePostButton'
                classNameBlock="editPostButtonBlock"
                className="editPostButton button"
                onClick={saveUploadChanges} 
            />

        </div>
    )
}

function mapStateToProps(state) {
    return{
        posts: state.postReducers.posts,
        announcements: state.announcementReducers.announcements,
        user: state.userReducers,
    }
}

function mapDispatchToProps(dispatch) {
    return{
        setPosts: (posts) => dispatch(setPosts(posts)),
        setAnnouncements: (announcements) => dispatch(setAnnouncements(announcements))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PagesWrapper(EditPage))