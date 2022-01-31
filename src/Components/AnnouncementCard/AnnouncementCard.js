import React from "react";
import { connect } from "react-redux";
import { useHttp } from "../../Hook/useHttp";
import './AnnouncementCard.css'
import { setAnnouncements } from "../../ReduxStorage/actions/announcementActions";
import { Link } from "react-router-dom";
import { Button } from "../Button/Button";

function AnnouncementCard(props) {

    const {showAlertHandler, announcementId, announcements, setAnnouncements, userInfo} = props
    const announcement = announcements.find((announ) => announ.id === announcementId)
    const createdAtDate = new Date(announcement.createdAt).toLocaleString()
    const {request} = useHttp()

    const deleteAnnouncement = async () => {
        try {
            
            await request(`/664/announcements/${announcementId}`, 'DELETE', null, {'Authorization': `Bearer ${userInfo.accessToken}`})
            setAnnouncements(announcements.filter((announcement) => announcement.id !== announcementId))

        } catch (e) {
            showAlertHandler({
                show: true,
                text: `Error, try to delete post again`,
                type: 'error',
            })
        }
    }

    const ButtonsForUserPosts = () => {
        return(
            <div className="ButtonsForUserAnnouncementBlock">
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

    return(
        <div className="announcementCard">
            <div className="announcementInfoBlock">
                <div className="announcementAuthorInfoBlock">
                    <div className="announcementAuthorPicBlock">
                        <img alt='author pic' className="announcementAuthorPic"  src={announcement?.user?.avatar ? announcement.user.avatar : "https://picsum.photos/60"}/>
                    </div>
                    <div className="announcementInfoTextBlock">
                        <p>{announcement.user.firstname} {announcement.user.lastname}</p>
                        <p className="announcementDate">{createdAtDate}</p>
                    </div>
                </div>
                {
                userInfo.id === announcement.user.id
                ?   <ButtonsForUserPosts />
                :   null
                }
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
