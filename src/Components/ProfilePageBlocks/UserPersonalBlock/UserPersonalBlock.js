import React, { useState } from "react";
import { useParams } from "react-router-dom";
import validator from "validator";
import { connect } from "react-redux";
import "./UserPersonalBlock.css";
import { useHttp } from "../../../Hook/useHttp";
import { login } from "../../../ReduxStorage/actions/userActions";
import { Button } from "../../Common/Button/Button";
import { Input } from "../../Common/Input/Input";
import InputsWithUserData from "../../Common/InputsWithUserData/InputsWithUserData";

const UserPersonalBlock = (props) => {
  const { request } = useHttp();
  const { showAlertHandler, login, accessToken, userId, userInfo } = props;
  const id = useParams().id;

  const [newPassword, setNewPassword] = useState("");
  const [showAvatarsBlock, setShowAvatarsBlock] = useState(false);

  const [user, setUser] = useState({
    ...userInfo,
  });

  const inputChangeHandler = (event) => {
    setUser({
      ...user,
      [event.target.name]: event.target.value,
    });
  };

  const passwordInputChangeHandler = (event) => {
    setNewPassword(event.target.value);
  };

  const avatarChangeHandler = (event) => {
    setUser({
      ...user,
      avatar: event.target.src,
    });

    setShowAvatarsBlock(!showAvatarsBlock);
  };

  const updateUserProfile = async () => {
    try {
      if (!validator.isEmail(user.email)) {
        throw new Error("Enter valid Email");
      }
      if (newPassword.length < 6 && newPassword.length > 0) {
        throw new Error("Minimal lenght of password - 6");
      }
      if (!user.lastname || !user.firstname) {
        throw new Error("Enter your name");
      }
      if (user.age < 14) {
        throw new Error("You need to be at least 14");
      }

      const updatedUser = await request(
        `/640/users/${id}`,
        "PATCH",
        newPassword.length >= 6 ? { ...user, password: newPassword } : user,
        { Authorization: `Bearer ${accessToken}` }
      );

      login({ ...updatedUser, accessToken: accessToken });
      showAlertHandler({
        show: true,
        text: `Everything successfully saved`,
        type: "success",
      });
    } catch (e) {
      showAlertHandler({
        show: true,
        text: `${e}`,
        type: "error",
      });
    }
  };

  return (
    <div className="profilePagePersonalBlock">
      <p className="profilePagePersonalName">
        Information about {userId === Number(id) ? "you" : user.firstname}
      </p>

      {userId === Number(id) ? (
        <div>
          <InputsWithUserData
            showPassword={false}
            stateForInputs={user}
            onChangeInput={inputChangeHandler}
            onChangeAvatar={avatarChangeHandler}
            showAvatarsBlock={showAvatarsBlock}
          />

          <Input
            name="password"
            value={newPassword}
            htmlForText="Password"
            className="input personalInfoProfilePageInput"
            onChange={passwordInputChangeHandler}
            type="password"
          />

          <Button
            onClick={updateUserProfile}
            text="Save"
            name="saveButton"
            className="button personalInfoProfilePageButton"
          />
        </div>
      ) : (
        <div className="profilePagePersonalInfoBlock">
          <div>
            <img
              className="profilePagePersonalAvatar"
              alt="avatar"
              src={user.avatar ? user.avatar : "https://picsum.photos/200"}
            />
          </div>

          <div className="profilePagePersonalInfo">
            <p>
              Fullname: {user.firstname} {user.lastname}
            </p>
            <p>Age: {user.age}</p>
          </div>
        </div>
      )}
    </div>
  );
};

function mapStateToProps(state) {
  return {
    accessToken: state.userReducers.accessToken,
    userId: state.userReducers.id,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    login: (userInfo) => dispatch(login(userInfo)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPersonalBlock);
