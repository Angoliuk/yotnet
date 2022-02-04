import React, { useState } from "react";
import { connect } from "react-redux";
import { Button } from "../../Components/Button/Button";
import { Input } from "../../Components/Input/Input";
import { PagesWrapper } from "../../hoc/PagesWrapper/PagesWrapper";
import { useHttp } from "../../Hook/useHttp";
import { login } from "../../ReduxStorage/actions/userActions";
import validator from 'validator'
import { Loader } from "../../Components/Loader/Loader";
import { Modal } from "../../Components/Modal/Modal";
import './LoginPage.css'

function LoginPage(props) {

    const {request, loading} = useHttp()
    const {login, showAlertHandler} = props

    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    })

    const inputChangeHandler = (event) => {

        setLoginData({
            ...loginData,
             [event.target.name]: event.target.value
            })

    }

    const processLogin = async () => {

        try {

            if(!validator.isEmail(loginData.email)){throw new Error('Enter valid Email')}
            if(!validator.isLength(loginData.password, {min: 6, max: undefined})){throw new Error('Too short password, minimal lenght - 6')}

            const data = await request('/login', 'POST', loginData)
            login({...data.user, accessToken: data.accessToken})

        } catch (e) {
            showAlertHandler({
                show: true,
                text: `${e}`,
                type: 'error',
            })
        }

    }

    return(
        <div className="loginPageMainBlock">

            {
            loading
            ?   Modal(<Loader />)
            :   null
            }

            <Input 
                name='email' 
                value={loginData.email} 
                htmlForText="Email" 
                onChange={inputChangeHandler} 
                className="input inputLoginPage"
            />

            <Input 
                name='password' 
                type="password"
                value={loginData.password} 
                htmlForText="Password" 
                onChange={inputChangeHandler}
                className="input inputLoginPage"
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