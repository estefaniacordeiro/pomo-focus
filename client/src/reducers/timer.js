import ACTION from '../constants';

const defaultValues = {
  seconds: 1500,
  mode: 'focus',
  currentSession: 0,
  ticking: false,
  loaded: false,
  minutesThisRound: 0,
  needUpdate: false,
}

const timer = (state = defaultValues, action) => {
  switch(action.type) {
    case ACTION.SET_TIMER:
      return ({
        ...state,
        ...action.payload,
        needUpdate: false
      })

    case ACTION.COUNT_DOWN:
      return ({
        ...state,
        ...action.payload
      })

    case ACTION.SET_MODE:
      return ({
        ...state,
        mode: action.payload,
      });
    
    case ACTION.START_TIMER:
      return ({
        ...state,
        ...action.payload,
      });

    case ACTION.END_TIMER: 
      return ({
        ...state,
        ...action.payload,
        needUpdate: true
      })

    case ACTION.SET_SESSION_NUMBER:
      return ({
        ...state,
        currentSession: action.payload
      })

    case ACTION.GET_SETTINGS:
    case ACTION.SUBMIT_SETTINGS:
      return ({
        ...state,
        needUpdate: !state.ticking
      })
  
    default:
      return state;
  }
}

export default timer;