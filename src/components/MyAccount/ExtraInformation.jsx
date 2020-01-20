import React, { Component } from 'react'
import { TextField,
    Grid, Icon, InputAdornment, Box, Switch, Divider } from '@material-ui/core'
import { FaTwitterSquare, FaYoutube, FaGithub, FaInstagram } from 'react-icons/fa'

import CustomButton from '../Button.jsx'

import axios from 'axios'
import { backendUrl, defineErrorMsg } from '../../config/backend'

import { toast } from 'react-toastify'

import { connect } from 'react-redux'
import { setUser } from '../../redux/userActions'
import { bindActionCreators } from 'redux'

import {formatCustomURL} from '../../config/masks'

import ReactQuill from 'react-quill'
//import { modules } from '../config/QuillEditor'
import 'react-quill/dist/quill.snow.css'

import '../../pages/css/defaultPage.css'
import './css/MyAccountExtraInformation.css'

class ExtraInformation extends Component {
    state = { 
        user: {
            _id: null,
            instagram: '',
            twitter: '',
            github: '',
            youtube: '',
            occupation: '',
            especiality: '',
            customUrl: '',
            publicProfile: false
        },
        saving: false
    }

    handleChange = (attr, isSwitch = false) => async event => {
        let value = isSwitch ? event.target.checked : event.target.value
        const user = this.state.user
        if(attr === 'customUrl') value = await formatCustomURL(value)
        this.setState({user: {...user, [attr]: value}})
    }

    toogleSaving = () => {
        this.setState({saving: !this.state.saving})
    }

    editorChange = (value, attr) => {
        //Usado para persistir as alterações realizadas no Quill Component
        this.setState({user: {...this.state.user, [attr]: value}})
    }

    save = async () => {

        await this.toogleSaving()

        const url = `${backendUrl}/users/${this.state.user._id}`

        await axios.patch(url, this.state.user).then( () => {
            toast.success((<div className="centerVertical"><Icon className="marginRight">done</Icon>Informações salvas com sucesso</div>), {autoClose: 3000, closeOnClick: true})
        }).catch( async error => {
            const msg = await defineErrorMsg(error)
            toast.error((<div className="centerVertical"><Icon className="marginRight">clear</Icon>{msg}</div>))
        })

        this.toogleSaving()
    }

    getUser = (user) => {
        this.setState({
            user: {
                _id: user._id,
                instagram: user.instagram || '',
                twitter: user.twitter || '',
                github: user.github || '',
                youtube: user.youtube || '',
                occupation: user.occupation || '',
                especiality: user.especiality || '',
                customUrl: user.customUrl || '',
                publicProfile: user.publicProfile
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
            <Grid item xs={12} className="extra_information_content">
                <Grid item xs={12} sm={6} md={3} className="formGroup">
                    <TextField label="Url Personalizada"
                        className="formInput"
                        fullWidth
                        error={false}
                        helperText={(<small><small>Informe uma Url personalizada para acesso público ao seu perfil</small><br/><small>Sua url ficará: {formatCustomURL(this.state.user.customUrl)}</small></small>)}
                        value={this.state.user.customUrl || ''}
                        onChange={this.handleChange('customUrl')}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3} className="formGroup">
                    <label htmlFor="public-profile">Perfil público?</label>
                    <Box display="flex" alignItems="center">
                        <Switch checked={Boolean(this.state.user.publicProfile)} id="public-profile" value={this.state.user.publicProfile} onChange={this.handleChange('publicProfile', true)}></Switch>
                        <small>Marque para deixar seu perfil de autor público na plataforma</small>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Divider/>
                </Grid>
                <Grid item xs={12} sm={6} md={3} className="formGroup">
                    <TextField label="Instragram"
                        className="formInput"
                        fullWidth
                        error={false}
                        helperText={(<small>/<strong>seuUsername</strong></small>)}
                        value={this.state.user.instagram}
                        onChange={this.handleChange('instagram')}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FaInstagram />
                                </InputAdornment>
                            )
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3} className="formGroup">
                    <TextField label="Youtube"
                        className="formInput"
                        fullWidth
                        error={false}
                        helperText={(<small>/channel/<strong>seuCanal</strong></small>)}
                        value={this.state.user.youtube}
                        onChange={this.handleChange('youtube')}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FaYoutube />
                                </InputAdornment>
                            )
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3} className="formGroup">
                    <TextField label="Github"
                        className="formInput"
                        fullWidth
                        error={false}
                        helperText={(<small>/<strong>seuUsername</strong></small>)}
                        value={this.state.user.github}
                        onChange={this.handleChange('github')}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FaGithub />
                                </InputAdornment>
                            )
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3} className="formGroup">
                    <TextField label="Twitter"
                        className="formInput"
                        fullWidth
                        error={false}
                        helperText={(<small>/<strong>seuUsername</strong></small>)}
                        value={this.state.user.twitter}
                        onChange={this.handleChange('twitter')}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FaTwitterSquare />
                                </InputAdornment>
                            )
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box m={1}>
                        <p className="p">Ocupação</p>
                        <ReactQuill value={this.state.user.occupation}
                            onChange={(value) => this.editorChange(value, 'occupation')}
                            className="occupation"
                        />
                        <small>Informe suas atuais atividades</small>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box m={1}>
                        <p className="p">Especialidade</p>
                        <ReactQuill value={this.state.user.especiality} 
                            onChange={(value) => this.editorChange(value, 'especiality')}
                            className="occupation" 
                        />
                        <small>Informe suas especialidades, técnicas e profissionais.</small>
                    </Box>
                </Grid>
                <Box width="100%" display="flex" alignItems="center" justifyContent="flex-end" mt={3}>
                    <CustomButton color="success" icon="done" iconSize="small"
                        text={this.state.saving ? 'Salvando...' : 'Salvar' } onClick={this.save} loading={this.state.saving}
                    />
                </Box>
            </Grid>
        );
    }
}

const mapStateToProps = state => ({user: state.user})
const mapDispatchToProps = dispatch => bindActionCreators({setUser}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ExtraInformation);