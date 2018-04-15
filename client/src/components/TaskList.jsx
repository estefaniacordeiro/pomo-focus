import React from 'react';
import { List, Input } from 'antd';
import { connect } from 'react-redux';
import agent from '../agent';
import ACTION from '../constants';
import '../css/TaskList.css';

const mapStateToProps = state => ({
  tasks: state.tasks.slice().reverse(),
  tasksLoaded: state.common.tasksLoaded
})
const mapDispatchToProps = dispatch => ({
  submitNewName: payload => 
    dispatch({ type: ACTION.CHANGE_TASK_NAME, payload: agent.Tasks.changeName(payload) }),
  getAllTasks: () => dispatch({ type: ACTION.GET_ALL_TASKS, payload: agent.Tasks.all() }),
  deleteTask: payload => dispatch({ type: ACTION.DELETE_TASK, payload: agent.Tasks.delete(payload) })
})

class TaskList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      inEditId: null,
      nameInput: null,
      listHeight: window.innerHeight - 200
    }
    this.input = null;
  }

  componentWillReceiveProps(nextProps) {
    console.log('component will receive props');
    // Must compare tasksLoaded diff. Otherwise this method will keep getting called. Don't know why
    if (this.props.tasksLoaded && !nextProps.tasksLoaded ) {
      this.props.getAllTasks();
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeList );
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeList);
  }

  resizeList = () => {
    this.setState({
      listHeight: window.innerHeight - 200
    })
  }

  componentDidUpdate() {
    if (this.input) {
      this.input.focus();
    }
  }

  handleClickOnItem = (item) => {
    this.setState({
      inEditId: item._id,
      nameInput: item.name
    });
  }

  handleInputChange = e => {
    this.setState({
      nameInput: e.target.value
    });
  }

  submitName = () => {
    console.log('submit new task name');
    this.input = null;
    const { submitNewName } = this.props;
    const { nameInput, inEditId } = this.state;
    submitNewName({ _id: inEditId, name: nameInput });
    this.setState({
      nameInput: null,
      inEditId: null
    })
  }


  render() {
    const { tasks, tasksLoaded } = this.props;
    const { inEditId, nameInput, listHeight } = this.state;

    return (
      <div className="Task-list-wrapper" style={{height: listHeight }} >
        <List 
          className="Tasklist"
          loading={!tasksLoaded}
          itemLayout='horizontal'
          dataSource={tasks}
          renderItem={ item => (
            <List.Item actions={[ 
              <a onClick={() => this.handleClickOnItem(item)} >edit name</a>,  
              <a className='Task-list-delete' onClick={ () => this.props.deleteTask({ _id: item._id })} >delete</a> 
            ]} >
              <List.Item.Meta 
                title={ item._id === inEditId ? 
                  <Input 
                    value={nameInput} 
                    onChange={this.handleInputChange} 
                    onBlur={this.submitName}
                    onPressEnter={this.submitName} 
                    ref={ input => {this.input = input}}
                  /> : item.name }
                description={`Total hours: ${item.stats.totalMinutes ? (item.stats.totalMinutes / 60).toFixed(1) : 0}`}
              />
            </List.Item>
          )}
        
        /> 

      </div>
    )

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskList);

