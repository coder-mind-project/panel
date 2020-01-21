import React, { Component } from 'react'
import { Box } from '@material-ui/core'

import CustomButton from '../../Button.jsx'

import { connect } from 'react-redux'
import { setUser } from '../../../redux/userActions'
import { bindActionCreators } from 'redux'

import ChangeMyPassoword from '../../Modals/Users/ChangeMyPassword.jsx'
import RemoveAccount from '../../Modals/Users/RemoveAccount.jsx'

import '../../../pages/css/defaultPage.css'

class Configurations extends Component {
    state = { 
        user: {
            _id: null,
            password: '',
        },
        removing: false,
        changePassword: false,
        removeAccount: false
    }

    handleChange = attr =>  async event => {
        const value = event.target.value
        const user = this.state.user
        await this.setState({user: {...user, [attr]: value}})
    }

    toogleRemoveAccount(){
        this.setState({removeAccount: !this.state.removeAccount})
    }

    toogleChangePassword(){
        this.setState({changePassword: !this.state.changePassword})
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
            <Box display="flex" flexWrap="wrap" alignItems="baseline">
                <Box className="formGroup">
                    <Box m={1}>
                        <h4>Excluir minha conta</h4>
                        <small>Remova sua conta para acesso a plataforma.</small>
                    </Box>
                    <Box m={1} mt={3}>
                        <CustomButton color="danger" variant="outlined" icon="delete_forever"
                            iconSize="small" text="Excluir"
                            onClick={() => this.toogleRemoveAccount()} 
                        />
                    </Box>
                </Box>
                <Box className="formGroup">
                    <Box m={1}>
                        <h4>Alterar minha senha</h4>
                        <small>Altere sua senha para acesso a plataforma.</small>
                    </Box>
                    <Box m={1} mt={3}>
                        <CustomButton color="primary" variant="outlined" icon="refresh"
                            iconSize="small" text="Alterar"
                            onClick={() => this.toogleChangePassword()} 
                        />
                    </Box>
                </Box>
                { this.state.changePassword && <ChangeMyPassoword closeDialog={() => this.toogleChangePassword()} user={this.props.user}/>}
                { this.state.removeAccount && <RemoveAccount closeDialog={() => this.toogleRemoveAccount()} user={this.props.user}/>}
            </Box>
        );
    }
}

const mapStateToProps = state => ({user: state.user})
const mapDispatchToProps = dispatch => bindActionCreators({setUser}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Configurations);