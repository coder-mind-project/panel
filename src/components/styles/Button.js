export const styles = (theme) => ({
    success: {
        backgroundColor: 'rgb(30,178,15)',
        color: '#fff',
        '&:hover':{
            backgroundColor: 'rgb(20,158,10)',
        },
        marginBottom: '10px',
        paddingLeft: '10px',
        paddingRight: '10px',
    },
    danger: {
        backgroundColor: 'rgb(215,49,12)',
        color: '#fff',
        '&:hover':{
            backgroundColor: 'rgb(200,38,7)',
        },
        marginBottom: '10px',
        paddingLeft: '10px',
        paddingRight: '10px',
    },
    default: {
        backgroundColor: 'rgb(17,125,187)',
        color: '#fff',
        '&:hover':{
            backgroundColor: 'rgb(10,115,160)',
        },
        marginBottom: '10px',
        paddingLeft: '10px',
        paddingRight: '10px',
    },
    gray: {
        backgroundColor: 'rgb(213,213,213)',
        color: '#000',
        '&:hover':{
            backgroundColor: 'rgb(200,200,200)',
        },
        marginBottom: '10px',
        paddingLeft: '10px',
        paddingRight: '10px',
    },
    warning: {
        backgroundColor: 'rgb(255,195,0)',
        color: '#000',
        '&:hover':{
            backgroundColor: 'rgb(235,175,0)',
        },
        marginBottom: '10px',
        paddingLeft: '10px',
        paddingRight: '10px',
    },
    none:{
        backgroundColor: 'transparent',
        color: '#000',
        '&:hover':{
            backgroundColor: 'transparent',
        },
        marginBottom: '10px',
        paddingLeft: '10px',
        paddingRight: '10px',
    },
    noneNoPadding:{
        backgroundColor: 'transparent',
        color: '#000',
        '&:hover':{
            backgroundColor: 'transparent',
        }
    },
    icon: {
        marginRight: '5px'
    },
    defaultOutlined: {
        backgroundColor: 'transparent',
        border: '1px solid rgba(0,0,0,.23)',
        color: 'rgb(17,125,187)',
        '&:hover':{
            backgroundColor: 'rgba(17,125,187,.15)',
        },
        marginBottom: '10px',
        paddingLeft: '10px',
        paddingRight: '10px',
    },
    noneOutlinedNoPadding: {
        backgroundColor: 'transparent',
        border: '1px solid rgba(0,0,0,.23)',
        color: 'rgba(0,0,0,.85)',
        '&:hover':{
            backgroundColor: 'rgba(0,0,0,.15)',
        },
        marginBottom: '10px',
    }
})

export default {styles}