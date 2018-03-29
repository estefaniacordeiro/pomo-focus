import { combineReducers } from 'redux';

import timer from './timer';
import settings from './settings';
import tasks from './tasks';
import stats from './stats';

export default combineReducers({
  timer,
  settings,
  tasks,
  stats
})