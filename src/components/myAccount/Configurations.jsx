import React, { Component } from 'react'
import { Grid, Icon, Box } from '@material-ui/core'

import CustomButton from '../Button.jsx'

import axios from 'axios'
import { backendUrl, defineErrorMsg } from '../../config/backend'

import { toast } from 'react-toastify'

import { connect } from 'react-redux'
import { setUser } from '../../redux/userActions'
import { bindActionCreators } from 'redux'

import '../../pages/css/defaultPage.css'

class Configurations extends Component {
    state = { 
        user: {
            _id: null,
            password: '',
        },
        removing: false
    }

    handleChange = attr =>  async event => {
        const value = event.target.value
        const user = this.state.user
        await this.setState({user: {...user, [attr]: value}})
    }

    toogleRemoving = () => {
        this.setState({removing: !this.state.removing})
    }

    remove = async () => {

        await this.toogleRemoving()

        const url = `${backendUrl}/users/${this.state.user._id}`

        await axios.delete(url).then( () => {
            toast.success((<div className="centerVertical"><Icon className="marginRight">done</Icon>Conta removida com sucesso, aguarde alguns segundos... Estamos lhe redirecionando</div>), {autoClose: 5000, closeOnClick: true})
            localStorage.removeItem('user')
            window.location.href = '/'
        }).catch( async error => {
            const msg = await defineErrorMsg(error)
            toast.error((<div className="centerVertical"><Icon className="marginRight">clear</Icon>{msg}</div>))
        })

        this.toogleRemoving()
    }

    getUser = (user) => {
        this.setState({
            user: {
                _id: user._id,
            }
        })
    }

    async componentDidMount(){
        const user = this.props.user
        if(user){
            this.getUser(user)
        }
    }

    render() { 
        return ( 
            <Box display="flex" flexWrap="wrap">
                <Grid item xs={12} className="formGroup">
                    <Box m={1}>
                        <h4>Excluir minha conta</h4>
                        <small>Ao confirmar, a exclusão ainda é possível recuperar sua conta</small>
                    </Box>
                    <Box m={1}>
                        <CustomButton color="danger" variant="outlined" icon="delete_forever"
                            iconSize="small" text={this.state.removing ? 'Excluindo...' : 'Excluir'}
                            onClick={this.remove} loading={this.state.removing} 
                        />
                    </Box>
                </Grid>
            </Box>
        );
    }
}

const mapStateToProps = state => ({user: state.user})
const mapDispatchToProps = dispatch => bindActionCreators({setUser}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Configurations);