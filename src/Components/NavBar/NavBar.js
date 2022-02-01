import React, { useState } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import { logout } from "../../ReduxStorage/actions/userActions";
import { setAnnouncements } from "../../ReduxStorage/actions/announcementActions";
import { Modal } from "../Modal/Modal";
import { useHttp } from "../../Hook/useHttp"
import './NavBar.css'
import AnnouncementCard from "../AnnouncementCard/AnnouncementCard";
import { Loader } from "../Loader/Loader";

function NavBar(props) {

    const {request, loading} = useHttp()
    const {isAuth, id, logout, avatar, setAnnouncements, announcements, showAlertHandler, accessToken} = props
    const [showAnnouncement, setShowAnnouncement] = useState(false)

    const showAnnouncementHandler = async() => {

        if (!showAnnouncement) {dataRequest()}

        setShowAnnouncement(!showAnnouncement)

    }

    const dataRequest = async() => {
        try {

            const announcementsFromDB = await request(`/664/announcements?_page=1&_limit=20&_expand=user&_sort=createdAt&_order=desc`, 'GET', null, {'Authorization': `Bearer ${accessToken}`})
            setAnnouncements(announcementsFromDB)
            
        } catch (e) {
            showAlertHandler({
                show: true,
                text: `Error, try to reload this page. ${e.message}`,
                type: 'error',
            })
        }
    }

    return(
        isAuth
        ?   <nav className="NavBar">

                <NavLink to='/home'>Home</NavLink>
                <p onClick={showAnnouncementHandler}>Announcements</p>

                {
                showAnnouncement
                ?   Modal(
                        <div className="navBarAnnouncementBlock">

                            <p className="navBarAnnouncementsName">Announcements for you</p>
                            <hr />

                            {
                            loading
                            ?   <div className="navBarLoaderInAnnouncementsBlock"><Loader /></div>
                            :   announcements && announcements.length > 0
                                ?    announcements.map((announcement) => {
                                        return(
                                            <AnnouncementCard key={announcement.id} announcementId={announcement.id} />
                                        )})
                                :   null
                            }

                        </div>,
                        showAnnouncementHandler,
                        "modalBackground navBarAnnouncementBlockBackground"
                    )
                :   null
                }

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
        announcements: state.announcementReducers.announcements,
        accessToken: state.userReducers.accessToken,
    }
}

function mapDispatchToProps(dispatch) {
    return{
        logout: () => dispatch(logout()),
        setAnnouncements: (announcements) => dispatch(setAnnouncements(announcements)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)