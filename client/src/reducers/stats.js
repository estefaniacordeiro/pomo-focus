import ACTION from '../constants';

export default (state = {}, action) => {
  switch(action.type) {
    case ACTION.GET_ALL_STATS:
      return ({
        ...state,
        ...action.payload.stats
      })

    case ACTION.GET_STATS:
      return ({
        ...state,
        statsByDate: action.payload.stats
      })

    case ACTION.ADD_STATS:
      if (action.payload[1].success) {
        return { ...state, ...action.payload[1].stats};
      }
      return state;

    case ACTION.LOGOUT:
      return {};

    default:
      return state;
  }
}