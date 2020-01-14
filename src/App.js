import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'
import { Grid, Fade } from '@material-ui/core'
import { ToastContainer } from 'react-toastify'
import ScrollToTop from './config/ScrollToTop'

import Loading from './assets/loading.gif'

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
import Comments from './pages/Comments.jsx'
import Comment from './pages/Comment.jsx'
import RedeemAccount from './pages/RedeemAccount.jsx'


//Css imports
import './index.css'
import 'react-toastify/dist/ReactToastify.css'

var user = JSON.parse(localStorage.getItem('user'))

class App extends Component {

    state = {
      redirectTo: '',
      validatingToken: false,
      path: ''
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

    getPath(){
      const url = window.location.href
      const path = `/${url.split('/')[3].split('?')[0]}`
      return path
    }

    componentWillMount(){
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
                <Menu/>
                <ToastContainer/>
                <div>
                  {/* Caso não exista o usuário é redirecionado para tela de autenticação */}
                  {!user && this.state.path !== '/auth' && this.state.path !== '/redeem-account' && 
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
                  <ScrollToTop>
                    <Switch>
                      <Route path="/" exact component={Articles}/>
                      <Route path="/auth" exact component={Auth}/>
                      <Route path="/redeem-account" exact component={RedeemAccount}/>
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
                  </ScrollToTop>
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


const mapStateToProps = state => ({user: state.user, error: state.error, menu: state.menu})
const mapDispatchToProps = dispatch => bindActionCreators({setUser, setError, setMenu}, dispatch)


export default connect(mapStateToProps, mapDispatchToProps)(App)