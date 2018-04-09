import React from 'react';
import TimelineBar from './charts/TimelineBar';
import DailyTotalTime from './charts/DailyTotalTime';
import { connect } from 'react-redux';
import { DatePicker } from 'antd';
import moment from 'moment';
import '../css/Statistics.css';

const mapStateToProps = state => ({
  stats: state.stats,
  appLoaded: state.common.appLoaded,
  tasks: state.tasks,
  tasksLoaded: state.common.tasksLoaded,
  statsLoaded: state.common.statsLoaded
})

const mapDispatchToProps = null;

class Statistics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: moment().format('YYYY-MM-DD')
    }
    this.setUpTasksIdMap(props);
  }

  componentWillReceiveProps(nextProps) {
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
      this.setState({
        date: moment.format('YYYY-MM-DD')
      })
    }
  }

  render() {
    const { stats, appLoaded, tasks, statsLoaded, tasksLoaded } = this.props;
    const { date } = this.state;
    
    console.log(stats);
    console.log(date);
    
  

    return (
      <div className="Stats-container">
        <div className="Stats-date-picker">
          <DatePicker defaultValue={moment()} format='YYYY-MM-DD' onChange={this.handleDateChange} />
        </div>
        { statsLoaded && tasksLoaded ? (
          <div>
            <TimelineBar stats={stats[date]} tasksIdMap={this.tasksIdMap} date={date} />
            <DailyTotalTime stats={stats[date]} tasksIdMap={this.tasksIdMap} date={date}/>
          </div>
        ) : null }
      </div>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Statistics);