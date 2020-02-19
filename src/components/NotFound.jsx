import React from 'react'
import { Grid, Paper, Box, useMediaQuery } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {styles} from './styles/NotFound'
import TiredRobot from '../assets/tired_robot_by_vonholdt.jpg'

const useStyles = makeStyles(styles)

const NotFound = (props) => {
    const classes = useStyles()
    const matches = useMediaQuery('(max-width: 850px)')

    return (
        <Paper>
            { !matches &&
                <Grid item xs={12} className={classes.notFoundArea}>
                    {/* <img src={TiredRobot} width="100%" alt="Nenhum artigo encontrado"/> */}
                    <h4>
                        {props.msg}
                    </h4>
                    <Box>
                        <figure>
                            <img src={TiredRobot} className={classes.tiredRobot} alt="Nenhum artigo encontrado"/>
                            <figcaption style={{textAlign: 'center', fontSize: '0.8rem'}}>Tired Robot by Vonholdt</figcaption>
                        </figure>
                    </Box>
                </Grid>
            }
            { matches &&
                <Grid item xs={12} className={classes.notFoundAreaXs}>
                    {/* <img src={TiredRobot} width="100%" alt="Nenhum artigo encontrado"/> */}
                    <Box>
                        <figure>
                            <img src={TiredRobot} className={classes.tiredRobotXs} alt="Nenhum artigo encontrado"/>
                            <figcaption style={{textAlign: 'center', fontSize: '0.8rem'}}>Tired Robot by Vonholdt</figcaption>
                        </figure>
                    </Box>
                    <h4 className={classes.notFoundMsg}>
                        {props.msg}
                    </h4>
                </Grid>
            }
        </Paper>
    )
}

export default NotFound
