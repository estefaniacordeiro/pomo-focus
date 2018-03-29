import T from '../constants';

const defaultState = [
  {name: 'Pomo timer project', lastTime: 1522265421000, stats: { totalMinutes: 0 }},
  {name: 'Smartphone assignment', lastTime: 1522265421002, stats: { totalMinutes: 0 }},
  {name: 'Doing exercise', lastTime: 1522265421004, stats: { totalMinutes: 0 }}
]

export default (state=[...defaultState], action) => {
  switch(action.type) {
    case T.ADD_TASK:
      return [...state, action.payload];

    case T.SET_CURRENT_TASK: 
      return [...action.payload];

    case T.ADD_STATS:
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