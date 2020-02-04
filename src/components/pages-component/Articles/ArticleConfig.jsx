import React, { Component } from 'react'
import { Grid, TextField, Box, Icon, CircularProgress, Divider,
        FormControlLabel, Checkbox, LinearProgress} from '@material-ui/core'
import axios from 'axios'
import { backendUrl, defineErrorMsg } from '../../../config/backend'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setToast } from '../../../redux/toastActions'
import { success, error } from '../../../config/toasts'

import CustomButton from '../../Button.jsx'


import { displayFullDate } from '../../../config/masks'

import './css/ArticleConfig.css'
class ArticleConfig extends Component {

    state = { 
        article: null,
        changing: false,
    }

    toogleChangingState(){
        this.setState({
            changing: !this.state.changing
        })
    }

    remove = async () => {
        /* Usado para remover artigos */

        const op = window.confirm('Tem certeza que deseja remover este artigo?')

        if(!op) return
        
        const id = this.state.article._id

        if(!id) this.props.setToast(error('Artigo não encontrado'))
        
        await this.toogleChangingState()
        
        const url = `${backendUrl}/articles/management/${id}`
        await axios.delete(url).then(() => {
            this.props.setToast(success('Artigo removido com sucesso'))
            setTimeout(() => window.location.href = '/articles', 3000)
        }).catch(async err => {
            const msg = await defineErrorMsg(err)
            this.props.setToast(error(msg))
        })
        
        this.toogleChangingState()
    }
    
    publish = async () => {
        /* Usado para publicar artigos */
        const id = this.state.article._id
        
        if(!id) this.props.setToast(error('Artigo não encontrado'))
        
        await this.toogleChangingState()

        const url = `${backendUrl}/articles/management/${id}?op=publish`
        await axios.patch(url).then( res => {
            this.props.setToast(success('Artigo publicado com sucesso'))
            this.setState({article: res.data})
        }).catch(async err => {
            const msg = await defineErrorMsg(err)
            this.props.setToast(error(msg))
        })

        this.toogleChangingState()
    }

    inactive = async () => {
        /* Usado para inativar artigos */

        const id = this.state.article._id

        if(!id) this.props.setToast(error('Artigo não encontrado'))
        
        await this.toogleChangingState()

        const url = `${backendUrl}/articles/management/${id}?op=inactive`
        await axios.patch(url).then( res => {
            this.props.setToast(success('Artigo inativado com sucesso'))
            this.setState({article: res.data})
        }).catch(async err => {
            const msg = await defineErrorMsg(err)
            this.props.setToast(error(msg))
        })

        this.toogleChangingState()
    }
    
    boost = async () => {
        /* Usado para impulsionar artigos */

        const id = this.state.article._id

        if(!id) this.props.setToast(error('Artigo não encontrado'))
        
        await this.toogleChangingState()

        const url = `${backendUrl}/articles/management/${id}?op=boost`
        await axios.patch(url).then( res => {
            this.props.setToast(success('Artigo impulsionado com sucesso'))
            this.setState({article: res.data})
        }).catch(async err => {
            const msg = await defineErrorMsg(err)
            this.props.setToast(error(msg))
        })

        this.toogleChangingState()
    }
    
    active = async () => {
        /* Usado para reativar artigos */

        const id = this.state.article._id

        if(!id) this.props.setToast(error('Artigo não encontrado'))
    
        await this.toogleChangingState()

        const url = `${backendUrl}/articles/management/${id}?op=active`
        await axios.patch(url).then( res => {
            this.props.setToast(success('Artigo reativado com sucesso'))
            this.setState({article: res.data})
        }).catch(async err => {
            const msg = await defineErrorMsg(err)
            this.props.setToast(error(msg))
        })

        this.toogleChangingState()
    }

    componentDidMount(){
        this.setState({article: this.props.article})  
    }

    render() { 
        return ( 
            <Grid item xs={12} className="config-container">
                { this.state.article && 
                    <Grid item xs={12}>
                        <Grid item xs={12}>
                            <TextField label="Identificação do artigo" margin="dense" fullWidth value={this.state.article._id} disabled/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Artigo" margin="dense" fullWidth value={this.state.article.title} disabled/>
                        </Grid>
                        <Box display="flex" flexWrap="wrap">
                            <Grid item xs={12} md={4}>
                                <TextField label="Autor" margin="dense" value={this.state.article.author.name} disabled /> 
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField label="Criado em" margin="dense" value={displayFullDate(this.state.article.created_at)} disabled /> 
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField label="Publicado em" margin="dense" value={this.state.article.publishAt ? displayFullDate(this.state.article.publishAt) : 'Não publicado'} disabled /> 
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField label="Ultima atualização" margin="dense" value={ this.state.article.updatedAt ? displayFullDate(this.state.article.updatedAt) : 'Nunca atualizado'} disabled /> 
                            </Grid>
                            <Grid item xs={12}>
                                <Box display="flex" alignItems="center" width="100%">
                                    <Box mr={1} display="flex" alignItems="center">
                                        <Icon>history</Icon>
                                    </Box>
                                    <Box display="flex" alignItems="center">
                                        <h3>Status</h3>
                                    </Box>
                                </Box>
                                <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" width="100%">
                                    <FormControlLabel
                                        control={
                                        <Checkbox
                                            checked={Boolean(this.state.article.created_at)}
                                            disabled
                                            value="awaiting"
                                            color="primary"
                                        />
                                        }
                                        label="Criado"
                                    />
                                    <FormControlLabel
                                        control={
                                        <Checkbox
                                            checked={Boolean(this.state.article.published && !!this.state.article.inactivated && !this.state.article.removed)}
                                            disabled
                                            value="awaiting"
                                            color="primary"
                                        />
                                        }
                                        label="Em espera"
                                    />
                                    <FormControlLabel
                                        control={
                                        <Checkbox
                                            checked={Boolean(this.state.article.published)}
                                            disabled
                                            value="publish"
                                            color="primary"
                                        />
                                        }
                                        label="Publicado"
                                    />
                                    <FormControlLabel
                                        control={
                                        <Checkbox
                                            checked={Boolean(this.state.article.boosted)}
                                            disabled
                                            value="boost"
                                            color="primary"
                                        />
                                        }
                                        label="Impulsionado"
                                    />
                                    <FormControlLabel
                                        control={
                                        <Checkbox
                                            checked={Boolean(this.state.article.inactivated)}
                                            disabled
                                            value="inactive"
                                            color="primary"
                                        />
                                        }
                                        label="Inativo"
                                    />
                                    <FormControlLabel
                                        control={
                                        <Checkbox
                                            checked={Boolean(this.state.article.deleted)}
                                            disabled
                                            value="delete"
                                            color="primary"
                                        />
                                        }
                                        label="Removido"
                                    />
                                </Box>
                            </Grid>
                        </Box>
                        <Box width="100%" mt={3}>
                            <Divider />
                        </Box>
                        { this.state.changing && 
                            <LinearProgress />
                        }
                        <Grid item xs={12} className="config-bar-actions">
                            <Box display="flex" alignItems="center" width="100%">
                                <Box mr={1} display="flex" alignItems="center">
                                    <Icon>settings</Icon>
                                </Box>
                                <Box display="flex" alignItems="center">
                                    <h3>Ações</h3>
                                </Box>
                            </Box>
                            { !this.state.article.published &&
                                <Grid item xs={12} md={3}>
                                    <CustomButton text="Publicar" disabled={this.state.changing} icon="publish" color="success" onClick={this.publish}/>
                                </Grid>
                            } 
                            { this.state.article.published && !this.state.article.inactivated && 
                                <Grid item xs={12} md={3}>
                                    <CustomButton text="Inativar" disabled={this.state.changing} icon="block" color="gray" onClick={this.inactive}/>
                                </Grid>
                            }
                            { this.state.article.published && this.state.article.inactivated &&  
                                <Grid item xs={12} md={3}>
                                    <CustomButton text="Reativar" disabled={this.state.changing} icon="restore" color="warning" onClick={this.active}/>
                                </Grid>
                            }
                            <Grid item xs={12} md={3}>
                                <CustomButton text="Impulsionar" disabled={this.state.changing} icon="share" color="default" onClick={this.boost}/>
                            </Grid> 
                            <Grid item xs={12} md={3}>
                                <CustomButton text="Remover" disabled={this.state.changing} icon="delete_forever" color="danger" onClick={this.remove}/>
                            </Grid> 
                        </Grid>
                    </Grid>
                }
                { !this.state.article &&
                    <Grid item xs={12}>
                        <Box width="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                            <CircularProgress />
                            <p>Carregando, por favor aguarde...</p>
                        </Box>
                    </Grid>  
                }
            </Grid>
        )
    }
}

const mapStateToProps = state => ({toast: state.config})
const mapDispatchToProps = dispatch => bindActionCreators({setToast}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ArticleConfig)