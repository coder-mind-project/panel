import React from "react"
import { Grid, Card, CardContent, makeStyles, CardHeader,
        Divider, Box } from "@material-ui/core"

import { styles } from "./styles/ShortcutSection"; 

import ShortcutOption from './ShortcutOption.jsx'

const useStyles = makeStyles(styles)

const ShortcutSection = props => {

    const classes = useStyles()

    const colors = {
        themes: {bg:'#EC6F66', bgHover: '#cf635b'},
        sincronizer: {bg: '#348AC7', bgHover: '#2c7ab1'},
        users: {bg: '#8E54E9', bgHover: '#7b46d0'},
        tickets: {bg: '#71B280', bgHover: '#50905f'}
    }

    return (
            <Grid item xs={12}>
                <Card>
                    <CardHeader 
                        title="Precisa de ajuda?"
                        subheader="Selecione o que você precisa dentro de nossa sessão de configurações!"
                        />
                    <CardContent className={classes.cardContent}>
                        <ShortcutOption icon="folder_open" title="Temas & categorias" idRef="#themes" bgColor={colors.themes.bg} hoverBgColor={colors.themes.bgHover}/>
                        <ShortcutOption icon="autorenew" title="Agendador" idRef="#sincronizer" bgColor={colors.sincronizer.bg} hoverBgColor={colors.sincronizer.bgHover}/>
                        <ShortcutOption icon="person" title="Usuários" idRef="#users" bgColor={colors.users.bg} hoverBgColor={colors.users.bgHover}/>
                        <ShortcutOption icon="label" title="Tickets" idRef="#tickets" bgColor={colors.tickets.bg} hoverBgColor={colors.tickets.bgHover}/>
                    </CardContent>
                </Card>
                <Box width="100%" mt={2}><Divider/></Box>
            </Grid>
    )
}


export default ShortcutSection