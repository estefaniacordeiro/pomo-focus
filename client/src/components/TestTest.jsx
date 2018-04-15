import React from 'react';
import { connect } from 'react-redux';
import ACTION from '../constants';
import agent from '../agent';

const mapStateToProps = state => ({
  
  tasksLoaded: state.common.tasksLoaded,
  tasks: state.tasks.slice()
});

const mapDispatchToProps = dispatch => ({
  unloadTasks: () => dispatch({ type: ACTION.CHANGE_TASK_NAME }),
  getAllTasks: () => dispatch({ type: ACTION.GET_ALL_TASKS, payload: agent.Tasks.all() })
})

class TestTest extends React.Component {

  componentWillReceiveProps(nextProps) {
    console.log('will receive props get called ');
    if (!nextProps.tasksLoaded) {
      this.props.getAllTasks();
    }
  }

  handleClick = () => {
    this.props.unloadTasks();
  }

  render() {
    return(
      <div>
        Test page. Check console.logo.
        <button onClick={this.handleClick} >Button</button>
      </div>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(TestTest);