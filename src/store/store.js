import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import tasksReducer from './slices/tasksSlice';
import usersReducer from './slices/usersSlice';

const rootReducer = combineReducers({
  tasks: tasksReducer,
  users: usersReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
