import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'

//Redux imports
import {createStore, combineReducers} from 'redux'
import {Provider} from 'react-redux'
import userReducer from './redux/userReducer'
import errorReducer from './redux/errorReducer'
import menuReducer from './redux/menuReducer'
import toastReducer from './redux/toastReducer'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

import './config/axios'

import './index.css'

const reducers = combineReducers({
    user: userReducer,
    error: errorReducer,
    menu: menuReducer,
    toast: toastReducer
})

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#088FF6'
        },
        secondary: {
            main: '#8a05be'
        },
        action:{
            disabled: 'rgb(0,0,0)',
            disabledBackground: 'rgb(190,190,190)'
        }
    }
})



ReactDOM.render(
    <Provider store={createStore(reducers)}>
        <MuiThemeProvider theme={theme}>
            <App />
        </MuiThemeProvider>
    </Provider>
    , document.getElementById('root'));
