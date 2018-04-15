import React from 'react';
import TimelineBar from './charts/TimelineBar';
import DailyTotalTime from './charts/DailyTotalTime';
import { connect } from 'react-redux';
import { DatePicker, Spin } from 'antd';
import moment from 'moment';
import ACTION from '../constants';
import agent from '../agent';
import '../css/Statistics.css';

const mapStateToProps = state => ({
  stats: state.stats,
  statsByDate: state.stats.statsByDate,
  appLoaded: state.common.appLoaded,
  tasks: state.tasks,
  tasksLoaded: state.common.tasksLoaded,
  statsLoaded: state.common.statsLoaded
})

const mapDispatchToProps = dispatch => ({
  getStats: date => dispatch({ type: ACTION.GET_STATS, payload: agent.Stats.getStatsByDate(date)}),
  requestStats: () => dispatch({ type: ACTION.REQUEST_STATS })
})

class Statistics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: moment().format('YYYY-MM-DD')
    }
    this.setUpTasksIdMap(props);
  }

  componentDidMount() {
    const { date } = this.state;
    this.props.getStats(date);
  }

  componentWillReceiveProps(nextProps) {
    this.setUpTasksIdMap(nextProps);
    
    if (this.props.statsLoaded && !nextProps.statsLoaded) {
      this.props.getStats(this.state.date);
    }
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
      this.setState({
        date: moment.format('YYYY-MM-DD')
      }, this.props.requestStats);
    }
    
  }

  handleDateBackOrForth = direction => {
    const { date } = this.state;
    if (direction === 'back') {
      this.setState({
        date: moment(date).subtract(1, 'd').format('YYYY-MM-DD')
      }, this.props.requestStats)
    } else {
      this.setState({
        date: moment(date).add(1, 'd').format('YYYY-MM-DD')
      }, this.props.requestStats)
    }
  }

  render() {
    const { stats, appLoaded, tasks, statsLoaded, tasksLoaded, statsByDate } = this.props;
    const { date } = this.state;
    const dateForDatePick = moment(date);
    console.log(stats);
    console.log(date);
    
  

    return (
      <div className="Stats-container">
        <div className="Stats-date-picker-wrapper">
          <i className="fas fa-angle-left Stats-arrow" onClick={ () => this.handleDateBackOrForth('back')} />
          <DatePicker className="Stats-date-picker" value={dateForDatePick} format='YYYY-MM-DD' onChange={this.handleDateChange} />
          <i className="fas fa-angle-right Stats-arrow" onClick={() => this.handleDateBackOrForth('forth')} />
        </div>
        <Spin spinning={ !tasksLoaded || !statsLoaded } size="large" >
          <div>
            <TimelineBar stats={statsByDate} tasksIdMap={this.tasksIdMap} date={date} />
            <DailyTotalTime stats={statsByDate} tasksIdMap={this.tasksIdMap} date={date}/>
          </div>
        </Spin>
      </div>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Statistics);