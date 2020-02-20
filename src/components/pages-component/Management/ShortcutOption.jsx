import React from "react"
import { Grid, Icon, makeStyles, useMediaQuery } from "@material-ui/core"

import { styles } from './styles/ShortcutOption'

const useStyles = makeStyles(styles)

const ShortcutOption = props => {

    const matches = useMediaQuery('(min-width: 565px)')
    const classes = useStyles({matches, ...props})

    const { icon, title, idRef } = {...props}

    return (
        <a href={idRef} className={classes.link}>
            <Grid item xs={12} className={classes.shortcutOption}>
                <Icon fontSize="large">
                    {icon}
                </Icon>
                <h4>{title}</h4>
            </Grid>
        </a>
    )
}

export default ShortcutOption