import React from 'react'

import { Snackbar, Slide, makeStyles, useMediaQuery } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

import { styles } from './styles/Toast'

const useStyles = makeStyles(styles)

export default props => {

    const classes = useStyles()

    const matches = useMediaQuery('(max-width: 565px)')
    

    const anchorOrigin = {vertical: 'top', horizontal: matches ? 'center' : 'right'}
    const autoHideDuration = props.hideTime || 3000
    const severity = props.color || 'success'
    const text = props.text || ''
    const variant = 'filled'

    const closeToast = () => {
        props.closeToast()
    }

    return (
        <div>
            { props.show && <Slide in={true} className={classes.toast}>
                <Snackbar anchorOrigin={anchorOrigin} open={true} autoHideDuration={autoHideDuration} onClose={() => closeToast()}>
                    <Alert onClose={() => closeToast()} severity={severity} variant={variant}>
                        {text}
                    </Alert>
                </Snackbar>
            </Slide>}
        </div>
    )
}