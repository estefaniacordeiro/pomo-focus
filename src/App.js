import React, { Component } from 'react';
import { connect } from 'react-redux';
import logo from './logo.svg';
import './App.css';
import { Route, Switch } from 'react-router-dom';
import T from './constants';

import Home from './components/Home';
import Settings from './components/Settings';
import Register from './components/Register';
import SignIn from './components/SignIn';
import Header from './components/Header';

import { Popover } from 'antd';

const mapStateToProps = state => ({
  settingsOpen: state.settings.modalOpen
})

const mapDispatchToProps = dispatch => ({
  closeSettings: () => dispatch({ type: T.CLOSE_SETTINGS, payload: { modalOpen: false}})
})


class App extends Component {

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
