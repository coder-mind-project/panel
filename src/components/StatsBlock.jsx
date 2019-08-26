import React from 'react'

import {Box, Paper, Icon, Divider} from '@material-ui/core'

import Loading from '../assets/loading.gif'

import '../pages/css/defaultPage.css'
import '../pages/css/Stats.css'


const StatsBlock = (props) => {

    
    const displayFullDate = (date) => {
        const aux = date.split(' ')
        let dayMonthYear = aux[0].split('-')
        dayMonthYear = `${dayMonthYear[2]}/${dayMonthYear[1]}/${dayMonthYear[0]}`
        
        let hours = aux[1]
    
        return `${dayMonthYear} - ${hours}`
    }

    return (
        <Paper className="stats-block">
            { props.data && props.data.id && !props.loading &&
                <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
                    <Box display="flex">
                        <Box className="stats-block-title-icon">
                            <Icon fontSize="large">{props.icon}</Icon>
                        </Box>
                        <Box>
                            <h4>
                                {props.title}
                            </h4>
                            { props.data.month && <small className="stats-block-description">Referente ao mês {props.data.month}</small>}
                        </Box>
                    </Box>
                    <Divider />
                    <Box className="stats-block-information">
                        <h1>{props.data.count}</h1>
                    </Box>
                        <Box display="flex" justifyContent="center" alignItems="flex-end">
                            { props.data.generated_at && <small className="stats-block-generated-at">Ultima atualização em: {displayFullDate(props.data.generated_at)}</small>}
                        </Box>
                </Box>
            }
            { props.data && !props.data.id && props.loading && 
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <img src={Loading} height="75px" alt="Carregando..." />
                    {props.loadingMsg} 
                </Box>
            }
            {  props.data && !props.data.id && !props.loading && 
                <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
                <Box display="flex">
                    <Box className="stats-block-title-icon">
                        <Icon fontSize="large">{props.icon}</Icon>
                    </Box>
                    <Box>
                        <h4>
                            {props.title}
                        </h4>
                        <small className="stats-block-description">Referente ao mês {new Date().getMonth()+1}</small>
                    </Box>
                </Box>
                <Divider />
                <Box className="stats-block-information">
                    <h1>0</h1>
                </Box>
                    <Box display="flex" justifyContent="center" alignItems="flex-end">
                        <small className="stats-block-generated-at">
                            <Box display="flex" alignItems="center">
                                <Box mr={2}>
                                    <Icon>info</Icon>
                                </Box>
                                As atualizações não são geradas em tempo real.
                            </Box>
                        </small>
                    </Box>
                </Box>
            }
        </Paper>
    )
} 

export default StatsBlock