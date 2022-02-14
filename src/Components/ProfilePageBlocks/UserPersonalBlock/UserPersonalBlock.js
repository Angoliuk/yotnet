import React, { useState } from "react";
import { useParams } from "react-router-dom";
import validator from "validator";
import { connect } from "react-redux";
import "./UserPersonalBlock.css";
import { useHttp } from "../../../Service/useHttp";
import { login } from "../../../ReduxStorage/actions/userActions";
import { Button } from "../../Common/Button/Button";
import { Input } from "../../Common/Input/Input";
import InputsWithUserData from "../../Common/InputsWithUserData/InputsWithUserData";
import { useUserService } from "../../../Service/useUserService";

const UserPersonalBlock = (props) => {
  const userService = useUserService();
  const { showAlertHandler, accessToken, userId, userInfo } = props;
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
      await userService.updateUser(
        id,
        { ...user, password: newPassword },
        accessToken
      );

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

const mapStateToProps = (state) => {
  return {
    accessToken: state.userReducers.accessToken,
    userId: state.userReducers.id,
  };
};

export default connect(mapStateToProps)(UserPersonalBlock);
