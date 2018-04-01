import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import T from '../constants';
import '../css/Timer.css';


const mapStateToProps = state => ({
  min: state.timer.min,
  mode: state.timer.mode,
  ticking: state.timer.ticking,
  currentSession: state.timer.currentSession,
  totalSessions: state.settings.totalSessions,
  focusTime: state.settings.focusTime,
  shortBreak: state.settings.shortBreak,
  longBreak: state.settings.longBreak,
  tasks: state.tasks
});

const mapDispatchToProps = dispatch => ({
  startTimer: () => dispatch({type: T.SET_TICKING, payload: true}),
  endTimer: () => dispatch({type: T.SET_TICKING, payload: false}),
  setTimer: (payload) => dispatch({type: T.SET_TIMER, payload}),
  setMode: payload => dispatch({type: T.SET_MODE, payload}),
  setSessionNum: payload => dispatch({type: T.SET_SESSION_NUMBER, payload}),
  addStats: payload => dispatch({type: T.ADD_STATS, payload}),
})

class Timer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      totalSec: props.min * 60,
      hoveredOnTimer: false
    }
    this.timer = null;
  }

  componentWillReceiveProps(nextProps) {
    const { min } = nextProps;
    console.log(" Will receive props" ,{ min });
    
    this.setState({
      totalSec: min * 60
    });
  }

  startTimer() {
    let { totalSec } = this.state;
    this.props.startTimer();
    totalSec--;
    this.timer = setInterval( () => {
      this.setState({
        totalSec
      });
      if (--totalSec < 0) {
        clearInterval(this.timer);
        this.timer = null;
        this.timerEnded();
      }
    }, 1000);
  }

  timerEnded() {
    this.props.endTimer();
    const { min, mode, currentSession, sessionsGoal, focusTime, shortBreak, longBreak, tasks  } = this.props;
    let nextCountDown, nextMode, nextSessionNum;
    if (mode === 'focus') {
      this.addStats(min, Date.now(), tasks.slice(-1)[0]);
      if (currentSession === sessionsGoal - 1) {
        nextCountDown = longBreak;
        nextMode = 'long-break';
      } else {
        nextCountDown = shortBreak;
        nextMode = 'short-break';
      }
      nextSessionNum = currentSession;
    } else if (mode === 'short-break') {
      nextCountDown = focusTime;
      nextMode = 'focus';
      nextSessionNum = currentSession + 1;
    } else if (mode === 'long-break') {
      nextCountDown = focusTime;
      nextMode = 'focus';
      nextSessionNum = 0;
    }
    this.resetTimer(nextCountDown, nextMode, nextSessionNum);
  }

  resetTimer(countDown, mode, sessionNum) {
    const { setTimer, setMode, setSessionNum  } = this.props;
    setTimer(countDown);
    setMode(mode);
    setSessionNum(sessionNum);
  }

  interrupt() {
    clearInterval(this.timer);
    this.timer = null;
    this.props.endTimer();
    this.setState({ totalSec: this.props.min * 60 }); 
  }

  clickTimer() {
    const { hoveredOnTimer } = this.state;
    const { ticking } = this.props;
    if (hoveredOnTimer && !ticking) {
      this.setState({ hoveredOnTimer: false})
      return this.startTimer();
    }
    if (hoveredOnTimer && ticking) {
      this.setState({ hoveredOnTimer: false});
      return this.interrupt();
    }
  }

  addStats(focusTime, timestamp, currentTask) {
    const { addStats } = this.props;
    const date = moment(timestamp).format("MMDDYYYY");
    addStats({ date, focusTime, currentTask, timestamp });
    // currentTask.stats.totalMinutes += focusTime;


  }


  render() {
    const { totalSec, hoveredOnTimer } = this.state;
    const { mode, currentSession, totalSessions, ticking } = this.props;
    const min = parseInt(totalSec / 60),
          sec = parseInt(totalSec % 60);
    let timerDisplay;

    if (hoveredOnTimer) {
      timerDisplay = ticking ? 
      (<i className="fas fa-stop"></i>) :
      (<i className="fas fa-play"></i>)
    } else {
      timerDisplay = <div className="Timer-time-display">{`${min < 10 ? '0' + min : min} : ${sec < 10 ? '0' + sec : sec}`}</div>
    }

    return (
      <div>
          <div className="Timer-wrapper" 
            onMouseEnter={() => this.setState({ hoveredOnTimer: true })} 
            onMouseLeave={() => this.setState({ hoveredOnTimer: false })}
            onClick={() => this.clickTimer()}
          >
            {timerDisplay}
          </div>
          <p>{`Mode: ${mode}`} </p>
          <p>{`Sessions: ${currentSession}/${totalSessions}`}</p>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Timer);