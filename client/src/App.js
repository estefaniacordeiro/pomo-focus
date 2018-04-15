import React, { Component } from 'react';
import { connect } from 'react-redux';
import logo from './logo.svg';
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


import { Popover, Alert } from 'antd';

const mapStateToProps = state => ({
  settingsOpen: state.settings.modalOpen,
  redirectTo: state.common.redirectTo,
  appLoaded: state.common.appLoaded,
  error: state.common.error
})

const mapDispatchToProps = dispatch => ({
  closeSettings: () => dispatch({ type: ACTION.CLOSE_SETTINGS, payload: { modalOpen: false}}),
  onRedirect: () => dispatch({ type: ACTION.REDIRECT }),
  onLoad: () => dispatch({ type: ACTION.APP_LOAD, payload: agent.Auth.current()}),
  getAllStats: () => dispatch({ type: ACTION.GET_ALL_STATS, payload: agent.Stats.all()}),
  getSettings: () => dispatch({type: ACTION.GET_SETTINGS, payload: agent.Settings.current() }),
  getAllTasks: () => dispatch({ type: ACTION.GET_ALL_TASKS, payload: agent.Tasks.all() }),
})


class App extends Component {
  componentWillMount() {
    const token = window.localStorage.getItem('jwt');
    if (token) {
      agent.setToken(token);
      this.props.onLoad();
      // this.props.getAllStats();
      this.props.getSettings();
      this.props.getAllTasks();
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
  }

  render() {
    const { settingsOpen, closeSettings, error } = this.props;

    return (
      <div className="App">
        
        <Header />
        <Settings visible={settingsOpen} close={closeSettings} />

        {error ? 
          <Alert 
            message="Error"
            description={error}
            type="error"
            showIcon
          /> : null 
        }

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
      </div>
    );
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(App);
