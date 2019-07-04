import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

//Redux
import {createStore, combineReducers} from 'redux'
import {Provider} from 'react-redux'
import userReducer from './redux/userReducer'


const reducers = combineReducers({
    user: userReducer
})



ReactDOM.render(
    <Provider store={createStore(reducers)}>
        <App />
    </Provider>, document.getElementById('root'));
