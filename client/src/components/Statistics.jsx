import React from 'react';
import TimelineBar from './charts/TimelineBar';
import DailyTotalTime from './charts/DailyTotalTime';
import { connect } from 'react-redux';
import { DatePicker, Spin, Alert } from 'antd';
import moment from 'moment';
import ACTION from '../constants';
import agent from '../agent';
import '../css/Statistics.css';
import { SSL_OP_NO_QUERY_MTU } from 'constants';

const mapStateToProps = state => ({
  stats: state.stats,
  statsByDate: state.stats.statsByDate,
  appLoaded: state.common.appLoaded,
  tasks: state.tasks,
  tasksLoaded: state.common.tasksLoaded,
  statsLoaded: state.common.statsLoaded,
  user: state.common.user
})

const mapDispatchToProps = dispatch => ({
  getStats: date => dispatch({ type: ACTION.GET_STATS, payload: agent.Stats.getStatsByDate(date)}),
  requestStats: () => dispatch({ type: ACTION.REQUEST_STATS }),
  throwError: err => dispatch({ type: ACTION.ERROR, payload: err }),
  getAllTasks: () => dispatch({ type: ACTION.GET_ALL_TASKS, payload: agent.Tasks.all() }),
})

class Statistics extends React.Component {
  // constructor(props) {
  //   super(props);
  //   // this.state = {
  //   //   date: moment().format('YYYY-MM-DD')
  //   // }
  //   this.setUpTasksIdMap(props);
  //   if (props.user) {
  //     this.date = this.parseQueryString(this.props.history.location.search);
  //     !this.date && this.props.getStats(this.date);
  //   }
  // }
  componentWillMount() {
    this.setUpTasksIdMap(this.props);
    if (this.props.user) {
      this.date = this.parseQueryString(this.props.history.location.search);
      this.date && this.props.getStats(this.date);
    } 
  }

  // componentDidMount() {
  //   // const { date } = this.state;
  //   const { tasksLoaded, getAllTasks, user } = this.props;

  //   if (!tasksLoaded && user) {
  //     getAllTasks();
  //   }
  // }

  componentWillReceiveProps(nextProps) {

    const { user, tasksLoaded } = this.props;

    // When initially get user token and fetch stats
    if (!this.props.user && nextProps.user) {
      this.date = this.parseQueryString(this.props.history.location.search);
      this.date && this.props.getStats(this.date); 
      this.lastQueryString = this.props.history.location.search;

      if (!tasksLoaded) {
        this.props.getAllTasks();
      }
    }
    
    // Fetch stats when date changes
    if (nextProps.user && this.lastQueryString !== nextProps.history.location.search) {
      this.lastQueryString = nextProps.history.location.search;
      this.date = this.parseQueryString(nextProps.history.location.search);
      this.date && this.props.getStats(this.date);  
    }
    
    this.setUpTasksIdMap(nextProps);
    
  }

  setUpTasksIdMap = (props) => {
    const { tasksLoaded, tasks } = props;
    if (!this.tasksIdMap && tasksLoaded ) {
      this.tasksIdMap = {};
      tasks.forEach( task => {
        this.tasksIdMap[task._id] = task.name;
      })
    }
  }

  handleDateChange = moment => {
    if (moment) {
      const newDate = moment.format('YYYY-MM-DD');
      this.props.history.push(`/stats?date=${newDate}`);
      this.date = newDate;
      // this.setState({
      //   date: moment.format('YYYY-MM-DD')
      // }, this.props.requestStats);
    }
    
  }

  handleDateBackOrForth = direction => {
    const date = this.date;
    const url = '/stats?date=';
    let newDate;
    if (direction === 'back') {
      newDate = moment(date).subtract(1, 'd').format('YYYY-MM-DD');
      // this.setState({
      //   date: moment(date).subtract(1, 'd').format('YYYY-MM-DD')
      // }, this.props.requestStats)
    } else {
      newDate = moment(date).add(1, 'd').format('YYYY-MM-DD');
      // this.setState({
      //   date: moment(date).add(1, 'd').format('YYYY-MM-DD')
      // }, this.props.requestStats)
    }
    this.date = newDate;
    this.props.history.push(`${url}${newDate}`);
  }

  parseQueryString = qs => {
    const date = qs.slice(6);
    return moment(date).isValid() ? date : null
  }

  render() {
    const { stats, statsLoaded, tasksLoaded, statsByDate, user, throwError } = this.props;
    // const { date } = this.state;
    if (!this.date && user) {
      throwError('URL is invalid!');
      return null;
    }    
    const date = this.date;

    const dateForDatePick = moment(date);
    
    if (!user) {
      return (
        <div style={{ width: 400, margin: '0 auto' }}>
          <Alert 
            className="alert-warning-no-signin"
            message='Oops!'
            description='You must sign in to use this feature.'
            type='warning'
            showIcon
          />
        </div>
      )
    }

    return (
      <div className="Stats-container">
        <div className="Stats-date-picker-wrapper">
          <i className="fas fa-angle-left Stats-arrow" onClick={ () => this.handleDateBackOrForth('back')} />
          <DatePicker className="Stats-date-picker" value={dateForDatePick} format='YYYY-MM-DD' onChange={this.handleDateChange} />
          <i className="fas fa-angle-right Stats-arrow" onClick={() => this.handleDateBackOrForth('forth')} />
        </div>
        <Spin spinning={ !tasksLoaded || !statsLoaded } size="large" >
          { !tasksLoaded || !statsLoaded ? null : 
            <div>
              <TimelineBar stats={statsByDate} tasksIdMap={this.tasksIdMap} date={date} />
              <DailyTotalTime stats={statsByDate} tasksIdMap={this.tasksIdMap} date={date}/>
            </div>
          }
        </Spin>
      </div>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Statistics);