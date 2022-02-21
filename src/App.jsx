import { useEffect } from "react";
import { connect } from "react-redux";
import "./App.css";
import "./Constants/colors.css";
import RoutesList from "./Pages/Routes";
import { autoLogin } from "./ReduxStorage/actions/userActions";

const App = (props) => {
  const { autoLogin } = props;

  useEffect(() => autoLogin());

  return <RoutesList />;
};

const mapStateToProps = (state) => ({
  accessToken: state.userReducers.accessToken,
});

const mapDispatchToProps = (dispatch) => ({
  autoLogin: () => dispatch(autoLogin()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
