import { createStore, applyMiddleware, compose } from 'redux';
import reducer from './reducers';
import { promiseMiddleware, localStorageMiddleware } from './middleware';


// const myRouterMiddleware = routerMiddleware(history);

const composeEnhancers = window.window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, composeEnhancers(
  applyMiddleware(promiseMiddleware, localStorageMiddleware)
));



export { store }; 

