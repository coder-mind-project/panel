export const styles = theme => ({
    shortcutOption: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '1px 1px 3px 1px #ccc',
        padding: '20px 10px',
        '& h4': {
            fontSize: '1rem',
            margin: 0
        },
        minHeight: 110,
    },
    link: {
        textDecoration: 'none',
        color: '#fff',
        '&:hover':{
            transition: '400ms',
            backgroundColor: props => props.hoverBgColor || props.bgColor ,
        },
        margin: props => props.matches ? theme.spacing(1) : '10px 0px',
        minWidth: props => props.matches ? 200 :'100%',
        backgroundColor: props => props.bgColor || '#fff',
    },
})

export default {styles}