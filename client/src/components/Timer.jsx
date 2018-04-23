import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import ACTION from '../constants';
import agent from '../agent';
import '../css/Timer.css';


const mapStateToProps = state => ({
  seconds: state.timer.seconds,
  mode: state.timer.mode,
  ticking: state.timer.ticking,
  currentSession: state.timer.currentSession,
  tasks: state.tasks,
  minutesThisRound: state.timer.minutesThisRound,
  instance: state.timer.instance,
  user: state.common.user,
  settingsUpdated: state.common.settingsUpdated,
  ...state.settings
});

const mapDispatchToProps = dispatch => ({
  startTimer: payload => dispatch({type: ACTION.START_TIMER, payload}),
  endTimer: payload => dispatch({type: ACTION.END_TIMER, payload}),
  countDown: payload => dispatch({type: ACTION.COUNT_DOWN, payload }),
  setMode: payload => dispatch({type: ACTION.SET_MODE, payload}),
  setSessionNum: payload => dispatch({type: ACTION.SET_SESSION_NUMBER, payload}),
  addStats: payload => 
    dispatch({
      type: ACTION.ADD_STATS, 
      payload: Promise.all([agent.Tasks.addStats(payload), agent.Stats.addStats(payload)]),   
      stats: payload
    }),
  throwError: error => dispatch({ type: ACTION.ERROR, payload: error }),
  setTimer: (payload) => dispatch({type: ACTION.SET_TIMER, payload}),
})

class Timer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      // totalSec: props.focusTime * 60,
      hoveredOnTimer: false
    }
    this.timer = null;
    this.lastTimer = 0;
  }

  startTimer() {
    let { seconds } = this.props;
    this.props.setTimer({minutesThisRound: seconds/60 });

    seconds--;
    const instance = setInterval( () => {
      this.props.countDown({ seconds });
      if (--seconds < 0) {
        clearInterval(instance);
        this.timerEnded();
      }
    }, 1000);
    this.props.startTimer({ticking: true, instance});
  }

  timerEnded() {
    const { mode, currentSession, sessionsGoal, tasks, minutesThisRound, user  } = this.props;
    this.props.endTimer({ticking: false, instance: null});
    this.playAlert();
    let nextMode, nextSessionNum;
    if (mode === 'focus') {
      this.popNotification('Focus');
      user && this.addStats(minutesThisRound, Date.now(), tasks.slice(-1)[0]);
      if (currentSession === sessionsGoal - 1) {
        nextMode = 'long-break';
      } else {
        nextMode = 'short-break';
      }
      nextSessionNum = currentSession;
    } else if (mode === 'short-break') {
      this.popNotification('Break');
      nextMode = 'focus';
      nextSessionNum = currentSession + 1;
    } else if (mode === 'long-break') {
      this.popNotification('Break');
      nextMode = 'focus';
      nextSessionNum = 0;
    }
    this.resetTimer(nextMode, nextSessionNum);
  }

  playAlert = () => {
    const { sound } = this.props;
    const audio = new Audio(`../sound/${sound}.mp3`);
    audio.play();
  }

  popNotification = (mode) => {
    if (Notification.permission !== 'granted') {
      return;
    }
    const { autoStartsBreak } = this.props;

    let text = `${mode} finished.`

    // if (autoStartsBreak && mode === 'Break') {
    //   text += 'Click to start focus.';
    // }

    // if (!autoStartsBreak) {
    //   text += `Click to start ${mode === 'Focus' ? 'break' : 'focus'}`; 
    // }

    const noti = new Notification(text);
    // if ((autoStartsBreak && mode === 'Break') || !autoStartsBreak) {
    //   noti.addEventListener('click', () => {
    //     this.startTimer();
    //   })
    // } 

    setTimeout( () => noti.close(), 5000);
  }

  resetTimer( nextMode, nextSessionNum) {
    const { setMode, setSessionNum, autoStartsBreak  } = this.props;
    setMode(nextMode);
    setSessionNum(nextSessionNum);
    // autoStartsBreak && nextMode.includes('break') && this.startTimer();
  }

  interrupt() {
    const { instance, endTimer } = this.props;
    clearInterval(instance);
    endTimer({ticking: false, instance: null});
  }

  clickTimer() {
    const { hoveredOnTimer } = this.state;
    const { ticking, user, tasks, throwError } = this.props;
    if (hoveredOnTimer && !ticking) {
      if (user && tasks.length === 0) {
        return throwError('Please add a task first.');
      }
      this.setState({ hoveredOnTimer: false})
      return this.startTimer();
    }
    if (hoveredOnTimer && ticking) {
      this.setState({ hoveredOnTimer: false});
      return this.interrupt();
    }
  }

  addStats(focusTime, endedAt, currentTask) {
    const { addStats } = this.props;
    const date = moment(endedAt).format("YYYY-MM-DD");
    addStats({_id: currentTask._id, name: currentTask.name, focusTime, endedAt, date });
  }


  render() {
    const { hoveredOnTimer } = this.state;
    const { seconds, mode, currentSession, totalSessions, ticking } = this.props;
    const min = parseInt(seconds / 60),
          sec = parseInt(seconds % 60);
    let timerDisplay, timerBorderColor, modeForDisplay;
    if (mode === 'focus') {
      modeForDisplay = 'Focus';
    } else if (mode === 'short-break') {
      modeForDisplay = 'Short Break';
    } else {
      modeForDisplay = 'Long Break';
    }

    if (hoveredOnTimer) {
      if (ticking) {
        timerDisplay = <i className="fas fa-stop timer-icon" />;
        timerBorderColor = '#FE484D';
      } else {
        timerDisplay = <i className="fas fa-play timer-icon" />;
        timerBorderColor = '#0581e0';
      }
    } else {
      timerDisplay = <div className="Timer-time-display">{`${min < 10 ? '0' + min : min} : ${sec < 10 ? '0' + sec : sec}`}</div>
      timerBorderColor = ticking ? '#0581e0' :'#b9b9b9';
    }

    return (
      <div className="Timer-container" >
          <div className="Timer-wrapper" 
            style={{border: `1px solid ${timerBorderColor}` }}
            onMouseEnter={() => this.setState({ hoveredOnTimer: true })} 
            onMouseLeave={() => this.setState({ hoveredOnTimer: false })}
            onClick={() => this.clickTimer()}
          >
            {timerDisplay}
          </div>
          <p className="Timer-mode-display">{`Mode: ${modeForDisplay}`} </p>
          <p className="Timer-sessions" >{`Sessions: ${currentSession}/${totalSessions}`}</p>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Timer);