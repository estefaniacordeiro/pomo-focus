import React from 'react';
import { Popover, Tooltip } from 'antd';
import ACTION from '../constants';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import '../css/Header.css';

const mapStateToProps = state => ({
  user: state.common.user
})

const mapDispatchToProps = dispatch => ({
  openSettings: () => dispatch({ type: ACTION.OPEN_SETTINGS, payload: { modalOpen: true } }),
  logOut: () => dispatch({ type: ACTION.LOGOUT })
})

class Header extends React.Component {
  

  render() {
    const { user, logOut } = this.props;

    const unLoggedInMenu = (
      <ul className="unLoggedInMenu" >
       <Link to='/register'>
          <li className="unLoggedInMenu-item" >
          Sign Up
          </li>
        </Link>
        <Link to='/sign-in'>
          <li className="unLoggedInMenu-item" >
            Sign In
          </li>
        </Link>
      </ul>
    )

    const signUpAndSignIn = (
      <div className='Header-signup-signin'>
        <Link to='/register' className='Header-signup-signin-link' >
          <span className="Header-signup-signin-item" >
          Sign Up
          </span>
        </Link>
        <Link to='/sign-in' className='Header-signup-signin-link' >
          <span className="Header-signup-signin-item" >
            Sign In
          </span>
        </Link>
      </div>
    )
    
    const loggedInMenu = (
      <div>
        <div>{user}</div>
        <a onClick={logOut}>Log out</a>
      </div>
    )

    return (
      <div className="App-header-outter-wrapper">
        <header className="App-header-wrapper">
          <span className="App-header-version-number">
            <a href="" className='Header-version-number'>V 0.0.1</a>
            { user ? null : signUpAndSignIn }
          </span>
          <Link to='/'>
            <span className="App-header-name">
              Pomo timer
            </span>
          </ Link>
          <div className="App-header-buttons">
            <Tooltip title="Statistics" placement="bottom">
              <Link to={`/stats?date=${moment().format('YYYY-MM-DD')}`}>
                <i className="fas fa-chart-pie nav-button" />
              </Link>
            </ Tooltip>
            <Tooltip title="Tasks" placement="bottom" >
              <Link to='/tasks'>
                <i className="fas fa-tasks nav-button" />
              </Link>
            </Tooltip >
            <Tooltip title="Settings" placement="bottom">
              <i className="fas fa-sliders-h nav-button" onClick={this.props.openSettings} />
            </ Tooltip>
            <Popover content={user ? loggedInMenu : unLoggedInMenu } placement="bottomRight">
              <i className="fas fa-user nav-button" />
            </ Popover>
          </div>
        </header>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);