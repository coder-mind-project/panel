import React from 'react'
import { IconButton, makeStyles, Icon, Tooltip } from '@material-ui/core'

import { styles } from './styles/IconButton'

const useStyles = makeStyles(styles)

export default (props) => {

    const classes = useStyles()

    return (
        <Tooltip title={props.tooltip || ''}>
            <IconButton className={classes[props.color] || classes.default}
                    onClick={props.onClick}
                    disabled={props.disabled || false}
                    size={props.size || 'medium'}
                >
                <Icon>
                    {props.icon}
                </Icon>
            </IconButton>
        </Tooltip>
    )
}