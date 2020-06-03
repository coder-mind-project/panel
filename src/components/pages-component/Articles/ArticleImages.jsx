import React, { Component } from 'react'
import { Box, Container, Grid,
        Typography, Icon, Tooltip, Divider } from '@material-ui/core'

import axios from 'axios'
import { Link } from 'react-router-dom'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { callToast } from '../../../redux/toast/toastActions'
import { success, error, info } from '../../../config/toasts'

import { defineErrorMsg } from '../../../config/backend'

import SmallImgDefault from '../../../assets/img_not_found_512x512.png'
import MediumImgDefault from '../../../assets/img_not_found_768.png'
import BigImgDefault from '../../../assets/img_not_found_1080.png'

import CustomButton from '../../Buttons/Button'

import './css/ArticleImages.css'

class ArticleImages extends Component {

    state = {
        smallImgDirectory: '',
        mediumImg: null,
        mediumImgDirectory: '',
        bigImg: null,
        bigImgDirectory: '',

        sending: false,
    }

    toogleSending(){
        this.setState({sending: !this.state.sending})
    }

    sendFile = async (photo, path) => {

        /* Realiza o envio da imagem */

        /*
            - Ocorre a verificação do tipo de imagem a ser enviada
            - Após verifica se há imagem a enviar
            - Com isso é criado um form data e também e configurado o header
            necessario para o êxito do envio da imagem
            - Assim a imagem é enviada
        */

        const img = photo.target.files[0]

        //Verifica o tipo de imagem, aceitando apenas bigImg ou smallImg
        if(path !== 'bigImg' && path !== 'smallImg' && path !== 'mediumImg')
        return this.props.callToast(error('Ocorreu um erro desconhecido, se persistir reporte'))

        //Verifica se há imagem
        if(!img)
        return this.props.callToast(info('Selecione uma imagem'))

        //Obtém se o ID do artigo e a imagem selecionada
        const id = this.props.article._id

        /*  Configuração do formData para persistencia da imagem
            Adicionando a imagem e também o id do artigo
            OBS: O campo 'chave' da imagem deverá ser igual ao Atributo
            'name' da tag <img>
        */
        const formData = new FormData()
        await formData.append(path, img)

        /*  Definição do campo de diretorio
            (Este campo é referido da URL pública que será pego a
            imagem do backend para visualização) a ser persistido a imagem
            e o método de requisição. [post para smallImg e put para bigImg]
        */

        let directory = ''
        let method = ''

        switch(path){
            case 'smallImg':{
                directory = 'smallImgDirectory'
                method = 'post'
                break
            }
            case 'mediumImg':{
                directory = 'mediumImgDirectory'
                method = 'patch'
                break
            }
            case 'bigImg':{
                directory = 'bigImgDirectory'
                method = 'put'
                break
            }
            default: {
                directory = null
            }
        }

        /*  Define a altura da imagem em pixels pelo tipo do path
            [1080p para bigImg e 512p para smallImg]
        */
        const size = path === 'smallImg' ? 512 : 1080

        /*
            Configuração do header para a requisição.
            (Pré requisito do multer[API backend para envio de arquivos])
        */
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }

        const url = `/articles/img/${id}?path=${path}&size=${size}`
        await this.toogleSending()
        await axios[method](url, formData, config).then( res => {
            this.props.callToast(success('Operação realizada com sucesso'))
            /*  Definição do diretório para visualização da imagem após exito
                do envio e remoção da imagem do campo Input
            */
            this.setState({
                [directory]: `/${res.data}`,
            })

        }).catch( async err => {
            const msg = await defineErrorMsg(err)
            this.props.callToast(error(msg))
        })

        this.toogleSending()
    }

    removeFile = (state, path) => event => {

        /* Realiza a remoção da imagem */

        /*  Verificação para caso de ocorrer tentativa de remoção de imagem
            inexistente
        */
        if(!state.smallImgDirectory && path === 'smallImg') return
        if(!state.mediumImgDirectory && path === 'mediumImg') return
        if(!state.bigImgDirectory && path === 'bigImg') return

        const option = window.confirm('Tem certeza que deseja remover esta imagem?')

        if(option){
            const id = this.props.article._id
            const url = `/articles/img/${id}?path=${path}`
            axios.delete(url).then(() => {
                this.props.callToast(success('Operação realizada com sucesso'))
                /*  Definição do campo de diretorio
                    (Este campo é referido da URL pública que será pego a
                    imagem do backend para visualização) e retirada de visualização
                    da imagem.
                */

                const directory = `${path}Directory`

                this.setState({
                    [directory]: ''
                })
            }).catch(async err => {
                const msg = await defineErrorMsg(err)
                this.props.callToast(error(msg))
            })
        }
    }

    changeFile = (img, path) => {
        /*  Altera a imagem a cada confirmação de escolha dentro
            do input tipo file
        */
        if(path !== 'smallImg' && path !== 'bigImg' && path !== 'mediumImg')
        return this.props.callToast(info('Ocorreu um erro ao selecionar a imagem, se persistir reporte'))

        this.setState({[path]: img.target.files[0]})
    }

    async componentDidMount(){
        const article = this.props.article
        if(!article) return this.props.callToast(error('Ocorreu um erro ao recuperar as informações do artigo, se persistir reporte'))

        /* Disponibiliza as imagens definidas do artigo caso estejam definidas */
        await this.setState({
            smallImgDirectory: article.smallImg ? `/${article.smallImg}` : '',
            mediumImgDirectory: article.mediumImg ? `/${article.mediumImg}` : '',
            bigImgDirectory: article.bigImg ? `/${article.bigImg}` : ''
        })

    }


    render() {
        return (
            <Container>
                { this.props.article._id && <Container className="content">
                    <Box mb={3} mt={3} display="flex" flexDirection="column">
                        <Box display="flex" alignItems="center">
                            <Icon fontSize="large">image</Icon>
                            <Typography variant="h5" component="h2">
                                Imagens do artigo
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="caption" component="small">
                                Defina as imagens deste artigo, <strong>para remover uma imagem desejada basta clicar em cima da opção desejada</strong>.
                            </Typography>
                        </Box>
                    </Box>
                    <Grid item xs={12} className="bigImgSection">
                            <Grid item xs={12} sm={6} md={4}>
                                <Tooltip title={this.state.smallImgDirectory ? "Remover Imagem" : ""} placement="right-start">
                                    <figure className={this.state.smallImgDirectory ? "img" : ""} onClick={this.removeFile(this.state, 'smallImg')}>
                                        <img src={this.state.smallImgDirectory ? this.state.smallImgDirectory : SmallImgDefault} alt="Logo do artigo" width="100%"></img>
                                        <figcaption className="imgDescription">Logo do artigo - Use imagens quadradas, exemplo: 256x256, 512x512</figcaption>
                                    </figure>
                                </Tooltip>
                            </Grid>
                            <Grid item xs={12} sm={6} md={8}>
                                <Box width="100%" mt={1}>
                                    <label className="fakeButton">
                                        <Icon>
                                            photo
                                        </Icon>
                                        {this.state.sending ?
                                            'Enviando...' : 'Alterar imagem'
                                        }
                                        <input type="file" name="smallImg" id="small_img_article"
                                            onChange={(photo) => this.sendFile(photo, 'smallImg')}
                                            className="profile_photo_input"
                                            />
                                    </label>
                                    {/* <Box className="formGroupWithSmallImg">
                                        <TextField type="file" className="inputImg" name="smallImg" id="small_img_article" helperText="Prefire imagens quadráticas e com resolução por volta de 256px" onChange={(file) => this.changeFile(file, 'smallImg')}/>
                                        <CustomBaseButton type="submit" class="success" icon="save" />
                                    </Box> */}
                                </Box>
                            </Grid>
                        </Grid>
                    <Divider />
                        <Grid item xs={12} className="mediumImg">
                            <Grid item xs={12}>
                                <Tooltip title={this.state.mediumImgDirectory ? "Remover Imagem" : ""} placement="right-start">
                                    <figure className={this.state.mediumImgDirectory ? "img" : ""} onClick={this.removeFile(this.state, 'mediumImg')}>
                                        <img src={this.state.mediumImgDirectory ? this.state.mediumImgDirectory : MediumImgDefault} alt="Logo do artigo" width="100%"></img>
                                        <figcaption className="imgDescription">Aparece em 'artigos relacionados' - Imagens retangulares, exemplo:  1360 x 768 ou semelhante</figcaption>
                                    </figure>
                                </Tooltip>
                            </Grid>
                            <Grid item xs={12}>
                                <Box width="100%" mt={1}>
                                    <label className="fakeButton">
                                        <Icon>
                                            photo
                                        </Icon>
                                        {this.state.sending ?
                                            'Enviando...' : 'Alterar imagem'
                                        }
                                        <input type="file" name="mediumImg" id="medium_img_article"
                                            onChange={(photo) => this.sendFile(photo, 'mediumImg')}
                                            className="profile_photo_input"
                                            />
                                    </label>
                                </Box>
                            </Grid>
                        </Grid>
                    <Divider />
                        <Grid item xs={12} className="bigImgSection">
                            <Grid item xs={12}>
                                <Tooltip title={this.state.bigImgDirectory ? "Remover Imagem" : ""} placement="right-start">
                                    <figure className={this.state.bigImgDirectory ? "img" : ""} onClick={this.removeFile(this.state, 'bigImg')}>
                                        <img src={this.state.bigImgDirectory ? this.state.bigImgDirectory : BigImgDefault} alt="Cabeçalho do artigo" width="100%"></img>
                                        <figcaption className="figCaption">Cabeçalho do artigo - Prefire imagens ambiente, ou seja, sem foco específico com resolução de aproximadamente 1920 x 1080</figcaption>
                                    </figure>
                                </Tooltip>
                            </Grid>
                            <Grid item xs={12}>
                                <Box width="100%" mt={1}>
                                    <label className="fakeButton">
                                        <Icon>
                                            photo
                                        </Icon>
                                        {this.state.sending ?
                                            'Enviando...' : 'Alterar imagem'
                                        }
                                        <input type="file" name="bigImg" id="small_img_article"
                                            onChange={(photo) => this.sendFile(photo, 'bigImg')}
                                            className="profile_photo_input"
                                            />
                                    </label>
                                </Box>
                            </Grid>
                        </Grid>
                    <Grid item xs={12} className="footList formGroup">
                        <Link to="/articles" className="linkRouter linkButton"><CustomButton color="default" text="Voltar" icon="exit_to_app" /></Link>
                    </Grid>
                </Container>}
                {!this.props.article._id &&
                    <Container>
                        <Grid item xs={12}>
                            <Box m={5} p={5} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                                <Typography variant="body1" component="p">
                                    Ops, infelizmente só é possível adicionar imagens a artigos ja cadastrados.
                                </Typography>
                                <Typography variant="body1" component="p">
                                    Caso esteja criando um, salve as alterações e depois volte aqui para adicioná-las.
                                </Typography>
                            </Box>
                        </Grid>
                    </Container>
                }
            </Container>
        );
    }
}

const mapStateToProps = state => ({toast: state.config})
const mapDispatchToProps = dispatch => bindActionCreators({callToast: callToast }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ArticleImages)
