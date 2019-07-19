import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'

//Redux imports
import {createStore, combineReducers} from 'redux'
import {Provider} from 'react-redux'
import userReducer from './redux/userReducer'
import errorReducer from './redux/errorReducer'
import menuReducer from './redux/menuReducer'

import './config/axios'

import './index.css'

const reducers = combineReducers({
    user: userReducer,
    error: errorReducer,
    menu: menuReducer
})



ReactDOM.render(
    <Provider store={createStore(reducers)}>
        <App />
    </Provider>, document.getElementById('root'));
