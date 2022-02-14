import React, { useState } from "react";
import { Button } from "../../Components/Common/Button/Button";
import { Input } from "../../Components/Common/Input/Input";
import { PagesWrapper } from "../../hoc/PagesWrapper/PagesWrapper";
import { Loader } from "../../Components/Common/Loader/Loader";
import { Modal } from "../../Components/Common/Modal/Modal";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import { useUserService } from "../../Service/useUserService";

function LoginPage(props) {
  const userService = useUserService();
  const { loading } = useUserService();
  const { showAlertHandler } = props;
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const inputChangeHandler = (event) => {
    setLoginData({
      ...loginData,
      [event.target.name]: event.target.value,
    });
  };

  const processLogin = async () => {
    try {
      await userService.processLogin(loginData);
      navigate("/home");
    } catch (e) {
      showAlertHandler({
        show: true,
        text: `${e}`,
        type: "error",
      });
    }
  };

  return (
    <div className="loginPageBlock">
      {loading && Modal(<Loader />)}

      <Input
        name="email"
        value={loginData.email}
        htmlForText="Email"
        onChange={inputChangeHandler}
        className="input inputLoginPage"
      />

      <Input
        name="password"
        type="password"
        value={loginData.password}
        htmlForText="Password"
        onChange={inputChangeHandler}
        className="input inputLoginPage"
      />

      <Button onClick={processLogin} text="Login" name="loginButton" />
    </div>
  );
}

export default PagesWrapper(LoginPage);
