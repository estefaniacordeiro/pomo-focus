import ACTION from '../constants';

const defaultValues = {
  seconds: 1500,
  mode: 'focus',
  currentSession: 0,
  ticking: false,
  loaded: false,
  minutesThisRound: 0
}

const timer = (state = defaultValues, action) => {
  switch(action.type) {
    case ACTION.SET_TIMER:
    case ACTION.COUNT_DOWN:
      return ({
        ...state,
        ...action.payload
      })

    case ACTION.SET_MODE:
      return {
        ...state,
        mode: action.payload,
      };
    
    case ACTION.START_TIMER:
    case ACTION.END_TIMER: 
      return {
        ...state,
        ...action.payload
      }

    case ACTION.SET_SESSION_NUMBER:
      return {
        ...state,
        currentSession: action.payload
      }

    default:
      return state;
  }
}

export default timer;