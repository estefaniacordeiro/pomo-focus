import React from 'react';
import { Modal, TimePicker, InputNumber, Alert } from 'antd';
import moment from 'moment';
import { connect } from 'react-redux';
import ACTION from '../constants';
import agent from '../agent';
import '../css/Settings.css';

const mapStateToProps = state => ({
  ...state.timer,
  ...state.settings
})

const mapDispatchToProps = dispatch => ({
  submitSettings: settings => 
    dispatch({type: ACTION.SUBMIT_SETTINGS, payload: agent.Settings.set(settings)}),  
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
      totalSessions,
      alert: null
    }
  }


  componentWillReceiveProps(nextProps) {
    const { focusTime, shortBreak, longBreak, totalSessions } = nextProps;
    this.setState({
      focusTime,
      shortBreak,
      longBreak,
      totalSessions,
      visible: nextProps.visible
    })
  }

  handleTimeChange = field => moment => {
    this.setState({
      [field]: moment.minutes()
    })
  }

  handleSessionsChange = num => {
    if ( num !== '' && typeof num !== 'number') {
      const alert = 'Total sessions can be numbers only!'
      this.setState({
        alert
      })
      return;
    }
    this.setState({
      alert: null,
      totalSessions: num
    })
  }

  onSubmit = () => {
    const { close, submitSettings, mode, ticking } = this.props;
    const { focusTime, shortBreak, longBreak, totalSessions } = this.state;
    submitSettings({ focusTime, shortBreak, longBreak, totalSessions });
    close();
  }

  render() {
    const { openModal, close } = this.props;
    const { focusTime, shortBreak, longBreak, totalSessions, alert } = this.state;

    return (
      <Modal
        title="Settings"
        visible={this.state.visible}
        onOk={this.onSubmit}
        onCancel={close}
      >
      <div className="Settings-content">
        { alert ? <Alert type="error" message={alert} showIcon /> : null}
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