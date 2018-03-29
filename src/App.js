import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Route, Switch } from 'react-router-dom';

import Home from './components/Home';
import Settings from './components/Settings';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      settingsVisible: false
    }
  }

  openSettings = () => {
    this.setState({
      settingsVisible: true
    })
  }

  closeSettings = () => {
    this.setState({
      settingsVisible: false
    })
  }

  render() {
    const { settingsVisible } = this.state;

    return (
      <div className="App">
        <header className="App-header-wrapper">
          <span className="App-header-name">
            Pomo timer
          </span>
          <div className="App-header-buttons">
            <i className="fas fa-chart-pie nav-button" />
            <i className="fas fa-sliders-h nav-button" onClick={this.openSettings} />
  
          </div>
        </header>
        <Settings visible={settingsVisible} close={this.closeSettings} />

        <Switch>
          <Route exact path="/" component={Home} />
        </Switch>
      </div>
    );
  }
}

export default App;
