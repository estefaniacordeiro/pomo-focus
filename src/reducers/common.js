import ACTION from '../constants';

const defaultValues = {
  inProgress: false,
  redirectTo: null,
  user: null,
  token: null,
  error: false,
  appLoaded: false,
}

export default (state={...defaultValues}, action) => {
  switch(action.type) {
    case ACTION.ASYNC_START:
      return ({
        ...state,
        inProgress: true
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

    default:
      return state;
  }
}
