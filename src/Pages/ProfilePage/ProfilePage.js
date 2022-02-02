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

function ProfilePage(props) {

    const {request, loading} = useHttp()
    const {showAlertHandler, login, accessToken, userId} = props
    const [newPassword, setNewPassword] = useState('')
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

            const user = await request(`/users?id=${id}`, 'GET', null)
            delete user[0].password
            setUserInfo(user[0])

        } catch (e) {
            showAlertHandler({
                show: true,
                text: `Error, try to reload this page. ${e}`,
                type: 'error',
            })
        }

    }, [id, request])

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

            <p className="blockNameProfile">Information about {userId === Number(id) ? 'you' : userInfo.firstname}</p>

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

                    <p className="blockNameProfile">Password</p>

                    <Input
                        name='password' 
                        value={newPassword} 
                        htmlForText="Password" 
                        onChange={passwordInputChangeHandler} 
                        type='password'
                    />

                    <Button 
                        onClick={updateUserProfile} 
                        text='Save' 
                        name='saveButton' 
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

function mapStateToProps(state) {
    return{
        accessToken: state.userReducers.accessToken,
        userId: state.userReducers.id,
    }
}

function mapDispatchToProps(dispatch) {
    return{
        login: (userInfo) => dispatch(login(userInfo))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(PagesWrapper(ProfilePage))