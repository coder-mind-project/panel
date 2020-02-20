import React from 'react'

import { Box, Typography, Tooltip, IconButton } from "@material-ui/core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCode, faBook } from "@fortawesome/free-solid-svg-icons"

import { connect } from 'react-redux'

import MoreInfo from '../Dialogs/MoreInfo.jsx'

const AboutSystem = props => {

    const [dialog, setDialog] = React.useState(false)

    const openDialog = () => {
        setDialog(true)
    }

    const closeDialog = () => {
        setDialog(false)
    }

    return (
        <Box mr={3}>
            <Tooltip title={(<Typography component="p" variant="body2">{`Olá ${props.user.name}, seu nivel de acesso atual é: ${ props.user.tagAdmin ? 'Administrador' : 'Autor'}`}</Typography>)}>
                <IconButton onClick={openDialog} >
                    <FontAwesomeIcon icon={props.user.tagAdmin ? faCode : faBook} color="#fff"/> 
                </IconButton>
            </Tooltip>
            <MoreInfo opened={dialog} user={props.user} closeDialog={() => closeDialog()}/>
        </Box>
    )
}

const mapStateToProps = state => ({user: state.user})

export default connect(mapStateToProps)(AboutSystem)