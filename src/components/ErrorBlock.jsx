import React, { Component } from 'react'
import {Grid, Box, Paper} from '@material-ui/core'

import TiredRobot from '../assets/tired_robot_by_vonholdt.jpg'

class ErrorBlock extends Component {
    render() { 
        return ( 
            <Paper> 
                <Grid item xs={12} className="comment-content">
                    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
                            <img src={TiredRobot} alt="Erro de sistema" className="img-error" />
                            <p>Ops, ocorreu um erro ao carregar as informações. É razoável recarregar a página.</p>
                    </Box>
                </Grid>
            </Paper>
        )
    }
}

export default ErrorBlock