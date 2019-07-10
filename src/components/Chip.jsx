import React from 'react'
import { Chip, makeStyles, Icon } from '@material-ui/core'

import { styles } from './styles/Chip'

const useStyles = makeStyles(styles)
export default (props) => {
    const classes = useStyles()

    return (
        <Chip className={classes[props.color] || classes.default}
            size={props.size || 'medium'}
            label={
                (<span className={classes.chipContent}>
                    <Icon fontSize={props.sizeIcon || 'default'}>
                        {props.icon}
                    </Icon>
                    {props.text}
                </span>)
            }
            variant={props.variant || 'default'}
        />
    )
}