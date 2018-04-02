import T from '../constants';

const defaultValues = {
  focusTime: 0.2,
  shortBreak: 0.1,
  longBreak: 1,
  totalSessions: 2,
  modalOpen: false,
}

export default (state = { ...defaultValues }, action) => {
  switch(action.type) {
    case T.SUBMIT_SETTINGS:
    case T.OPEN_SETTINGS:
    case T.CLOSE_SETTINGS:
      return ({
        ...state,
        ...action.payload
      })
    
    default: 
      return state;
  }
}