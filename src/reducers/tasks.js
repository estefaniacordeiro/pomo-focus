import ACTION from '../constants';

const defaultState = [];

export default (state=[...defaultState], action) => {
  switch(action.type) {
    case ACTION.GET_ALL_TASKS:
      return [ ...action.payload.tasks ];

    case ACTION.ADD_TASK:
      return [...state, action.payload.newTask];

    case ACTION.SET_CURRENT_TASK: 
      if (action.payload.success) {
        return [...action.tasks];
      }
      return state;

    case ACTION.ADD_STATS:
      if (action.payload.success) {
        return [...state.slice(0, -1), action.payload.currentTask ];
      }
      return state;

    default:
      return state;
  }
}