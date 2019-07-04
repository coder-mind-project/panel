import React, { Component } from 'react'
import {Box, TextField, Container, Grid,
        Typography, Icon, Tooltip} from '@material-ui/core'
import './ArticleImages.css'

import {Link} from 'react-router-dom'
import SmallLogoDefault from '../assets/HPArticleThumb.png'
import axios from 'axios'
import {backendUrl} from '../config/backend'
import {ToastContainer, toast} from 'react-toastify'
import CustomBaseButton from './ButtonBase.jsx'
import CustomButton from './Button.jsx'
const INITIAL_STATE = {
    smallImg: null,
    smallImgDirectory: ''
}

class ArticleImages extends Component {
    

    
    state = INITIAL_STATE

    sendFile = (state) => async event => {
        event.preventDefault()

        if(!state.smallImg) return toast.info((<div className="centerInline"><Icon className="marginRight">warning</Icon>Selecione uma imagem</div>), {autoClose: 2000, closeOnClick: true}) 

        const id = this.props.idArticle
        const url = `${backendUrl}/article/img/${id}`
        const config = {
            headers: {
                'content-type': 'multipart/form-data' 
            }
        }

        const formData = new FormData()
        await formData.append('smallImg', state.smallImg) 
        await formData.append('idArticle', id) 

        await axios.post(url, formData, config).then(() => {
            toast.success((<div className="centerInline"><Icon className="marginRight">done</Icon>Operação realizada com sucesso</div>), {autoClose: 2000, closeOnClick: true})
            this.setState(INITIAL_STATE)
        }).catch((error) => {
            toast.error((<div className="centerInline"><Icon className="marginRight">clear</Icon>{ error.response.data || 'Ocorreu um erro ao enviar a imagem, se persistir reporte!'}</div>), {autoClose: 2000, closeOnClick: true})
        })
        
        this.getImage(id)

    }

    removeFile = state => event => {
        if(!state.smallImgDirectory) return
        
        const option = window.confirm('Tem certeza que deseja remover esta imagem?')

        if(option){
            const id = this.props.idArticle
            const url = `${backendUrl}/article/img/${id}`
            axios.delete(url).then(() => {
                toast.success((<div className="centerInline"><Icon className="marginRight">done</Icon>Operação realizada com sucesso</div>), {autoClose: 2000, closeOnClick: true})
                this.setState(INITIAL_STATE)
            }).catch(error => {
                toast.error((<div className="centerInline"><Icon className="marginRight">clear</Icon>{ error.response.data || 'Ocorreu um erro ao enviar a imagem, se persistir reporte!'}</div>), {autoClose: 2000, closeOnClick: true})
            })
        }
    }

    changeFile = (smallImg) => {
        this.setState({smallImg: smallImg.target.files[0]})
    }

    getImage = async (idArticle) => {
        
        if(this.state.smallImgDirectory) 
        await this.setState({smallImgDirectory: ''})
        
        const url = `${backendUrl}/article/img/${idArticle}`
        
        axios.get(url).then( res => {
            if(res.data){
                this.setState({smallImgDirectory: `${backendUrl}/${res.data}`})
            }
        })
    }

    componentDidMount(){
        const idArticle = this.props.idArticle
        if(!idArticle) return toast.error((<div className="centerInline"><Icon className="marginRight">clear</Icon>Ocorreu um erro ao recuperar as informações do artigo, se persistir reporte!</div>), {autoClose: 2000, closeOnClick: true})
        
        this.getImage(idArticle)

        /* ... */
    }


    render() { 
        return ( 
            <Container className="content">
                <Box mb={3} mt={3} display="flex" flexDirection="column">
                    <Box display="flex" alignItems="center">
                        <Icon fontSize="large">image</Icon>
                        <Typography variant="h5" component="h2">
                            Imagens do artigo
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" component="small">
                            Defina as imagens deste artigo, para remover uma imagem desejada basta clicar em cima da escolhida.
                        </Typography>
                    </Box>
                </Box>
                <ToastContainer />
                <form onSubmit={this.sendFile(this.state)}>
                    <Grid item xs={12} className="smallImgSection">
                        <Tooltip title={this.state.smallImgDirectory ? "Remover Imagem" : ""} placement="right-start">
                            <figure className={this.state.smallImgDirectory ? "img" : ""} onClick={this.removeFile(this.state)}>
                                <img src={this.state.smallImgDirectory ? this.state.smallImgDirectory : SmallLogoDefault} alt="Imagem de logo" width="256"></img>
                                <figcaption className="figCaption">Imagem de Logo</figcaption>
                            </figure>
                        </Tooltip>
                        <Box className="formGroupWithSmallImg">
                            <TextField type="file" className="inputImg" name="smallImg" id="small_img_article" helperText="Prefire imagens quadráticas e com resolução por volta de 256px" onChange={this.changeFile}/>
                            <CustomBaseButton type="submit" class="success" icon="save" />
                        </Box>
                    </Grid>
                    <Grid item xs={12} className="footList formGroup">
                        <Link to="/articles" className="linkRouter linkButton"><CustomButton color="gray" text="Voltar" icon="exit_to_app" /></Link>
                    </Grid>
                </form>
            </Container>
        );
    }
}

export default ArticleImages;