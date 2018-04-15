import ACTION from '../constants';

const defaultValues = {
  inProgress: false,
  redirectTo: null,
  user: null,
  token: null,
  error: false,
  appLoaded: false,
  tasksLoaded: false,
  statsLoaded: false,
  error: null
}

export default (state={...defaultValues}, action) => {
  switch(action.type) {
    case ACTION.ASYNC_START:
      return ({
        ...state,
        inProgress: true
      })

    case ACTION.ERROR:
      return ({
        ...state,
        error: action.payload
      })

    case ACTION.APP_LOAD:
      return ({
        ...state,
        ...action.payload.user,
        inProgress: false,
        appLoaded: true
      })

    case ACTION.REDIRECT:
      return ({
        ...state,
        redirectTo: null
      })

    case ACTION.CLEAR_ERROR:
      return ({
        ...state,
        error: null
      })

    case ACTION.LOGOUT: 
      return ({
        ...state,
        user: null,
        token: null,
        redirectTo: '/'
      })

    case ACTION.LOGIN:
    case ACTION.REGISTER:
      if (action.error) {
        return {
          ...state,
          error: action.payload,
          inProgress: false
        }
      }
      return ({
        ...state,
        ...action.payload.user,
        inProgress: false,
        redirectTo: '/'
      })

    case ACTION.GET_ALL_STATS:
    case ACTION.GET_STATS:
      return ({
        ...state,
        statsLoaded: true
      })

    case ACTION.REQUEST_STATS:
      return ({
        ...state,
        statsLoaded: false
      })

    case ACTION.GET_ALL_TASKS:
      console.log('get-all-tasks COMMON');
      
      return ({
        ...state,
        tasksLoaded: true
      })

    case ACTION.CHANGE_TASK_NAME:
    case ACTION.DELETE_TASK:
      return ({
        ...state,
        tasksLoaded: false
      })

    default:
      return state;
  }
}
