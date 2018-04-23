import React from 'react';
import { Modal, TimePicker, InputNumber, Alert, Select, Switch } from 'antd';
import moment from 'moment';
import { connect } from 'react-redux';
import ACTION from '../constants';
import agent from '../agent';
import '../css/Settings.css';

const Option = Select.Option;

const mapStateToProps = state => ({
  ...state.settings,
  user: state.common.user
})

const mapDispatchToProps = dispatch => ({
  submitSettings: settings => 
    dispatch({type: ACTION.SUBMIT_SETTINGS, payload: agent.Settings.set(settings)}), 
  submitSettingsWithoutSignIn: settings => dispatch({ type: ACTION.SUBMIT_SETTINGS, payload: {settings} })
})

class Settings extends React.Component {

  constructor(props) {
    super(props);
    const { focusTime, shortBreak, longBreak, totalSessions, autoStartsBreak, sound } = props;
    this.state = {
      visible: false,
      focusTime,
      shortBreak,
      longBreak,
      totalSessions,
      alert: null,
      autoStartsBreak,
      sound
    }
    this.timePickers = {};
  }

  setRefs = (field, element) => {
    this.timePickers[field] = element;
  }


  componentWillReceiveProps(nextProps) {
    const { focusTime, shortBreak, longBreak, totalSessions, autoStartsBreak, sound } = nextProps;
    this.setState({
      focusTime,
      shortBreak,
      longBreak,
      totalSessions,
      autoStartsBreak,
      sound,
      visible: nextProps.visible
    })
  }

  handleTimeChange = field => moment => {
    moment && this.setState({
      [field]: moment.minutes()
    })
    if (this.timePickers[field]) {
      this.timePickers[field].blur();
      console.log(field + ' blured');
      console.log(this.timePickers);
      
    }
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

  handleAutoStartsBreak = checked => {
    this.setState({
      autoStartsBreak: checked
    })
  }

  onSubmit = () => {
    const { close, submitSettings, user, submitSettingsWithoutSignIn } = this.props;
    const { focusTime, shortBreak, longBreak, totalSessions, sound, autoStartsBreak } = this.state;
    if (user) {
      submitSettings({ focusTime, shortBreak, longBreak, totalSessions, sound, autoStartsBreak });
    } else {
      submitSettingsWithoutSignIn({ focusTime, shortBreak, longBreak, totalSessions, sound, autoStartsBreak });
    }
    close();
  }

  handleSoundSelect = sound => {
    console.log({sound});
    this.setState({
      sound
    })
  }

  playSound = () => {
    const { sound } = this.state;
    const audio = new Audio(`../sound/${sound}.mp3`);
    audio.play();
  }



  render() {
    const { close } = this.props;
    const { focusTime, shortBreak, longBreak, totalSessions, alert, autoStartsBreak, sound } = this.state;

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
          <div className="Settings-item-content">
            <TimePicker 
              value={moment(focusTime, 'mm')} 
              format='mm' 
              size='large' 
              onChange={this.handleTimeChange('focusTime')}
              ref={ e => this.setRefs('focusTime', e)} />
          </div>
        </div>
        <div className="Settings-item">
          <div className="Settings-item-name">Short break(min)  </div>
          <div className="Settings-item-content">
            <TimePicker 
              value={moment(shortBreak, 'mm')} 
              format='mm' 
              size='large' 
              onChange={this.handleTimeChange('shortBreak')}
            />
          </div>
        </div>
        <div className="Settings-item">
          <div className="Settings-item-name">Long break(min)  </div>
          <div className="Settings-item-content">
            <TimePicker 
              value={moment(longBreak, 'mm')} 
              format='mm' 
              size='large'
              onChange={this.handleTimeChange('longBreak')} 
            />
          </div>
        </div>
        <div className="Settings-item">
          <div className="Settings-item-name">Total sessions  </div>
          <div className="Settings-item-content">
            <InputNumber 
              className="Settings-set-sessions" 
              value={totalSessions} 
              min={1} 
              max={8} 
              onChange={this.handleSessionsChange}
            />
          </div>
        </div>
        <div className="Settings-item">
          <div className="Settings-item-name">Alert sound</div>
          <div className="Settings-item-content">
            <Select value={sound} style={{width: 120}} onChange={this.handleSoundSelect} >
              <Option value='definite'>Definite</Option>
              <Option value='attention-seeker'>Attention-seeker</Option>
              <Option value='jingle-bells'>Jingle-bells</Option>
              <Option value='long-expected'>Long-expected</Option>
            </Select >
            <i className="fas fa-play-circle play-sound" onClick={this.playSound} />
          </div>
        </div>
        {/* <div className="Settings-item">
          <div className="Settings-item-name">Auto starts break</div>
          <div className="Settings-item-content">
            <Switch checked={autoStartsBreak} onChange={this.handleAutoStartsBreak} />
          </div>
        </div> */}
      </div>

      
      
      </Modal>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);