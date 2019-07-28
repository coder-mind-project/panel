const fontFamily = {
    fontFamily: 'Quicksand, sans-serif',
}
export const styles = (theme) => ({
    success: {
        ...fontFamily,
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
        ...fontFamily,
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
        ...fontFamily,
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
        ...fontFamily,
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
        ...fontFamily,
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
        ...fontFamily,
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
        ...fontFamily,
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
        ...fontFamily,
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
        ...fontFamily,
        backgroundColor: 'transparent',
        border: '1px solid rgba(0,0,0,.23)',
        color: 'rgba(0,0,0,.85)',
        '&:hover':{
            backgroundColor: 'rgba(0,0,0,.15)',
        },
        marginBottom: '10px',
    },
    pink: {
        ...fontFamily,
        backgroundColor: 'rgb(245, 0, 87);',
        color: '#fff',
        '&:hover':{
            backgroundColor: 'rgb(220, 0, 60);',
        },
        marginBottom: '10px',
        paddingLeft: '10px',
        paddingRight: '10px',
    }
})

export default {styles}