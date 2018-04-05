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
      const { focusTime, date, currentTask, timestamp } = action.payload;
      currentTask.stats.totalMinutes += focusTime;
      if (!currentTask.stats[date]) {
        currentTask.stats[date] = [];
      }
      currentTask.stats[date].push({ timestamp, focusTime });
      return [ ...state.slice(0, -1), currentTask ];

    default:
      return state;
  }
}