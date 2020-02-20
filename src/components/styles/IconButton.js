import { COLOR_APP, COLOR_APP_HOVER } from '../../config/dataProperties'

export const styles = theme => ({
    success: {
        color: 'rgb(30,178,15)',
        '&:hover':{
            backgroundColor: 'rgba(30,178,15,0.1)',
        },
    },
    danger: {
        color: 'rgb(215,49,12)',
        '&:hover':{
            backgroundColor: 'rgba(215,49,12,0.1)',
        },
    },
    default: {
        color: COLOR_APP,
        '&:hover':{
            backgroundColor: COLOR_APP_HOVER,
        },
    },
    gray: {
        color: 'rgb(213,213,213)',
        '&:hover':{
            backgroundColor: 'rgba(213,213,213,0.1)',
        },
    },
    warning: {
        color: 'rgb(255,195,0)',
        '&:hover':{
            backgroundColor: 'rgba(255,195,0,0.1)',
        },
    },
    icon: {
        marginRight: '5px'
    }
})

export default {styles}