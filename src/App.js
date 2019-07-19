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
import { setMenu } from './redux/menuActions'
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
import MyAccount from './pages/MyAccount.jsx'


//Css imports
import './index.css'
import 'react-toastify/dist/ReactToastify.css'

var user = JSON.parse(localStorage.getItem('user'))

class App extends Component {

    state = {
      redirectTo: '',
      validatingToken: false
    }

    validateToken = async () => {
      await this.toogleValidatingToken()
      if(user){
        const url = `${backendUrl}/validate_token`
        await axios.post(url, user).then(async res => {
          if(res.data.user._id){
            this.props.setMenu(true)
            this.props.setUser(res.data)
          }else{
            localStorage.removeItem('user')
            this.props.setUser(null)
            this.props.setMenu(false)
          }
        }).catch(() => {
          this.props.setError(true)
        })
      }  
      this.toogleValidatingToken()
    }

    toogleValidatingToken(){
      this.setState({validatingToken: !this.state.validatingToken})
    }
  
    async componentWillMount(){
      
      if(window.location.pathname === '/' && user)
        this.setState({redirectTo: 'stats'})

      await this.validateToken()
    }

    render(){
      return (
        <Container className="page">
          { !this.state.validatingToken && 
            <Router>
              <Menu/>
              <Container>
                {/* Caso não exista o usuário é redirecionado para tela de autenticação */}
                {!user && 
                  <Redirect to="/auth"/>
                }
                {/* Caso existe um erro é redirecionado para tela de erro */}
                {this.props.error && 
                  <Redirect to="/error"/>
                }
                {/* Caso tente se acessar o diretório / é redirecionado para um determinado diretório */}
                {this.state.redirectTo && 
                  <Redirect to={`/${this.state.redirectTo}`}/>
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
                <Route path="/my-account" component={MyAccount}/>
                <Route path="/error" component={Error}/>
              </Container>
            </Router>
          }
          { this.state.validatingToken &&
            <Container>
              Validando token...
            </Container>
          }
        </Container>
      )
    }
  }


const mapStateToProps = state => ({user: state.user, error: state.error, menu: state.menu})
const mapDispatchToProps = dispatch => bindActionCreators({setUser, setError, setMenu}, dispatch)


export default connect(mapStateToProps, mapDispatchToProps)(App)