import ACTION from '../constants';

const defaultValues = {
  focusTime: 25,
  shortBreak: 5,
  longBreak: 15,
  totalSessions: 4,
  modalOpen: false,
}

export default (state = { ...defaultValues }, action) => {
  switch(action.type) {
    case ACTION.SUBMIT_SETTINGS:
      return ({
        ...state,
        ...action.payload.settings
      })
    case ACTION.OPEN_SETTINGS:
    case ACTION.CLOSE_SETTINGS:
      return ({
        ...state,
        ...action.payload
      })

    case ACTION.GET_SETTINGS:
      return ({
        ...state,
        ...action.payload.settings
      })

    case ACTION.LOGOUT:
      return ({
        ...defaultValues
      })
    
    
    default: 
      return state;
  }
}