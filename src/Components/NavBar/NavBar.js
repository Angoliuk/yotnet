import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import { logout } from "../../ReduxStorage/actions/userActions";
import { addAnnouncements, addToEndAnnouncements } from "../../ReduxStorage/actions/announcementActions";
import { Modal } from "../Modal/Modal";
import { useHttp } from "../../Hook/useHttp"
import './NavBar.css'
import AnnouncementCard from "../AnnouncementCard/AnnouncementCard";
import { Loader } from "../Loader/Loader";

function NavBar(props) {

    const {request, loading} = useHttp()
    const {isAuth, id, logout, avatar, addAnnouncements, announcements, showAlertHandler, addToEndAnnouncements} = props
    const [showAnnouncement, setShowAnnouncement] = useState(false)
    const [pageNum, setPageNum] = useState(1)
    const [loadNewAnnouncements, setLoadNewAnnouncements] = useState(true)

    const showAnnouncementHandler = async() => {

        if (!showAnnouncement) {dataRequest()}
        setShowAnnouncement(!showAnnouncement)

    }

    const dataRequest = useCallback(async() => {
        try {

            const announcementsFromDB = await request(`/announcements?_page=${pageNum}&_limit=20&_expand=user&_sort=createdAt&_order=desc`, 'GET', null)

            if (!announcementsFromDB) return null

            const newAnnouncements = announcementsFromDB.filter((announcementFromDB) => announcements.find((announcement) => announcement.id === announcementFromDB.id) === undefined)

            if(!newAnnouncements) return null
            addToEndAnnouncements(newAnnouncements)
            // setPageNum(prevState => prevState + 1)
            // setLoadNewAnnouncements(false)
            
        } catch (e) {
            showAlertHandler({
                show: true,
                text: `Error, try to reload this page. ${e}`,
                type: 'error',
            })
        }
    }, [request, announcements, addAnnouncements])

    const scrollHandler = (e) => {

        if (e.target.scrollHeight - (e.target.scrollTop + e.target.offsetHeight) < 200 ) {
            
            setLoadNewAnnouncements(true)

        }

    }

    // useEffect(() => {
    //     if(!loadNewAnnouncements) return null
    //     dataRequest()
    // }, [loadNewAnnouncements, dataRequest])

    return(
        isAuth
        ?   <nav className="NavBar">

                <NavLink to='/home'>Home</NavLink>
                <p onClick={showAnnouncementHandler}>Announcements</p>

                {
                showAnnouncement
                ?   Modal(
                        <div onScroll={scrollHandler} id="navBarAnnouncementBlock" className="navBarAnnouncementBlock">

                            <p className="navBarAnnouncementsName">Announcements for you</p>
                            <hr />

                            {
                            loading
                            ?   <div className="navBarLoaderInAnnouncementsBlock"><Loader /></div>
                            :   announcements && announcements.length > 0
                                ?    announcements.map((announcement) => {
                                        return(
                                            <AnnouncementCard key={announcement.id+id} announcementId={announcement.id} />
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
    }
}

function mapDispatchToProps(dispatch) {
    return{
        logout: () => dispatch(logout()),
        addAnnouncements: (announcements) => dispatch(addAnnouncements(announcements)),
        addToEndAnnouncements: (announcements) => dispatch(addToEndAnnouncements(announcements)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)