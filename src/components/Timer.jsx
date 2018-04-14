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
  totalSessions: state.settings.totalSessions,
  focusTime: state.settings.focusTime,
  shortBreak: state.settings.shortBreak,
  longBreak: state.settings.longBreak,
  sound: state.settings.sound,
  tasks: state.tasks,
  minutesThisRound: state.timer.minutesThisRound,
  instance: state.timer.instance
});

const mapDispatchToProps = dispatch => ({
  startTimer: payload => dispatch({type: ACTION.START_TIMER, payload}),
  endTimer: payload => dispatch({type: ACTION.END_TIMER, payload}),
  setTimer: (payload) => dispatch({type: ACTION.SET_TIMER, payload}),
  countDown: payload => dispatch({type: ACTION.COUNT_DOWN, payload }),
  setMode: payload => dispatch({type: ACTION.SET_MODE, payload}),
  setSessionNum: payload => dispatch({type: ACTION.SET_SESSION_NUMBER, payload}),
  addStats: payload => 
    dispatch({
      type: ACTION.ADD_STATS, 
      payload: Promise.all([agent.Tasks.addStats(payload), agent.Stats.addStats(payload)]),   
      stats: payload
    }),
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
    this.setTimer();
  }

  componentWillUnmount() {
    console.log('Timer unmounted.');
    
  }

  componentWillReceiveProps(nextProps) {
    const { focusTime, shortBreak, longBreak, mode, timer, ticking } = nextProps;
    if (!ticking) {
      this.setTimer({mode, shortBreak, longBreak, focusTime});
    }
  }

  setTimer(params = this.props) {
    const { mode, shortBreak, longBreak, focusTime, ticking } = params;
    if (ticking) return;
    let min;
    switch(mode) {
      case 'focus':
        min = focusTime;
        break;
      case 'short-break':
        min = shortBreak;
        break;
      case 'long-break':
        min = longBreak;
        break;
      default:
        min = 0;
        break;
    }
    
    this.props.setTimer({seconds: min * 60});
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
    const { mode, currentSession, sessionsGoal, focusTime, shortBreak, longBreak, tasks, minutesThisRound  } = this.props;
    this.props.endTimer({ticking: false, instance: null});
    this.playAlert();
    let nextCountDown, nextMode, nextSessionNum;
    if (mode === 'focus') {
      this.popNotification('Focus');
      this.addStats(minutesThisRound, Date.now(), tasks.slice(-1)[0]);
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
    
    const noti = new Notification(`${mode} finished. Click to start ${mode === 'Focus' ? 'break' : 'focus'}`);
    noti.addEventListener('click', () => {
      this.startTimer();
    })
    setTimeout( () => noti.close(), 5000);
  }

  resetTimer( mode, sessionNum) {
    const { setMode, setSessionNum  } = this.props;
    setMode(mode);
    setSessionNum(sessionNum);
  }

  interrupt() {
    const { instance, clearInstance, endTimer } = this.props;
    clearInterval(instance);
    endTimer({ticking: false, instance: null});
    this.setTimer()
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

  addStats(focusTime, endedAt, currentTask) {
    const { addStats } = this.props;
    const date = moment(endedAt).format("YYYY-MM-DD");
    addStats({_id: currentTask._id, name: currentTask.name, focusTime, endedAt, date });
  }


  render() {
    const { totalSec, hoveredOnTimer } = this.state;
    const { seconds, mode, currentSession, totalSessions, ticking } = this.props;
    const min = parseInt(seconds / 60),
          sec = parseInt(seconds % 60);
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