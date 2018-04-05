import { combineReducers } from 'redux';

import timer from './timer';
import settings from './settings';
import tasks from './tasks';
import stats from './stats';
import common from './common';

export default combineReducers({
  timer,
  settings,
  tasks,
  stats,
  common
})