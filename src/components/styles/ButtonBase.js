export const styles = theme => ({
    success: {
        backgroundColor: 'rgb(30,178,15)',
        color: '#fff',
        '&:hover':{
            backgroundColor: 'rgb(15,150,7)',
        },
        marginBottom: '10px',
        fontSize: '1rem',
        fontWeight: 100,
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 4
    },
    danger: {
        backgroundColor: 'rgb(215,49,12)',
        color: '#fff',
        '&:hover':{
            backgroundColor: 'rgb(200,38,7)',
        },
        marginBottom: '10px',
        fontSize: '1rem',
        fontWeight: 100,
        padding: 10,
        borderRadius: 4
    },
    default: {
        backgroundColor: 'rgb(17,125,187)',
        color: '#fff',
        '&:hover':{
            backgroundColor: 'rgb(10,115,160)',
        },
        marginBottom: '10px',
        fontSize: '1rem',
        fontWeight: 100,
        padding: 10,
        borderRadius: 4
    },
    defaultMaxWidth: {
        backgroundColor: 'rgb(17,125,187)',
        color: '#fff',
        '&:hover':{
            backgroundColor: 'rgb(10,115,160)',
        },
        marginBottom: '10px',
        fontSize: '1rem',
        fontWeight: 100,
        padding: 10,
        borderRadius: 4,
        width: '100%',
    },
    gray: {
        backgroundColor: 'rgb(213,213,213)',
        color: '#000',
        '&:hover':{
            backgroundColor: 'rgb(200,200,200)',
        },
        marginBottom: '10px',
        fontSize: '1rem',
        fontWeight: 100,
        padding: 10,
        borderRadius: 4
    },
    warning: {
        backgroundColor: 'rgb(255,195,0)',
        color: '#000',
        '&:hover':{
            backgroundColor: 'rgb(235,175,0)',
        },
        marginBottom: '10px',
        fontSize: '1rem',
        fontWeight: 100,
        padding: 10,
        borderRadius: 4
    },
    none:{
        backgroundColor: 'transparent',
        color: '#000',
        '&:hover':{
            backgroundColor: 'transparent',
        },
        marginBottom: '10px',
        fontSize: '1rem',
        fontWeight: 100,
        padding: 10,
        borderRadius: 4
    },
    icon: {
        marginRight: '5px'
    },
})

export default {styles}