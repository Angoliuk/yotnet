import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHttp } from "../../../Hook/useHttp";
import './AnnouncementCard.css'
import { setAnnouncements } from "../../../ReduxStorage/actions/announcementActions";
import { Link, NavLink } from "react-router-dom";
import { Button } from "../../Common/Button/Button";
import { Loader } from "../../Common/Loader/Loader";

function AnnouncementCard(props) {

    const {request, loading} = useHttp()
    const {showAlertHandler, announcementId, announcements, setAnnouncements, userInfo} = props

    const [showButtonsForUserAnnouncements, setShowButtonsForUserAnnouncements] = useState(false)

    const announcement = announcements.find((announ) => announ.id === announcementId)
    const createdAtDate = new Date(announcement.createdAt).toLocaleString()

    const deleteAnnouncement = async () => {
        try {
            
            await request(
                `/664/announcements/${announcementId}`, 
                'DELETE', 
                null, 
                {'Authorization': `Bearer ${userInfo.accessToken}`}
            )
            
            setAnnouncements(announcements.filter((announcement) => announcement.id !== announcementId))

        } catch (e) {
            showAlertHandler({
                show: true,
                text: `Error, try to delete post again. ${e}`,
                type: 'error',
            })
        }
    }

    const ButtonsForUserPosts = () => {
        return(
            <div className="buttonsForUserAnnouncementsBlock">

                <Link to={`/edit/announcement/${announcementId}`}>
                    <Button
                        text='Edit'
                        name={`editButton${announcementId}`}
                        className="editButtonAnnouncement button"
                        classNameBlock="editButtonBlock"
                    />
                </Link>

                <Button 
                    text='Delete'
                    name={`deleteButton${announcementId}`}
                    className="deleteButtonAnnouncement button"
                    onClick={deleteAnnouncement}
                />

            </div>
        )
    }

    const showButtonsForUserAnnouncementsHandler = () => {

        setShowButtonsForUserAnnouncements(!showButtonsForUserAnnouncements)

    }

    const clickHandler = useCallback(() => {
        
        if(!showButtonsForUserAnnouncements) return null

        showButtonsForUserAnnouncementsHandler()

    }, [showButtonsForUserAnnouncements])  

    useEffect(() => {
        document.addEventListener('click', clickHandler)
        return function () {
            document.removeEventListener('click', clickHandler)
        }
    }, [clickHandler, showButtonsForUserAnnouncements])

    return(
        loading
        ?   <div className="announcementLoaderInCommentsBlock"><Loader /></div>
        :   <div className="announcementCard">
                <div className="announcementInfoBlock">
                    <div className="announcementAuthorInfoBlock">

                        <div className="announcementAuthorPicBlock">
                            <NavLink to={`/profile/${announcement.userId}`}><img alt='author pic' className="announcementAuthorPic"  src={announcement?.user?.avatar ? announcement.user.avatar : "https://picsum.photos/60"}/></NavLink>
                        </div>

                        <div>
                            <p>{announcement.user.firstname} {announcement.user.lastname}</p>
                            <p className="announcementDate">{createdAtDate}</p>
                        </div>

                    </div>

                    <div>

                        {
                        userInfo.id === announcement.user.id
                        ?   <Button text='…' name={`showButtonsForUserAnnouncementsText${announcementId}`} className="button showButtonsForUserPostsText" onClick={showButtonsForUserAnnouncementsHandler}>
                                ... 
                            </Button>
                        :   null
                        }

                        {
                        showButtonsForUserAnnouncements
                        ?   <ButtonsForUserPosts />
                        :   null
                        }

                    </div>

                </div>

                <div className="announcementCardContentBlock">
                    <h3>{announcement.title}</h3>
                    <p className="announcementBody">{announcement.body}</p>
                </div>

                <hr />

            </div>
    )
}

function mapStateToProps(state) {
    return{
        userInfo: state.userReducers,
        announcements: state.announcementReducers.announcements,
    }
}

function mapDispatchToProps(dispatch) {
    return{
        setAnnouncements: (announcements) => dispatch(setAnnouncements(announcements)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnnouncementCard)
