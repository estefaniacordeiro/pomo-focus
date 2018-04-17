import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import { Route, Switch } from 'react-router-dom';
import moment from 'moment';
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


import { message } from 'antd';

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
  clearError: () => dispatch({ type: ACTION.CLEAR_ERROR })
})


class App extends Component {
  componentWillMount() {
    const token = window.localStorage.getItem('jwt');
    if (token) {
      agent.setToken(token);
      this.props.onLoad();
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
  }

  handleError = err => {
    message.error(err);
    this.props.clearError();
  }

  render() {
    const { settingsOpen, closeSettings, error, user } = this.props;

    return (
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
    );
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(App);
