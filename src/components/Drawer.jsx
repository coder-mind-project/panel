import React from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'

import {makeStyles} from '@material-ui/core/styles'

const useStyles = makeStyles( () => ({
    list: {
        width: 250
    }
}))


export default (props) => {
        const classes = useStyles()

        const [state, setState] = React.useState({
            drawerMenu: props.view
        })

        const toogleDrawer = (display) =>{
            setState({
                drawerMenu: display ? display : !state.drawerMenu
            })
        }

        return (
            <Drawer open={state.drawerMenu} onClose={toogleDrawer(false)}>
                <div className={classes.list}>
                    <List>
                        <ListItem button key={'Artigos'}></ListItem>
                        <ListItem button key={'Usuários'}></ListItem>
                        <ListItem button key={'Estatísticas'}></ListItem>
                    </List>
                </div>
            </Drawer>
        )
}