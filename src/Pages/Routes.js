import React from 'react'
import { connect } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom'
import { BrowserRouter as Router } from 'react-router-dom';
import HomePage from "./HomePage/HomePage";
import LoginPage from "./LoginPage/LoginPage";
import ProfilePage from "./ProfilePage/ProfilePage";
import RegisterPage from "./RegisterPage/RegisterPage";
import EditPage from './EditPage/EditPage';

const RoutesList = (props) => {

    return(
        <Router>
            {
            props.isAuth
                ?
                    <Routes>

                        <Route 
                            path='/home' 
                            element={<HomePage />} 
                        />

                        <Route 
                            path='/profile/:id' 
                            element={<ProfilePage />} 
                        />

                        <Route 
                            path='/edit/:postType/:id' 
                            element={<EditPage />} 
                        />

                        <Route 
                            path="*" 
                            element={<Navigate to='/home' />} 
                        />

                    </Routes>
                :
                    <Routes>

                        <Route 
                            path='/home' 
                            element={<HomePage />} 
                        />

                        <Route 
                            path='/login' 
                            element={<LoginPage />} 
                        />

                        <Route 
                            path='/register' 
                            element={<RegisterPage />} 
                        />

                        <Route 
                            path="*" 
                            element={<Navigate to='/home' />} 
                        />

                    </Routes>
            }
            
        </Router>
    )
}

function mapStateToProps(state) {
    return{
        isAuth: !!state.userReducers.accessToken
    }
}

export default connect(mapStateToProps)(RoutesList)