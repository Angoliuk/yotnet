import React, { useState } from "react";
import { connect } from "react-redux";
import { Button } from "../../Components/Button/Button";
import { PagesWrapper } from "../../hoc/PagesWrapper/PagesWrapper";
import { useHttp } from "../../Hook/useHttp";
import { login } from "../../ReduxStorage/actions/userActions";
import validator from 'validator';
import './RegisterPage.css'
import InputsWithUserData from "../../Components/InputsWithUserData/InputsWithUserData";
import { Loader } from "../../Components/Loader/Loader";
import { Modal } from "../../Components/Modal/Modal";

function RegisterPage(props) {

    const {request, loading} = useHttp()
    const {login, showAlertHandler} = props
    const [showAvatarsBlock ,setShowAvatarsBlock] = useState(false)


    const [registerData, setRegisterData] = useState({
        email: '',
        password: '',
        firstname: '',
        lastname: '',
        age: 0,
        avatar: 'https://preview.redd.it/yom0nq8tznsz.jpg?width=640&crop=smart&auto=webp&s=f71630cd970ede845f2c992ffc8ffe4f5c59f289',
    })

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

            if(!validator.isEmail(registerData.email)){throw new Error('Wrong Email')}
            if(!validator.isLength(registerData.password, {min: 6, max: undefined})){throw new Error('Too short password, minimal lenght - 6')}
            if(!registerData.lastname || !registerData.firstname){throw new Error('Enter your name')}
            if(registerData.age < 14){throw new Error('You need to be at least 14')}

            const data = await request('/register', 'POST', registerData)
            login({...data.user, accessToken: data.accessToken})  

        } catch (e) {
            showAlertHandler({
                show: true,
                text: `Error!!! ${e.message}`,
                type: 'error',
            })
        }

    }

    return(
        
        <div>
            {
            loading
            ?   Modal(<Loader />)
            :   null
            }

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