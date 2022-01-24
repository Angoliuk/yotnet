import { useEffect } from 'react';
import { connect } from 'react-redux';
import './App.css';
import RoutesList from './Pages/Routes';
import { autoLogin } from './ReduxStorage/actions/userActions';

function App(props) {

    const { autoLogin } = props

    useEffect(() => {
        autoLogin()
    })

    return (
        <RoutesList />
    );
}

function mapStateToProps(state) {
    return{
        accessToken: state.userReducers.accessToken,
    }
}

function mapDispatchToProps(dispatch) {
    return{
        autoLogin: () => dispatch(autoLogin()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
