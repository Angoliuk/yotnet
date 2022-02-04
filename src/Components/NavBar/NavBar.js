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
        ?   <nav className="loggedNavBar">

                <NavLink className='navElem' to='/home'>
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="46px" height="46px" viewBox="0 0 32 32"><path d="M 16 2.5859375 L 2.2929688 16.292969 L 3.7070312 17.707031 L 5 16.414062 L 5 28 L 27 28 L 27 16.414062 L 28.292969 17.707031 L 29.707031 16.292969 L 16 2.5859375 z M 16 5.4140625 L 25 14.414062 L 25 26 L 7 26 L 7 14.414062 L 16 5.4140625 z M 11 16 L 11 18 L 21 18 L 21 16 L 11 16 z M 11 20 L 11 22 L 21 22 L 21 20 L 11 20 z"></path></svg>
                </NavLink>

                <p onClick={showAnnouncementHandler}  className='navElem navElemAnnouncements'>
                    <svg width="40px" height="40px" viewBox="0 0 32 32" enableBackground="new 0 0 32 32" id="Stock_cut" version="1.1" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><desc/><g><polygon fill="none" points="2,3 2,23 6,23    6,29 12,23 30,23 30,3  " stroke="#000000" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2"/><circle cx="8" cy="13" fill="none" r="2" stroke="#000000" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2"/><circle cx="16" cy="13" fill="none" r="2" stroke="#000000" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2"/><circle cx="24" cy="13" fill="none" r="2" stroke="#000000" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2"/></g></svg>
                </p>

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
                                            <AnnouncementCard showAlertHandler={showAlertHandler} key={announcement.id+id} announcementId={announcement.id} />
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
                <p className="navElem navElemLogout" onClick={() => {logout()}}>
                    <svg width="36px" height="36px" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M1 1L8 1V2L2 2L2 13H8V14H1L1 1ZM10.8536 4.14645L14.1932 7.48614L10.8674 11.0891L10.1326 10.4109L12.358 8L4 8V7L12.2929 7L10.1464 4.85355L10.8536 4.14645Z" fill="black"/></svg>
                </p>

            </nav>
        :
            <nav className="notLoggedNavBar">
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