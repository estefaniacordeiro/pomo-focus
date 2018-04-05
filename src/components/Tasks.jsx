import React from 'react';
import { Input, List } from 'antd';
import { connect } from 'react-redux';
import ACTION from '../constants';
import '../css/Tasks.css';
import agent from '../agent';

const mapStateToProps = state => ({
  tasks: [...state.tasks]
})

const mapDispatchToProps = dispatch => ({
  getAllTasks: () => dispatch({ type: ACTION.GET_ALL_TASKS, payload: agent.Tasks.all() }),
  addTask: newTask => dispatch({type: ACTION.ADD_TASK, payload: agent.Tasks.addNewTask(newTask) }),
  setCurrentTask: (id, lastUpdated, tasks) => 
    dispatch({type: ACTION.SET_CURRENT_TASK, payload: agent.Tasks.setCurrentTasks(id, lastUpdated), tasks})
})

class Tasks extends React.Component {

  constructor(props) {
    super(props);
    const tasks = props.tasks;

    this.state = {
      inputValue: tasks.length > 0 ? tasks.slice(-1)[0].name : null,
      showList: false
    }
  }

  componentWillMount() {
    this.props.getAllTasks();
  }

  componentWillReceiveProps(nextProps) {
    const tasks = nextProps.tasks;
    this.setState({
      inputValue: tasks.length > 0 ? tasks.slice(-1)[0].name : null
    })
  }
  
  handleInputFocus = e => {
    this.setState({
      inputValue: null
    })
  }

  handleInputBlur = e => {
    const tasks = this.props.tasks;
    this.setState({
      inputValue: tasks.length > 0 ? tasks.slice(-1)[0].name : null
    })
  }

  handleInputChange = e => {
    const value = e.target.value;
    this.setState({
      inputValue: value
    })
  }

  onSubmit = e => {
    const { addTask } = this.props;
    const value = e.target.value;
    const newTask = {
      name: value,
      lastUpdated: Date.now(),
      stats: {}
    }
    addTask(newTask);
    e.target.blur();
  }

  openTasksList = () => {
    this.setState({
      showList: true
    })
  }

  closeTasksList = () => {
    this.setState({
      showList: false
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
    this.closeTasksList();
  }

  render() {
    const { inputValue, showList } = this.state;
    const tasks = this.props.tasks.slice(0, -1).reverse();

    return (
      <div className='Tasks-wrapper'>
        <Input 
          size='large'
          suffix={<i className="fas fa-tasks Tasks-button" onMouseOver={this.openTasksList}/>}
          value={inputValue}
          placeholder="Add new task..."
          onFocus={this.handleInputFocus}
          onBlur={this.handleInputBlur}
          onPressEnter={this.onSubmit}
          onChange={this.handleInputChange}
        />
        {showList ? 
        <List 
          onMouseLeave={this.closeTasksList}
          bordered
          dataSource={ tasks }
          renderItem={ item => {
            return (<List.Item
                      className="Tasks-list-item" 
                      onClick={() => this.switchTask(item._id)}
                    >{item.name}</List.Item> )}
          }
        /> : 
        null}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tasks);