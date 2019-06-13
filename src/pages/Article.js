import React from 'react'
import {Link} from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
export default () => {
    return(
        <Container>
            <Typography variant="h2">Artigo</Typography>
            <Typography variant="subtitle1">Descrição do artigo</Typography>

            <Link to="/articles">Voltar</Link>
        </Container>
    )
}