// .not-found-area{
//     display: flex;
//     justify-content: center;
//     align-items: center;
    
// }

// .not-found-area-xs{
//     display: none;
// }

// .not-found-area{
//     display: none;
// }

// .not-found-area-xs{
//     display: flex;
//     flex-direction: column;
//     justify-content: center;
//     align-items: center;
// }

export const styles = theme => ({
    notFoundArea: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px',
    },
    notFoundAreaXs: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px',
    },
    notFoundMsg:{
        textAlign: 'center',
    },
    tiredRobot:{
        width: '300px'
    },
    tiredRobotXs:{
        width: '100%'
    }
})

export default {styles}