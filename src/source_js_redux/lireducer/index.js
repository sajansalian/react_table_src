import {combineReducers, createStore } from 'redux';
import UserList from './userReducer';
import SearchUser from './searchReducer';

const allReducers = combineReducers({
    user : UserList,
   // searchresult : SearchUser
});

export default allReducers;