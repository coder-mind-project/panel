import React, { Component } from 'react'
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom'
import Container from '@material-ui/core/Container'
import './index.css'
import 'react-toastify/dist/ReactToastify.css'

import axios from 'axios'
import {backendUrl} from './config/backend'

import {connect} from 'react-redux'
import {setUser} from './redux/userActions'
import {bindActionCreators} from 'redux'

//Components imports
import Menu from './components/Menu.jsx'
import Users from './pages/Users.jsx'
import User from './pages/User.jsx'
import Articles from './pages/Articles.jsx'
import Article from './pages/Article.jsx'
import Stats from './pages/Stats.jsx'
import Auth from './pages/Auth.jsx'
import Management from './pages/Management.jsx'
import Theme from './pages/Theme.jsx'
import Themes from './pages/Themes.jsx'
import Categories from './pages/Categories.jsx'
import Category from './pages/Category.jsx'


var user = JSON.parse(localStorage.getItem('user'))
class App extends Component {

    async componentDidMount(){
      if(user){
        const url = `${backendUrl}/validate_token`
        await axios.post(url, user).then(res => {
          this.props.setUser(res.data)
        }).catch(error => {
          localStorage.removeItem('user')
          window.location.href = '/auth'
        })
      }
    }

    render(){
      return (
        <Container className="page">
          <Router>
            {user ? '' : <Redirect to="/auth"/> }
            <Menu/>
            <Container>
              <Route path="/auth" component={Auth}></Route>
              <Route path="/users" component={Users}></Route>
              <Route path="/user" component={User}></Route>
              <Route path="/edit-user/:id" component={User}></Route>
              <Route path="/articles" component={Articles}></Route>
              <Route path="/article" component={Article}></Route>
              <Route path="/edit-article/:id" component={Article}></Route>
              <Route path="/stats" component={Stats}></Route>
              <Route path="/management" component={Management}></Route>
              <Route path="/theme" component={Theme}></Route>
              <Route path="/edit-theme/:id" component={Theme}></Route>
              <Route path="/themes" component={Themes}></Route>
              <Route path="/categories" component={Categories}></Route>
              <Route path="/category" component={Category}></Route>
              <Route path="/edit-category/:id" component={Category}></Route>
            </Container>
          </Router>
        </Container>
      )
    }
  }


const mapStateToProps = state => ({user: state.user})
const mapDispatchToProps = dispatch => bindActionCreators({setUser}, dispatch)


export default connect(mapStateToProps, mapDispatchToProps)(App)