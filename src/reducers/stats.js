import T from '../constants';

export default (state = {}, action) => {
  switch(action.type) {
    case T.ADD_STATS:
      const { focusTime, date, currentTask, timestamp } = action.payload; 
      if (!state[date]) {
        state[date] = [];
      }
      state[date].push({ timestamp, task: currentTask.name, focusTime });
      return { ...state, [date]: state[date]};

    default:
      return state;
  }
}