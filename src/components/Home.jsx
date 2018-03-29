import React from 'react';

import Timer from './Timer';
import Tasks from './Tasks';
import '../css/Home.css';

class Home extends React.Component {

  render() {
    return (
      <div className="Home-container">
        <Tasks />
        <Timer />
      </div>
    )
  }
}

export default Home;