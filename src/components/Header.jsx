import React from 'react';
import { Popover, Tooltip } from 'antd';
import ACTION from '../constants';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

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
      <ul>
        <li>
         <Link to='/register'>Sign Up</Link>
        </li>
        <li>
          <Link to='/sign-in'>Sign In</Link>
        </li>
      </ul>
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
            V 0.0.1
          </span>
          <Link to='/'>
            <span className="App-header-name">
              Pomo timer
            </span>
          </ Link>
          <div className="App-header-buttons">
            <Tooltip title="Statistics" placement="bottom">
              <Link to='/stats'>
                <i className="fas fa-chart-pie nav-button" />
              </Link>
            </ Tooltip>
            <Tooltip title="Tasks" placement="bottom" >
              <i className="fas fa-tasks nav-button" />
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