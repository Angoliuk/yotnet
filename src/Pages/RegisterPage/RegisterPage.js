import React, { useState } from "react";
import { connect } from "react-redux";
import { Button } from "../../Components/Button/Button";
import { PagesWrapper } from "../../hoc/PagesWrapper/PagesWrapper";
import { useHttp } from "../../Hook/useHttp";
import { login } from "../../ReduxStorage/actions/userActions";
import validator from 'validator';
import './RegisterPage.css'
import InputsWithUserData from "../../Components/InputsWithUserData/InputsWithUserData";

function RegisterPage(props) {

    const {request} = useHttp()

    const [registerData, setRegisterData] = useState({
        email: '',
        password: '',
        firstname: '',
        lastname: '',
        age: 0,
        avatar: 'https://preview.redd.it/yom0nq8tznsz.jpg?width=640&crop=smart&auto=webp&s=f71630cd970ede845f2c992ffc8ffe4f5c59f289',
    })

    const [showAvatarsBlock ,setShowAvatarsBlock] = useState(false)

    const {login, showAlertHandler} = props

    const inputChangeHandler = (event) => {
        setRegisterData({
            ...registerData,
            [event.target.name]: event.target.value
        })
    }

    const avatarChangeHandler = (event) => {
        setRegisterData({
            ...registerData,
            avatar: event.target.src
        })
        setShowAvatarsBlock(!showAvatarsBlock)
    }

    const processRegister = async () => {
        try {
            if(
            validator.isEmail(registerData.email) 
            && registerData.lastname
            && registerData.firstname
            && registerData.age > 14
            && validator.isLength(registerData.password, {min: 6, max: undefined})
            ){
                const data = await request('/register', 'POST', registerData)
                login({...data.user, accessToken: data.accessToken})
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

    return(
        <div>
            <InputsWithUserData
                showPassword={true} 
                stateForInputs={registerData} 
                onChangeInput={inputChangeHandler}
                onChangeAvatar={avatarChangeHandler}
                showAvatarsBlock={showAvatarsBlock} 
            />

            <Button 
                onClick={processRegister} 
                text='Register' 
                name='registerButton' 
            />      
        </div>
    )
}


function mapStateToProps(state) {
    return{

    }
}

function mapDispatchToProps(dispatch) {
    return{
        login: (userInfo) => dispatch(login(userInfo))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(PagesWrapper(RegisterPage))