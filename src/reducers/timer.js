import T from '../constants';

const min = 0.2, mode = 'focus', currentSession = 0, ticking = false;

const timer = (state = { min, mode, currentSession, ticking }, action) => {
  switch(action.type) {
    case T.SET_TIMER: 
      return {
        ...state,
        min: action.payload
      }
    case T.SET_MODE:
      return {
        ...state,
        mode: action.payload,
      };
    
    case T.SET_TICKING: 
      return {
        ...state,
        ticking: action.payload
      }

    case T.SET_SESSION_NUMBER:
      return {
        ...state,
        currentSession: action.payload
      }

    default:
      return state;
  }
}

export default timer;