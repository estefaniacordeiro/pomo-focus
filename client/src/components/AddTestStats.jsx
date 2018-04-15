import React from 'react';
import { Input, Button, Select } from 'antd';
import { connect } from 'react-redux';
import ACTION from '../constants';
import agent from '../agent';
import moment from 'moment';

const Option = Select.Option;

const mapStateToProps = state => ({
  tasks: state.tasks,
  stats: state.stats,

})

const mapDispatchToProps = dispatch => ({
  addStats: payload => 
    dispatch({
      type: ACTION.ADD_STATS, 
      payload: Promise.all([agent.Tasks.addStats(payload), agent.Stats.addStats(payload)]),   
      stats: payload
    }),
  setCurrentTask: (id, lastUpdated, tasks) => 
    dispatch({type: ACTION.SET_CURRENT_TASK, payload: agent.Tasks.setCurrentTasks(id, lastUpdated), tasks})
})

class AddTestStats extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      taskId: null,
      dateNTime: null,
      focusTime: null
    }
    this.defaultDateNTime = moment().format('YYYY-MM-DD HH:MM');
    console.log(this.defaultDateNTime);
    
  }

  handleSelect = value => {
    this.setState({
      taskId: value
    });
    this.switchTask(value);
  }

  handleDateTime = e => {
    this.setState({
      dateNTime: e.target.value
    })
  }

  handleFocusTime = e => {
    this.setState({
      focusTime: +e.target.value
    })
  }

  switchTask = id => {
    const { tasks, setCurrentTask } = this.props;
    let index;
    tasks.forEach( (task, i) => {
      if (task._id === id) {
        index = i;
        task.lastUpdated = Date.now();
      }
    })
    const removedTasksArr = tasks.splice(index, 1);
    tasks.push(removedTasksArr[0]);
    setCurrentTask(id, removedTasksArr[0].lastUpdated, tasks);
  }

  handleSubmit = () => {
    const { dateNTime, focusTime, taskId } = this.state;
    // 2018-04-10 10:30
    if (dateNTime.length !== 16 ) {
      return console.error('Date and time input is invalid');
    }
    const date = dateNTime.slice(0, 10);
    const endedAt = moment(dateNTime).add(focusTime, 'minutes').valueOf();
    const payload = {_id: taskId, focusTime, endedAt, date};
    console.log("ADD TEST STATS: " + payload);
    
    this.props.addStats(payload);
  }

  render() {
    const { tasks } = this.props;
    const { dateNTime, focusTime } = this.state;
    return(
      <div style={{width: '500px', margin: '0 auto'}}>
        <Select defaultValue={ tasks.length > 0 ? tasks[0]._id : null} onChange={this.handleSelect} >
          { tasks.map( (task, index) => {
            return (
              <Option value={task._id} key={index}>{task.name}</Option>
            )
          })}
        </Select>
        <Input placeholder='Input date and time: 2018-04-10 10:30' defaultValue={this.defaultDateNTime}  onChange={this.handleDateTime} />
        <Input placeholder='Input focus time...' onChange={this.handleFocusTime} value={focusTime} />
        <Button onClick={this.handleSubmit}>Submit</Button>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddTestStats);