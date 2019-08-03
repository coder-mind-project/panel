export const styles = theme => ({
    menu: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: 'rgb(50,50,50)',
    },
    menuLogo: {
        marginRight: '25px',
        color: 'white'
    },
    menuButton: {
        marginRight: theme.spacing(2)
    },
    menuButtonContent: {
        display: 'flex',
        alignItems: 'center',
    },
    iconButtonMenu: {
        marginRight: '10px',
        color: '#f50057'
    },
    link: {
        color: 'inherit',
        textDecoration: 'none'
    },
    menuLink: {
        color: 'inherit',
        textDecoration: 'none',
        padding: 23,
        '&:hover': {
            backgroundColor: 'rgba(200,200,200,.1)'
        }
    },
    buttonLink:{
        color: 'inherit',
        textDecoration: 'none'
    },
    drawer: {
        width: 250,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    drawerButton: {
        display: 'flex',
        justifyContent: 'center',
    },
    logo:{
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 15,
    },
    hide: {
        display: 'none'
    }
})

export default {styles}