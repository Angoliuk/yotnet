import React from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import { logout } from "../../ReduxStorage/actions/userActions";
import './NavBar.css'

function NavBar(props) {
    const {isAuth, id, logout, avatar} = props
    console.log(avatar)
    return(
        isAuth
        ?
            <nav className="NavBar">
                <NavLink to='/home'>Home</NavLink>
                <p>Announcements</p>
                <NavLink to='/yourPosts'>Posts</NavLink>
                <NavLink to={`/profile/${id}`}><img className="profilePicNavBar" alt='profile pic' src={avatar ? avatar : "https://picsum.photos/60"}/></NavLink>
                <p onClick={() => {logout()}}>Logout</p>
            </nav>
        :
            <nav className="NavBar">
                <NavLink to='/home'>Home</NavLink>
                <NavLink to='/login'>Login</NavLink>
                <NavLink to='/register'>Register</NavLink>
            </nav>
        
    )
}

function mapStateToProps(state) {
    return{
        isAuth: !!state.userReducers.accessToken,
        id: state.userReducers.id,
        avatar: state.userReducers.avatar,
    }
}

function mapDispatchToProps(dispatch) {
    return{
        logout: () => dispatch(logout())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)