import React, { useState } from "react";
import { connect } from "react-redux";
import { useHttp } from "../../Hook/useHttp";
import './AnnouncementCard.css'
import { setAnnouncements } from "../../ReduxStorage/actions/announcementActions";
import { Link, NavLink } from "react-router-dom";
import { Button } from "../Button/Button";
import { Loader } from "../Loader/Loader";

function AnnouncementCard(props) {

    const {request, loading} = useHttp()
    const {showAlertHandler, announcementId, announcements, setAnnouncements, userInfo} = props
    const [showButtonsForUserPosts, setShowButtonsForUserPosts] = useState(false)
    const announcement = announcements.find((announ) => announ.id === announcementId)
    const createdAtDate = new Date(announcement.createdAt).toLocaleString()

    const deleteAnnouncement = async () => {
        try {
            
            await request(`/664/announcements/${announcementId}`, 'DELETE', null, {'Authorization': `Bearer ${userInfo.accessToken}`})
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
            <div className="ButtonsForUserAnnouncementsBlock">

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

        setShowButtonsForUserPosts(!showButtonsForUserPosts)

    }

    return(
        loading
        ?   <div className="announcementLoaderInCommentsBlock"><Loader /></div>
        :   <div className="announcementCard">
                <div className="announcementInfoBlock">
                    <div className="announcementAuthorInfoBlock">

                        <div className="announcementAuthorPicBlock">
                            <NavLink to={`/profile/${announcement.userId}`}><img alt='author pic' className="announcementAuthorPic"  src={announcement?.user?.avatar ? announcement.user.avatar : "https://picsum.photos/60"}/></NavLink>
                        </div>

                        <div className="announcementInfoTextBlock">
                            <p>{announcement.user.firstname} {announcement.user.lastname}</p>
                            <p className="announcementDate">{createdAtDate}</p>
                        </div>

                    </div>

                    <div className="ButtonsForUserAnnouncementsMainBlock">

                        {
                        userInfo.id === announcement.user.id
                        ?   <Button text='…' name={`showButtonsForUserAnnouncementsText${announcementId}`} className="button showButtonsForUserPostsText" onClick={showButtonsForUserAnnouncementsHandler}>
                                ... 
                            </Button>
                        :   null
                        }

                        {
                        showButtonsForUserPosts
                        ?   <ButtonsForUserPosts />
                        :   null
                        }

                    </div>

                </div>

                <div className="announcementMainBlock">
                    <h3>{announcement.title}</h3>
                    <p>{announcement.body}</p>
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
