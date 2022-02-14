import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../../Components/Common/Button/Button";
import { PagesWrapper } from "../../hoc/PagesWrapper/PagesWrapper";
import { useHttp } from "../../Hook/useHttp";
import { connect } from "react-redux";
import "./ProfilePage.css";
import { Loader } from "../../Components/Common/Loader/Loader";
import { Modal } from "../../Components/Common/Modal/Modal";
import { addPosts } from "../../ReduxStorage/actions/postActions";
import { addAnnouncements } from "../../ReduxStorage/actions/announcementActions";
import UserPersonalBlock from "../../Components/ProfilePageBlocks/UserPersonalBlock/UserPersonalBlock";
import UserPostsBlock from "../../Components/ProfilePageBlocks/UserPostsBlock/UserPostsBlock";
import UserAnnouncementsBlock from "../../Components/ProfilePageBlocks/UserAnnouncementsBlock/UserAnnouncementsBlock";
import { usePostService } from "../../Service/usePostService";
import { useAnnouncementService } from "../../Service/useAnnouncementService";
import { useUserService } from "../../Service/useUserService";

function ProfilePage(props) {
  const { loading } = usePostService();
  const postService = usePostService();
  const userService = useUserService();
  const announcementService = useAnnouncementService();
  const { showAlertHandler, addAnnouncements, addPosts, posts, announcements } =
    props;
  const [section, setSection] = useState("personal");

  const id = useParams().id;
  const [userInfo, setUserInfo] = useState({
    email: "",
    firstname: "",
    lastname: "",
    age: 0,
    avatar: "https://picsum.photos/60",
  });

  const personalDataRequest = useCallback(async () => {
    const user = await userService(id);
    delete user[0].password;
    setUserInfo(user[0]);
  }, [id]);

  const postsDataRequest = useCallback(async () => {
    const postsFromDB = await postService.getUserPosts(id);
    if (!postsFromDB) return null;

    const newPosts = postsFromDB.filter(
      (postFromDB) =>
        posts.find((post) => post.id === postFromDB.id) === undefined
    );
    if (!newPosts) return null;

    addPosts(newPosts);
  }, [id, addPosts]);

  const announcemenetsDataRequest = useCallback(async () => {
    const announcementsFromDB = await announcementService.getUserAnnouncements(
      id
    );
    if (!announcementsFromDB) return null;

    const newAnnouncements = announcementsFromDB.filter(
      (announcementsFromDB) =>
        announcements.find(
          (announcement) => announcement.id === announcementsFromDB.id
        ) === undefined
    );
    if (!newAnnouncements) return null;

    addAnnouncements(newAnnouncements);
  }, [id, addAnnouncements]);

  const dataRequest = useCallback(async () => {
    try {
      if (section === "personal") {
        personalDataRequest();
      } else if (section === "announcements") {
        postsDataRequest();
      } else if (section === "posts") {
        announcemenetsDataRequest();
      } else {
        throw new Error("unknown info section");
      }
    } catch (e) {
      showAlertHandler({
        show: true,
        text: `Error, try to reload this page. ${e}`,
        type: "error",
      });
    }
  }, [
    section,
    announcemenetsDataRequest,
    postsDataRequest,
    personalDataRequest,
  ]);

  const changeSection = (e) => {
    setSection(e.target.name);
  };

  const ChosenSectionBlock = useCallback(() => {
    return {
      personal: (
        <UserPersonalBlock
          showAlertHandler={showAlertHandler}
          userInfo={userInfo}
        />
      ),
      posts: (
        <UserPostsBlock
          showAlertHandler={showAlertHandler}
          userInfo={userInfo}
        />
      ),
      announcements: <UserAnnouncementsBlock userInfo={userInfo} />,
    }[section];
  }, [section, userInfo, showAlertHandler]);

  useEffect(() => {
    dataRequest();
  }, [dataRequest]);

  return (
    <div className="profilePageMainBlock">
      {loading ? Modal(<Loader />) : null}

      <div className="chooseInfoTypeBlock">
        <Button
          onClick={changeSection}
          text="personal"
          name="personal"
          classNameBlock="chooseInfoTypeBlockProfilePage"
          className={`button chooseInfoTypeButtonProfilePage ${
            section === "personal"
              ? "chooseInfoTypeButtonProfilePageActive"
              : ""
          }`}
        />

        <Button
          onClick={changeSection}
          text="posts"
          name="posts"
          classNameBlock="chooseInfoTypeBlockProfilePage"
          className={`button chooseInfoTypeButtonProfilePage ${
            section === "posts" ? "chooseInfoTypeButtonProfilePageActive" : ""
          }`}
        />

        <Button
          onClick={changeSection}
          text="announcements"
          name="announcements"
          classNameBlock="chooseInfoTypeBlockProfilePage"
          className={`button chooseInfoTypeButtonProfilePage ${
            section === "announcements"
              ? "chooseInfoTypeButtonProfilePageActive"
              : ""
          }`}
        />
      </div>

      <ChosenSectionBlock />
    </div>
  );
}

function mapStateToProps(state) {
  return {
    posts: state.postReducers.posts,
    announcements: state.announcementReducers.announcements,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addPosts: (newPosts) => dispatch(addPosts(newPosts)),
    addAnnouncements: (newAnnouncements) =>
      dispatch(addAnnouncements(newAnnouncements)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PagesWrapper(ProfilePage));
