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
import agent from './agent';

import { Popover } from 'antd';

const mapStateToProps = state => ({
  settingsOpen: state.settings.modalOpen,
  redirectTo: state.common.redirectTo
})

const mapDispatchToProps = dispatch => ({
  closeSettings: () => dispatch({ type: ACTION.CLOSE_SETTINGS, payload: { modalOpen: false}}),
  onRedirect: () => dispatch({ type: ACTION.REDIRECT })
})


class App extends Component {
  componentWillMount() {
    const token = window.localStorage.getItem('jwt');
    if (token) {
      agent.setToken(token);
    }
    
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.redirectTo) {
      console.log('Redirected');
      
      this.props.history.push(nextProps.redirectTo);
      this.props.onRedirect();
    }
  }

  render() {
    const { settingsOpen, closeSettings } = this.props;

    return (
      <div className="App">
        
        <Header />
        <Settings visible={settingsOpen} close={closeSettings} />

        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/register" component={Register} />
          <Route path="/sign-in" component={SignIn} />
        </Switch>
      </div>
    );
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(App);
