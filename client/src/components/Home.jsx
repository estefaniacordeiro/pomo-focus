import React from 'react';
import Timer from './Timer';
import TaskSelect from './TaskSelect';
import '../css/Home.css';

class Home extends React.Component {

  render() {
    return (
      <div className="Home-container">
        <TaskSelect />
        <Timer />
      </div>
    )
  }
}

export default Home;