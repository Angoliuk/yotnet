import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import "./AnnouncementCard.css";
import { Link, NavLink } from "react-router-dom";
import { Button } from "../../Common/Button/Button";
import { Loader } from "../../Common/Loader/Loader";
import { useAnnouncementService } from "../../../Service/useAnnouncementService";

function AnnouncementCard(props) {
  const { showAlertHandler, announcementId, announcements, userInfo } = props;
  const announcementService = useAnnouncementService();
  const { loading } = useAnnouncementService();

  const createdAtDate = new Date(announcement.createdAt).toLocaleString();

  const [showButtonsForUserAnnouncements, setShowButtonsForUserAnnouncements] =
    useState(false);

  const announcement = announcements.find(
    (announ) => announ.id === announcementId
  );

  const deleteAnnouncement = async () => {
    try {
      await announcementService.deleteAnnouncement(
        announcementId,
        userInfo.accessToken
      );
    } catch (e) {
      showAlertHandler({
        show: true,
        text: `Error, try to delete post again. ${e}`,
        type: "error",
      });
    }
  };

  const ButtonsForUserPosts = () => {
    return (
      <div className="buttonsForUserAnnouncementsBlock">
        <Link to={`/edit/announcement/${announcementId}`}>
          <Button
            text="Edit"
            name={`editButton${announcementId}`}
            className="editButtonAnnouncement button"
            classNameBlock="editButtonBlock"
          />
        </Link>

        <Button
          text="Delete"
          name={`deleteButton${announcementId}`}
          className="deleteButtonAnnouncement button"
          onClick={deleteAnnouncement}
        />
      </div>
    );
  };

  const showButtonsForUserAnnouncementsHandler = useCallback(() => {
    setShowButtonsForUserAnnouncements(!showButtonsForUserAnnouncements);
  }, [showButtonsForUserAnnouncements]);

  const clickHandler = useCallback(() => {
    if (!showButtonsForUserAnnouncements) return null;

    showButtonsForUserAnnouncementsHandler();
  }, [showButtonsForUserAnnouncements, showButtonsForUserAnnouncementsHandler]);

  useEffect(() => {
    document.addEventListener("click", clickHandler);
    return function () {
      document.removeEventListener("click", clickHandler);
    };
  }, [clickHandler, showButtonsForUserAnnouncements]);

  return loading ? (
    <div className="announcementLoaderInCommentsBlock">
      <Loader />
    </div>
  ) : (
    <div className="announcementCard">
      <div className="announcementInfoBlock">
        <div className="announcementAuthorInfoBlock">
          <div className="announcementAuthorPicBlock">
            <NavLink to={`/profile/${announcement.userId}`}>
              <img
                alt="author pic"
                className="announcementAuthorPic"
                src={
                  announcement?.user?.avatar
                    ? announcement.user.avatar
                    : "https://picsum.photos/60"
                }
              />
            </NavLink>
          </div>

          <div>
            <p>
              {announcement.user.firstname} {announcement.user.lastname}
            </p>
            <p className="announcementDate">{createdAtDate}</p>
          </div>
        </div>

        <div>
          {userInfo.id === announcement.user.id && (
            <Button
              text="…"
              name={`showButtonsForUserAnnouncementsText${announcementId}`}
              className="button showButtonsForUserPostsText"
              onClick={showButtonsForUserAnnouncementsHandler}
            >
              ...
            </Button>
          )}

          {showButtonsForUserAnnouncements && <ButtonsForUserPosts />}
        </div>
      </div>

      <div className="announcementCardContentBlock">
        <h3>{announcement.title}</h3>
        <p className="announcementBody">{announcement.body}</p>
      </div>

      <hr />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.userReducers,
    announcements: state.announcementReducers.announcements,
  };
};

export default connect(mapStateToProps)(AnnouncementCard);
