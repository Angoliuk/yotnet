import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../../Components/Button/Button";
import InputsWithUserData from "../../Components/InputsWithUserData/InputsWithUserData";
import { PagesWrapper } from "../../hoc/PagesWrapper/PagesWrapper";
import { useHttp } from "../../Hook/useHttp";
import validator from "validator";
import { connect } from "react-redux";
import { login } from "../../ReduxStorage/actions/userActions";
import { Input } from "../../Components/Input/Input";
import './ProfilePage.css'
import { Loader } from "../../Components/Loader/Loader";
import { Modal } from "../../Components/Modal/Modal";
import PostCard from "../../Components/PostCard/PostCard";
import AnnouncementCard from "../../Components/AnnouncementCard/AnnouncementCard";
import { addPosts } from "../../ReduxStorage/actions/postActions";
import { addAnnouncements } from "../../ReduxStorage/actions/announcementActions";

function ProfilePage(props) {

    const {request, loading} = useHttp()
    const {showAlertHandler, login, accessToken, userId, addAnnouncements, addPosts, posts, announcements} = props
    const [newPassword, setNewPassword] = useState('')
    const [infoType, setInfoType] = useState('personal')
    const [showAvatarsBlock, setShowAvatarsBlock] = useState(false)

    const id = useParams().id
    const [userInfo, setUserInfo] = useState({
        email: '',
        firstname: '',
        lastname: '',
        age: 0,
        avatar: "https://picsum.photos/60",
    })

    const dataRequest = useCallback( async() => {

        try {

            if (infoType === 'personal') {

                const user = await request(`/users?id=${id}`, 'GET', null)
                delete user[0].password
                setUserInfo(user[0])

            } else if(infoType === 'announcements'){

                const announcementsFromDB = await request(`/announcements?_expand=user&userId_like=${id}&_sort=createdAt&_order=desc`, 'GET', null)
                if (!announcementsFromDB) return null

                const newAnnouncements = announcementsFromDB.filter((announcementsFromDB) => announcements.find((announcement) => announcement.id === announcementsFromDB.id) === undefined)
                if(!newAnnouncements) return null

                addAnnouncements(newAnnouncements)

            }else if(infoType === 'posts'){

                const postsFromDB = await request(`/posts?_expand=user&userId_like=${id}&_sort=createdAt&_order=desc`, 'GET', null)
                if (!postsFromDB) return null

                const newPosts = postsFromDB.filter((postFromDB) => posts.find((post) => post.id === postFromDB.id) === undefined)
                if(!newPosts) return null

                addPosts(newPosts)    
                  
            }else{
                throw new Error('unknown info section')
            }
            

        } catch (e) {
            showAlertHandler({
                show: true,
                text: `Error, try to reload this page. ${e}`,
                type: 'error',
            })
        }

    }, [id, request, infoType])

    const inputChangeHandler = (event) => {

        setUserInfo({
            ...userInfo,
            [event.target.name]: event.target.value
        })

    }

    const passwordInputChangeHandler = (event) => {

        setNewPassword(event.target.value)

    }

    const avatarChangeHandler = (event) => {

        setUserInfo({
            ...userInfo,
            avatar: event.target.src
        })

        setShowAvatarsBlock(!showAvatarsBlock)

    }

    const updateUserProfile = async () => {

        try {

            if(!validator.isEmail(userInfo.email)){throw new Error('Enter valid Email')}
            if(newPassword.length < 6 && newPassword.length > 0){throw new Error('Minimal lenght of password - 6')}
            if(!userInfo.lastname || !userInfo.firstname){throw new Error('Enter your name')}
            if(userInfo.age < 14){throw new Error('You need to be at least 14')}

            const updatedUser = await request(`/640/users/${id}`, 'PATCH', newPassword.length >= 6 ? {...userInfo, password: newPassword} : userInfo, {'Authorization': `Bearer ${accessToken}`} )
            login({...updatedUser, accessToken: accessToken})
            
            showAlertHandler({
                show: true,
                text: `Everything successfully saved`,
                type: 'success',
            })

        } catch (e) {
            showAlertHandler({
                show: true,
                text: `${e}`,
                type: 'error',
            })
        }

    }

    const changeInfoType = (e) => {
        setInfoType(e.target.name)
    }

    const UserPersonalInfoBlock = () => {
        return(
            <div className="profilePagePersonalMainBlock">
                <p className="blockName">Information about {userId === Number(id) ? 'you' : userInfo.firstname}</p>
                {
                userId === Number(id)
                ?   <div>

                        <InputsWithUserData 
                            showPassword={false}
                            stateForInputs={userInfo} 
                            onChangeInput={inputChangeHandler}
                            onChangeAvatar={avatarChangeHandler}
                            showAvatarsBlock={showAvatarsBlock}
                        />

                        <Input
                            name='password' 
                            value={newPassword} 
                            htmlForText="Password" 
                            className="input personalInfoProfilePageInput"
                            onChange={passwordInputChangeHandler} 
                            type='password'
                        />

                        <Button 
                            onClick={updateUserProfile} 
                            text='Save' 
                            name='saveButton'
                            className="button personalInfoProfilePageButton" 
                        /> 

                    </div>
                :   <div className='profilePageInfoBlock'>

                        <div className="profilePageAvatarBlock">
                            <img className="profilePageAvatar" alt='avatar' src={userInfo.avatar ? userInfo.avatar : "https://picsum.photos/200"} />
                        </div>

                        <div className="profilePageUserInfoBlock">
                            <p>Fullname: {userInfo.firstname} {userInfo.lastname}</p>
                            <p>Age: {userInfo.age}</p>
                        </div>

                    </div>
                }
            </div>
        )
    }

    const UserPostsBlock = () => {
        return(
            posts.filter((announcement) => announcement.userId === Number(id)).length > 0
            ?   <div className="profilePagePostsMainBlock">

                    <p className="blockName">{userId === Number(id) ? 'Your' : userInfo.firstname} posts</p>

                    {
                    posts.filter((announcement) => announcement.userId === Number(id)).map((post, i) => {
                        return(
                            <PostCard showAlertHandler={showAlertHandler} key={i} postId={post.id} />
                        )
                    })
                    }

                </div>
            
            :    <p className="emptyInfoScetionProfilePage">It`s time to create your first post</p>
        )
    }

    const UserAnnouncementsBlock = () => {
        return(
            announcements.filter((announcement) => announcement.userId === Number(id)).length > 0
            ?   <div className="profilePagePostsMainBlock">

                    <p className="blockName">{userId === Number(id) ? 'Your' : userInfo.firstname} announcements</p>

                    {
                    announcements.filter((announcement) => announcement.userId === Number(id)).map((announcement) => {
                        return(
                            <AnnouncementCard key={announcement.id} announcementId={announcement.id} />
                        )
                    })
                    }

                </div>
            
            :    <p className="emptyInfoScetionProfilePage">It`s time to create your first announcement</p>
        )
    }

    useEffect(() => {
        dataRequest()
    }, [dataRequest])

    return(
        <div className="profilePageMainBlock">

            {
            loading
            ?   Modal(<Loader />)
            :   null
            }

            <div className="chooseInfoTypeBlock">

                <Button 
                    onClick={changeInfoType} 
                    text='personal' 
                    name='personal' 
                    classNameBlock="chooseInfoTypeBlockProfilePage"
                    className={`button chooseInfoTypeButtonProfilePage ${infoType === 'personal' ? 'chooseInfoTypeButtonProfilePageActive' : ''}`}
                /> 

                <Button 
                    onClick={changeInfoType} 
                    text='posts' 
                    name='posts' 
                    classNameBlock="chooseInfoTypeBlockProfilePage"
                    className={`button chooseInfoTypeButtonProfilePage ${infoType === 'posts' ? 'chooseInfoTypeButtonProfilePageActive' : ''}`}
                /> 

                <Button 
                    onClick={changeInfoType} 
                    text='announcements' 
                    name='announcements' 
                    classNameBlock="chooseInfoTypeBlockProfilePage"
                    className={`button chooseInfoTypeButtonProfilePage ${infoType === 'announcements' ? 'chooseInfoTypeButtonProfilePageActive' : ''}`}
                /> 

            </div>

            {
                {
                    'personal': <UserPersonalInfoBlock />,
                    'posts': <UserPostsBlock />,
                    'announcements': <UserAnnouncementsBlock />,
                }[infoType]
            }

            

            

        </div> 
    )
}

function mapStateToProps(state) {
    return{
        accessToken: state.userReducers.accessToken,
        userId: state.userReducers.id,
        posts: state.postReducers.posts,
        announcements: state.announcementReducers.announcements,
    }
}

function mapDispatchToProps(dispatch) {
    return{
        login: (userInfo) => dispatch(login(userInfo)),
        addPosts: (newPosts) => dispatch(addPosts(newPosts)),
        addAnnouncements: (newAnnouncements) => dispatch(addAnnouncements(newAnnouncements)),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(PagesWrapper(ProfilePage))