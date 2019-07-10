import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import { Container } from '@material-ui/core'

//Requests imports
import axios from 'axios'
import { backendUrl } from './config/backend'

//Redux imports
import { connect } from 'react-redux'
import { setUser } from './redux/userActions'
import { setError } from './redux/errorActions'
import { bindActionCreators } from 'redux'

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
import Error from './pages/Error.jsx'

//Css imports
import './index.css'
import 'react-toastify/dist/ReactToastify.css'

var user = JSON.parse(localStorage.getItem('user'))
class App extends Component {

    
    validateToken = () => {
      if(user){
        const url = `${backendUrl}/validate_token`
        axios.post(url, user).then(res => {
          if(res.data._id){
            this.props.setUser(res.data)
          }
          else{
            localStorage.removeItem('user')
            this.props.setUser(null)
          }
        }).catch(() => {
          this.props.setError(true)
        })
      }  
    }
  
    componentDidMount(){
        this.validateToken()
    }

    render(){
      return (
        <Container className="page">
          <Router>
            <Menu/>
            <Container>
              {user ? '' : <Redirect to="/auth"/> }
              {this.props.error && 
                <Redirect to="/error"/>
              }
              <Route path="/auth" component={Auth}/>
              <Route path="/users" component={Users}/>
              <Route path="/user" component={User}/>
              <Route path="/edit-user/:id" component={User}/>
              <Route path="/articles" component={Articles}/>
              <Route path="/article" component={Article}/>
              <Route path="/edit-article/:id" component={Article}/>
              <Route path="/stats" component={Stats}/>
              <Route path="/management" component={Management}/>
              <Route path="/theme" component={Theme}/>
              <Route path="/edit-theme/:id" component={Theme}/>
              <Route path="/themes" component={Themes}/>
              <Route path="/categories" component={Categories}/>
              <Route path="/category" component={Category}/>
              <Route path="/edit-category/:id" component={Category}/>
              <Route path="/error" component={Error}/>
            </Container>
          </Router>
        </Container>
      )
    }
  }


const mapStateToProps = state => ({user: state.user, error: state.error})
const mapDispatchToProps = dispatch => bindActionCreators({setUser, setError}, dispatch)


export default connect(mapStateToProps, mapDispatchToProps)(App)