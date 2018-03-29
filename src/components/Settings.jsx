import React from 'react';
import { Modal, TimePicker, InputNumber } from 'antd';
import moment from 'moment';
import { connect } from 'react-redux';
import T from '../constants';
import '../css/Settings.css';

const mapStateToProps = state => ({
  ...state.timer,
  ...state.settings,
})

const mapDispatchToProps = dispatch => ({
  submitSettings: settings => dispatch({type: T.SUBMIT_SETTINGS, payload: settings}),
  setTimer: time => dispatch({ type: T.SET_TIMER, payload: time})
})

class Settings extends React.Component {

  constructor(props) {
    super(props);
    const { focusTime, shortBreak, longBreak, totalSessions } = props;
    this.state = {
      visible: false,
      focusTime,
      shortBreak,
      longBreak,
      totalSessions
    }
  }


  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.visible
    })
  }

  handleTimeChange = field => moment => {
    this.setState({
      [field]: moment.minutes()
    })
  }

  handleSessionsChange = num => {
    this.setState({
      totalSessions: num
    })
  }

  onSubmit = () => {
    const { close, submitSettings, mode, ticking, setTimer } = this.props;
    const { focusTime, shortBreak, longBreak, totalSessions } = this.state;
    submitSettings({ focusTime, shortBreak, longBreak, totalSessions });
    if (!ticking) {
      if (mode === 'focus') {
        setTimer(focusTime);
      } else if (mode==='short-break') {
        setTimer(shortBreak);
      } else if (mode === 'long-break') {
        setTimer(longBreak);
      }
    }
    close();
  }

  render() {
    const { openModal, close } = this.props;
    const { focusTime, shortBreak, longBreak, totalSessions } = this.state;

    return (
      <Modal
        title="Settings"
        visible={this.state.visible}
        onOk={this.onSubmit}
        onCancel={close}
      >
      <div className="Settings-content">

        <div className="Settings-item">
          <div className="Settings-item-name">Focus time(min)  </div>
          <TimePicker 
            value={moment(focusTime, 'mm')} 
            format='mm' 
            size='large' 
            onChange={this.handleTimeChange('focusTime')} />
        </div>
        <div className="Settings-item">
          <div className="Settings-item-name">Short break(min)  </div>
          <TimePicker 
            value={moment(shortBreak, 'mm')} 
            format='mm' 
            size='large' 
            onChange={this.handleTimeChange('shortBreak')}
          />
        </div>
        <div className="Settings-item">
          <div className="Settings-item-name">Long break(min)  </div>
          <TimePicker 
            value={moment(longBreak, 'mm')} 
            format='mm' 
            size='large'
            onChange={this.handleTimeChange('longBreak')} 
          />
        </div>
        <div className="Settings-item">
          <div className="Settings-item-name">Total sessions  </div>
          <InputNumber 
            className="Settings-set-sessions" 
            value={totalSessions} 
            min={1} 
            max={8} 
            onChange={this.handleSessionsChange}
          />
        </div>
      </div>

      
      
      </Modal>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);