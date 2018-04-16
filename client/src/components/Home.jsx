import React from 'react';
import { connect } from 'react-redux';
import Timer from './Timer';
import TaskSelect from './TaskSelect';
import ACTION from '../constants';
import agent from '../agent';
import '../css/Home.css';

const mapStateToProps = state => ({
  user: state.common.user
});

const mapDispatchToProps = dispatch => ({
  getAllTasks: () => dispatch({ type: ACTION.GET_ALL_TASKS, payload: agent.Tasks.all() }),
  getSettings: () => dispatch({type: ACTION.GET_SETTINGS, payload: agent.Settings.current() }),
});

class Home extends React.Component {

  componentWillMount() {
    const { user, getAllTasks, getSettings } = this.props;
    if (user) {
      getAllTasks();
      getSettings();
    }
  }

  render() {
    return (
      <div className="Home-container">
        <TaskSelect />
        <Timer />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);