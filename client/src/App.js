import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import { Route, Switch } from 'react-router-dom';
import ACTION from './constants';

import Home from './components/Home';
import Settings from './components/Settings';
import Register from './components/Register';
import SignIn from './components/SignIn';
import Header from './components/Header';
import Statistics from './components/Statistics';
import TaskList from './components/TaskList';
import AddTestStats from './components/AddTestStats';
import agent from './agent';

import TestTest from './components/TestTest';


import { message, Spin } from 'antd';

const mapStateToProps = state => ({
  settingsOpen: state.settings.modalOpen,
  redirectTo: state.common.redirectTo,
  appLoaded: state.common.appLoaded,
  error: state.common.error,
  user: state.common.user,
  needUpdate: state.timer.needUpdate,
  mode: state.timer.mode,
  ...state.settings
})

const mapDispatchToProps = dispatch => ({
  closeSettings: () => dispatch({ type: ACTION.CLOSE_SETTINGS, payload: { modalOpen: false}}),
  onRedirect: () => dispatch({ type: ACTION.REDIRECT }),
  getUserAndLoadApp: payload => dispatch({ type: ACTION.APP_LOAD, payload }),
  clearError: () => dispatch({ type: ACTION.CLEAR_ERROR }),
  getAllTasks: () => dispatch({ type: ACTION.GET_ALL_TASKS, payload: agent.Tasks.all() }),
  getSettings: () => dispatch({type: ACTION.GET_SETTINGS, payload: agent.Settings.current() }),
  setTimer: (payload) => dispatch({type: ACTION.SET_TIMER, payload}),
})


class App extends Component {
  componentWillMount() {
    const token = window.localStorage.getItem('jwt');
    if (token) {
      agent.setToken(token);
      this.props.getUserAndLoadApp(agent.Auth.current());
    } else {
      this.props.getUserAndLoadApp({user: null});
    }
  }

  componentDidMount() {
    Notification.requestPermission().then( res => {
      console.log(res);
    })
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.redirectTo) {
      console.log('Redirected');
      this.props.history.push(nextProps.redirectTo);
      this.props.onRedirect();
    }
    if (!this.props.error && nextProps.error) {
      this.handleError(nextProps.error);
    }
    if (!this.props.user && nextProps.user) {
      this.props.getAllTasks();
      this.props.getSettings();
    }

    const { focusTime, shortBreak, longBreak, ticking } = nextProps;
    // Timer ended or setting updated will fire setTimer()
    if (!this.props.needUpdate && nextProps.needUpdate) {
      this.setTimer({mode: this.props.mode, shortBreak, longBreak, focusTime, ticking});
    }
  }


  setTimer(settings) {
    const { mode, shortBreak, longBreak, focusTime, ticking } = settings;
    if (ticking) return;
    let min;
    switch(mode) {
      case 'focus':
        min = focusTime;
        break;
      case 'short-break':
        min = shortBreak;
        break;
      case 'long-break':
        min = longBreak;
        break;
      default:
        min = 0;
        break;
    }

    this.props.setTimer({seconds: min * 60});
  }

  handleError = err => {
    message.error(err);
    this.props.clearError();
  }

  render() {
    const { settingsOpen, closeSettings, appLoaded } = this.props;
    
    return (
      <Spin size='large' spinning={!appLoaded} >
        <div className="App">
          <Header />
          <Settings visible={settingsOpen} close={closeSettings} />
          <div className="App-container">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/register" component={Register} />
              <Route path="/sign-in" component={SignIn} />
              <Route path="/stats" component={Statistics} />
              <Route path="/tasks" component={TaskList} />
              <Route path="/add-test-stats" component={AddTestStats} />
              <Route path="/test" component={TestTest} />
            </Switch>
          </div>

          <footer className="footer-decription">
            Coded by 
            <a href="https://github.com/hieverest" target="_blank" className="footer-author">Qianchen</a>
          </footer>
        </div>
      </ Spin>
    );
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(App);
