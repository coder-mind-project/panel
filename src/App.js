import React from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import {makeStyles} from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'

//Components imports
import Menu from './components/Menu'
import Users from './pages/Users'
import User from './pages/User'
import Articles from './pages/Articles'
import Article from './pages/Article'
import Stats from './pages/Stats'

const useStyles = makeStyles(theme => ({
  page: {
    height: '100vh',
  },
  body: {
    marginTop: 50,
    padding: 15
  },
}))


export default () => {
  const classes = useStyles()  

    return (
      <Container className={classes.page}>
        <Router>
          <Menu/>
          <Container className={classes.body}>
            <Route path="/users" component={Users}></Route>
            <Route path="/user" component={User}></Route>
            <Route path="/articles" component={Articles}></Route>
            <Route path="/article" component={Article}></Route>
            <Route path="/stats" component={Stats}></Route>
          </Container>
        </Router>
      </Container>
      )
  }