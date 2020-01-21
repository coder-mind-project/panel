
export const styles = (theme) => ({
    container: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        width: '100%',
        borderRadius: 10,
        marginBottom: 10,
        padding: 15,
        height: 285,
        backgroundColor: '#fff'
    },
    containerXs: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        width: '100%',
        borderRadius: 10,
        marginBottom: 10,
        minHeight: 280,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 8,
        backgroundColor: '#fff'
    },
    logo: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imgArticle: {
        height: '225px',
        maxWidth: '100%',
    },
    imgArticleXs: {
        height: '225px',
        maxWidth: '100%',
    },
    description: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        height: '100%',
    },
    moreInformation: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: '.8rem',
        color: 'rgba(0,0,0,.54)',
        padding: 10
    },
    author:{
        display: 'flex',
        alignItems: 'center',
        fontSize: '.8rem',
        color: 'rgba(0,0,0,.54)',
    },
    descriptionArea: {
        display: 'flex',
        flexWrap: 'wrap',
        minHeight: 75,
        width: '100%',
    },
    descriptionText: {
        color: 'rgba(0,0,0,.54)',
        fontSize: '0.8rem',
        width: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    info:{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        maxHeight: '130',
        padding: 10,
        width: '100%'
    },
    buttonsOptions: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        padding: 0,
        fontSize: '0.8rem'
    },
    iconButton: {
        marginRight: theme.spacing(1),
    },
    button:{
        fontSize: '0.8rem',
        marginTop: 5
    },
    buttonXsScreen: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15
    }
})

export default {styles}