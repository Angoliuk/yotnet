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

function ProfilePage(props) {

    const {request} = useHttp()
    const {showAlertHandler, login, accessToken} = props

    const id = useParams().id
    const [userInfo, setUserInfo] = useState({
        email: '',
        firstname: '',
        lastname: '',
        age: 0,
        avatar: "https://picsum.photos/60",
    })

    const [newPassword, setNewPassword] = useState('')

    const [showAvatarsBlock, setShowAvatarsBlock] = useState(false)

    const dataRequest = useCallback( async() => {
        const user = await request(`/users?id=${id}`, 'GET', null)
        delete user[0].password
        setUserInfo(user[0])
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
            if(
            validator.isEmail(userInfo.email) 
            && userInfo.lastname
            && userInfo.firstname
            && userInfo.age > 14
            ){
                if (newPassword.length >= 6) {
                    setUserInfo({...userInfo, password: newPassword})
                }else if (newPassword.length < 6 && newPassword.length > 0){
                    showAlertHandler({
                        show: true,
                        text: `Minimal lenght of password - 6`,
                        type: 'error',
                    })
                    return null
                }
                const updatedUser = await request(`/users/${id}`, 'PATCH', userInfo)
                //password do not change
                login({...updatedUser, accessToken: accessToken})
                showAlertHandler({
                    show: true,
                    text: `Everything successfully saved`,
                    type: 'success',
                })
            }else{
                throw new Error('Enter all data')
            }     
        } catch (e) {
            showAlertHandler({
                show: true,
                text: `Error, wrong info`,
                type: 'error',
            })
        }
    }

    useEffect(() => {
        dataRequest()
    }, [dataRequest])

    return(
        <div>
            <p className="blockNameProfile">Information about you</p>

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
        
    )
}

function mapStateToProps(state) {
    return{
        accessToken: state.userReducers.accessToken
    }
}

function mapDispatchToProps(dispatch) {
    return{
        login: (userInfo) => dispatch(login(userInfo))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(PagesWrapper(ProfilePage))