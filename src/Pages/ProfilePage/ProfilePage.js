import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../../Components/Button/Button";
import InputsWithUserData from "../../Components/InputsWithUserData/InputsWithUserData";
import { PagesWrapper } from "../../hoc/PagesWrapper/PagesWrapper";
import { useHttp } from "../../Hook/useHttp";
import validator from "validator";
import { connect } from "react-redux";
import { login } from "../../ReduxStorage/actions/userActions";

function ProfilePage(props) {

    const {request} = useHttp()
    const {showAlertHandler, login, accessToken} = props

    const id = useParams().id
    const [userInfo, setUserInfo] = useState({
        email: '',
        password: '',
        firstname: '',
        lastname: '',
        age: 0,
        avatar: "https://picsum.photos/60",
    })
    const [showAvatarsBlock, setShowAvatarsBlock] = useState(false)

    const dataRequest = useCallback( async() => {
        const user = await request(`/users?id=${id}`, 'GET', null)
        setUserInfo(user[0])
    }, [id, request])

    const inputChangeHandler = (event) => {
        setUserInfo({
            ...userInfo,
            [event.target.name]: event.target.value
        })
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
            && validator.isLength(userInfo.password, {min: 6, max: undefined})
            ){
                const updatedUser = await request(`/users/${id}`, 'PATCH', userInfo)
                login({...updatedUser, accessToken: accessToken})
                // console.log({...updatedUser, accessToken: accessToken})
                showAlertHandler({
                    show: true,
                    text: `Everything successfully saved`,
                    type: 'success',
                })
                //update locally and go back to home or etc
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
            <InputsWithUserData 
                stateForInputs={userInfo} 
                onChangeInput={inputChangeHandler}
                onChangeAvatar={avatarChangeHandler}
                showAvatarsBlock={showAvatarsBlock}
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