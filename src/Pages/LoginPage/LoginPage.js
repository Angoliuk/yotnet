import React, { useState } from "react";
import { connect } from "react-redux";
import { Button } from "../../Components/Button/Button";
import { Input } from "../../Components/Input/Input";
import { PagesWrapper } from "../../hoc/PagesWrapper/PagesWrapper";
import { useHttp } from "../../Hook/useHttp";
import { login } from "../../ReduxStorage/actions/userActions";
import validator from 'validator'

function LoginPage(props) {

    const {request} = useHttp()
    const {login, showAlertHandler} = props

    const [loginData, setLoginData] = useState({
        email: '1@gmail.com',
        password: '123123123',
    })

    const inputChangeHandler = (event) => {
        setLoginData({
            ...loginData,
             [event.target.name]: event.target.value
            })
    }

    const processLogin = async () => {
        try {
            if (
            validator.isEmail(loginData.email) 
            && validator.isLength(loginData.password, {min: 6, max: undefined})
            ){
                const data = await request('/login', 'POST', loginData)
                login({...data.user, accessToken: data.accessToken})
            } else {
                throw new Error('write something')
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
            <Input 
                name='email' 
                value={loginData.email} 
                htmlForText="Email" 
                onChange={inputChangeHandler} 
            />

            <Input 
                name='password' 
                value={loginData.password} 
                htmlForText="Password" 
                onChange={inputChangeHandler}
            />

            <Button 
                onClick={processLogin} 
                text="Login" 
                name='loginButton' 
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

export default connect(mapStateToProps, mapDispatchToProps)(PagesWrapper(LoginPage))