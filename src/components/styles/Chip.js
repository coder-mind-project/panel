import { COLOR_APP, COLOR_APP_HOVER } from '../../config/dataProperties'

export const styles = theme => ({
    success: {
        backgroundColor: 'rgb(30,178,15)',
        color: '#fff',
        '&:hover':{
            backgroundColor: 'rgba(20,168,10)',
        },
    },
    danger: {
        backgroundColor: 'rgb(215,49,12)',
        color: '#fff',
        '&:hover':{
            backgroundColor: 'rgba(205,39,7)',
        },
    },
    default: {
        backgroundColor: COLOR_APP,
        color: '#fff',
        '&:hover':{
            backgroundColor: COLOR_APP_HOVER,
        },
    },
    gray: {
        backgroundColor: 'rgb(213,213,213)',
        color: '#000',
        '&:hover':{
            backgroundColor: 'rgba(203,203,203)',
        },
    },
    warning: {
        backgroundColor: 'rgb(255,195,0)',
        color: '#000',
        '&:hover':{
            backgroundColor: 'rgba(245,185,0)',
        },
    },
    chipContent: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 125
    }
})

export default {styles}