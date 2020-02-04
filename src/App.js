import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'
import { Grid, Fade } from '@material-ui/core'

import Loading from './assets/loading.gif'

//Requests imports
import axios from 'axios'
import { backendUrl } from './config/backend'

//Redux imports
import { connect } from 'react-redux'
import { setUser } from './redux/userActions'
import { setError } from './redux/errorActions'
import { setMenu } from './redux/menuActions'
import { setToast } from './redux/toastActions'
import { bindActionCreators } from 'redux'

//Components imports
import Menu from './components/menu-application/Menu.jsx'
import Toast from './components/Toast.jsx'

//Pages imports
import Users from './pages/users-section/Users.jsx'
import User from './pages/users-section/User.jsx'
import Articles from './pages/articles-section/Articles.jsx'
import Article from './pages/articles-section/Article.jsx'
import Stats from './pages/statistics-section/Stats.jsx'
import Auth from './pages/auth-section/Auth.jsx'
import Management from './pages/managements-section/Management.jsx'
import Theme from './pages/managements-section/Themes/Theme.jsx'
import Themes from './pages/managements-section/Themes/Themes.jsx'
import Categories from './pages/managements-section/Categories/Categories.jsx'
import Category from './pages/managements-section/Categories/Category.jsx'
import Error from './pages/error-presentation/Error.jsx'
import MyAccount from './pages/users-section/MyAccount.jsx'
import Comments from './pages/comments-section/Comments.jsx'
import Comment from './pages/comments-section/Comment.jsx'
import RedeemAccount from './pages/auth-section/RedeemAccount.jsx'
import Ticket from './pages/tickets-section/Ticket.jsx'
import ConfirmEmail from './pages/auth-section/ConfirmEmail.jsx'
import RemoveAccount from './pages/auth-section/RemoveAccount.jsx'
import Tickets from './pages/tickets-section/Tickets.jsx'


//Css imports
import './index.css'

var user = JSON.parse(localStorage.getItem('user'))

class App extends Component {

    constructor(props){
      super(props)
      
      this.state = {
        redirectTo: '',
        validatingToken: true,
        path: '',
      }
    }


    acceptableRoutes = [
      '/auth',
      '/redeem-account',
      '/ticket',
      '/confirm-email',
      '/remove-account'
    ] //Rotas aceitáveis sem necessidade de autenticação

    validateToken = async () => {
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

    validateRoutes(){
      let top = 0

      for (let i = 0; i < this.acceptableRoutes.length; i++) {
        if(this.acceptableRoutes[i] !== this.state.path) top++
      }

      return Boolean(top === this.acceptableRoutes.length)
    }

    getPath(){
      const url = window.location.href
      const path = `/${url.split('/')[3].split('?')[0]}`
      return path
    }

    closeToast(){
      const toast = {
        type: 'success',
        msg: '',
        display: false
      }

      this.props.setToast(toast)
    }

    componentDidMount(){
      const path = this.getPath()
      this.setState({path})
      this.validateToken()
    }

    render(){
      return (
        <div className="page">
          { !this.state.validatingToken && 
            <Fade in={!this.state.validatingToken}>
              <Router>
                {this.getPath() !== '/confirm-email' && <Menu/>}
                <Toast show={this.props.toast.display} color={this.props.toast.type} text={this.props.toast.msg} closeToast={() => this.closeToast()} />
                <div>
                  {/* Caso não exista o usuário é redirecionado para tela de autenticação */}
                  {!user && this.validateRoutes() &&
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
                  <Switch>
                      <Route path="/" exact component={Articles}/>
                      <Route path="/auth" exact component={Auth}/>
                      <Route path="/redeem-account" exact component={RedeemAccount}/>
                      <Route path="/remove-account" exact component={RemoveAccount}/>
                      <Route path="/ticket" exact component={Ticket}/>
                      <Route path="/tickets" exact component={Tickets}/>
                      <Route path="/confirm-email" exact component={ConfirmEmail}/>
                      <Route path="/user" exact component={User}/>
                      <Route path="/user/:id" exact component={User}/>
                      <Route path="/users" exact component={Users}/>
                      <Route path="/article" exact component={Article}/>
                      <Route path="/article/:id" exact component={Article}/>
                      <Route path="/articles" exact component={Articles}/>
                      <Route path="/management" exact component={Management}/>
                      <Route path="/theme" exact component={Theme}/>
                      <Route path="/theme/:id" exact component={Theme}/>
                      <Route path="/themes" exact component={Themes}/>
                      <Route path="/category" exact component={Category}/>
                      <Route path="/category/:id" exact component={Category}/>
                      <Route path="/categories" exact component={Categories}/>
                      <Route path="/my-account" exact component={MyAccount}/>
                      <Route path="/comments" exact component={Comments}/>
                      <Route path="/comments/:id" exact component={Comment}/>
                      <Route path="/error" exact component={Error}/>
                      <Route path="/stats" exact component={Stats}/>
                    </Switch>
                </div>
              </Router>
            </Fade>
          }
          { this.state.validatingToken &&
            <Fade in={this.state.validatingToken} >
              <Grid item xs={12} className="loading-app-area">
                <img src={Loading} alt="Carregando..." />
              </Grid>
            </Fade>
          }
        </div>
      )
    }
  }


const mapStateToProps = state => ({user: state.user, error: state.error, menu: state.menu, toast: state.toast})
const mapDispatchToProps = dispatch => bindActionCreators({setUser, setError, setMenu, setToast}, dispatch)


export default connect(mapStateToProps, mapDispatchToProps)(App)