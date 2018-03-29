import T from '../constants';

const focusTime = 1, shortBreak = 1, longBreak = 2, totalSessions = 2;

export default (state = { focusTime, shortBreak, longBreak, totalSessions }, action) => {
  switch(action.type) {
    case T.SUBMIT_SETTINGS:
      return ({
        ...state,
        ...action.payload
      })
    default: 
      return state;
  }
}