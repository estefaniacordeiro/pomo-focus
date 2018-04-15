import superagent from 'superagent';

const API_ROOT = '/api';

const responseBody = res => res.body;

let token = null;
const tokenPlugin = req => {
  if (token) {
    req.set('authorization', `Token ${token}`);
  }
}

const requests = {
  del: (url, body) =>
    superagent.del(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody),
  
  get: url =>
    superagent.get(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  
  post: (url, body) =>
    superagent.post(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody),

  put: (url, body) => 
    superagent.put(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody)
};

const Auth = {
  current: () => requests.get('/user'),

  register: (email, password) => 
    requests.post('/user', { user: { email, password } }),

  login: (email, password) => 
    requests.post('/user/login', { user: { email, password }})
}

const Settings = {
  current: () => requests.get('/settings'),
  set: settings => requests.put('/settings', { settings })
}

const Tasks = {
  all: () => requests.get('/tasks/all'),
  addNewTask: task => requests.post('/tasks', { task }),
  setCurrentTasks: (_id, lastUpdated) => requests.put('/tasks', { task: {_id, lastUpdated} }),
  addStats: payload => 
    requests.put('/tasks', { task: payload }),
  changeName: payload => requests.put('/tasks/name', { task: payload}),
  delete: payload => requests.del('/tasks', { task: payload })
}

const Stats = {
  all: () => requests.get('/stats'),
  addStats: payload => requests.post('/stats', { stats: payload }),
  // Here is an example of using fetch
  getStatsByDate: date => 
    fetch(`${API_ROOT}/stats/?date=${date}`, { 
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`
      })
    }).then( res => res.json())
  // requests.get(`/stats/?date=${date}`)
}

export default {
  Auth,
  Settings,
  Tasks,
  Stats,
  setToken: _token => { token = _token; }
}