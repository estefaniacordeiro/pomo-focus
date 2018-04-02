import superagent from 'superagent';

const API_ROOT = 'http://localhost:4000/api';

const responseBody = res => res.body;

let token = null;
const tokenPlugin = req => {
  if (token) {
    req.set('authorization', `Token ${token}`);
  }
}

const requests = {
  del: url =>
    superagent.del(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  
  get: url =>
    superagent.get(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  
  post: (url, body) =>
    superagent.post(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody),

  put: (url, body) => 
    superagent.put(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody)
};

const Auth = {
  register: (email, password) => 
    requests.post('/user', { user: { email, password } }),

  login: (email, password) => 
    requests.post('/user/login', { user: { email, password }})
}

export default {
  Auth,
  setToken: _token => { token = _token; }
}