import ACTION from '../constants';

const defaultValues = {
  mode: 'focus',
  currentSession: 0,
  ticking: false,
  loaded: false
}

const timer = (state = defaultValues, action) => {
  switch(action.type) {
    case ACTION.SET_MODE:
      return {
        ...state,
        mode: action.payload,
      };
    
    case ACTION.SET_TICKING: 
      return {
        ...state,
        ticking: action.payload
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