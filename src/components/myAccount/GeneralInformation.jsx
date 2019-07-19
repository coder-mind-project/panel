import React, { Component } from 'react'
import { Container, TextField,
    MenuItem, Grid, Icon, Tooltip, Box, CircularProgress } from '@material-ui/core'

import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'

import { cpfMask, telphoneMask, celphoneMask } from '../../config/masks'

import CustomButton from '../Button.jsx'

import axios from 'axios'
import { backendUrl, defineErrorMsg } from '../../config/backend'

import { toast } from 'react-toastify'

import { connect } from 'react-redux'
import { setUser } from '../../redux/userActions'
import { bindActionCreators } from 'redux'

import ImgDefault from '../../assets/img_not_found_512x512.png'

import '../../pages/css/defaultPage.css'

class GeneralInformation extends Component {
    state = { 
        user: {
            _id: null,
            name: '',
            email: '',
            cpf: '',
            gender: '',
            profilePhoto: '',
            birthDate: null,
            telphone: '',
            celphone: '',
            address: '',
            number: '',
            type: ''
        },
        sendingPhoto: false,
        photo: '',
        saving: false
    }

    handleChange = attr =>  async event => {
        const value = event.target.value
        const user = this.state.user
        await this.setState({user: {...user, [attr]: value}})
    }

    handleChangeMaskData = attr => event => {
        if(typeof attr !== 'string') return
        const value = event.target.value
        const user = this.state.user
        switch(attr){
            case 'cpf':{
                this.setState({user: {...user, [attr]: cpfMask(value)}})
                break
            }
            case 'celphone':{
                this.setState({user: {...user, [attr]: celphoneMask(value)}})
                break
            }
            default:{
                this.setState({user: {...user, [attr]: telphoneMask(value)}})
                break
            }
        }
    }

    handleDate = birthDate => {
        const user = this.state.user
        this.setState({
            user: {...user, birthDate}
        })
    }

    toogleSaving = () => {
        this.setState({saving: !this.state.saving})
    }

    save = async () => {

        await this.toogleSaving()

        const url = `${backendUrl}/users/${this.state.user._id}`

        const user = this.state.user 

        await axios.put(url, user).then( () => {
            toast.success((<div className="centerVertical"><Icon className="marginRight">done</Icon>Informações salvas com sucesso</div>), {autoClose: 3000, closeOnClick: true})
            
            this.props.setUser(user)
        }).catch( async error => {
            const msg = await defineErrorMsg(error)
            toast.error((<div className="centerVertical"><Icon className="marginRight">clear</Icon>{msg}</div>))
        })

        this.toogleSaving()
    }

    formatData = async () => {
        const formData = new FormData()
        await formData.append('user', this.state.user)
        if(this.state.photo){
            await formData.append('profilePhoto', this.state.photo)
            const config = {
                headers: {
                    'content-type': 'multipart/form-data' 
                }
            }
            return {formData, config}
        }

        return

    }

    addPhoto = async (photo) => {
        /* Realiza o envio da imagem */

        /* 
            - Ocorre a verificação do tipo de imagem a ser enviada
            - Após verifica se há imagem a enviar
            - Com isso é criado um form data e também e configurado o header 
            necessario para o êxito do envio da imagem
            - Assim a imagem é enviada
        */
        //Verifica se há imagem

        const img = photo.target.files[0]

        if(!img) 
        return toast.info((<div className="centerVertical"><Icon className="marginRight">warning</Icon>Selecione uma imagem</div>), {autoClose: 2000, closeOnClick: true}) 

        //Obtém se o ID do artigo e a imagem selecionada
        const id = this.state.user._id

        /*  Configuração do formData para persistencia da imagem
            Adicionando a imagem e também o id do artigo
            OBS: O campo 'chave' da imagem deverá ser igual ao Atributo
            'name' da tag <img>
        */
        const formData = new FormData()
        await formData.append('profilePhoto', img) 
        await formData.append('idUser', id)

        /*
            Configuração do header para a requisição. 
            (Pré requisito do multer[API backend para envio de arquivos])
        */

        const config = {
            headers: {
                'content-type': 'multipart/form-data' 
            }
        }
    
        const url = `${backendUrl}/users/img/${id}`
        
        await axios.patch(url, formData, config).then( async res => {
            toast.success((<div className="centerVertical"><Icon className="marginRight">done</Icon>Operação realizada com sucesso</div>), {autoClose: 2000, closeOnClick: true})
            /*  Definição do diretório para visualização da imagem após exito
                do envio e remoção da imagem do campo Input
            */

            await this.setState({
                user: {
                    ...this.state.user,
                    profilePhoto: `${backendUrl}/${res.data}`
                },
                photo: null,
                sendingPhoto: false
            })

        }).catch( async error => {
            const msg = await defineErrorMsg(error)
            toast.error((<div className="centerVertical"><Icon className="marginRight">clear</Icon>{msg}</div>))
            this.setState({sendingPhoto: false})
        })

    }

    removePhoto = () => {

        const op = window.confirm('Tem certeza que deseja remover sua foto de perfil?')
        if(!op) return

        const id = this.state.user._id

        const url = `${backendUrl}/users/img/${id}`
        axios.delete(url).then(() => {
            toast.success((<div className="centerVertical"><Icon className="marginRight">done</Icon>Operação realizada com sucesso</div>), {autoClose: 2000, closeOnClick: true})
            this.setState({
                user: {
                    ...this.state.user,
                    profilePhoto: ''
                },
                photo: ''

            })
        }).catch(async error => {
            const msg = await defineErrorMsg(error)
            toast.error((<div className="centerVertical"><Icon className="marginRight">clear</Icon>{msg}</div>))
        })
    }

    async componentDidMount(){
        const user = this.props.user
        if(user){
            await this.setState({
                user: {
                    ...user,
                    profilePhoto: user.profilePhoto ? `${backendUrl}/${user.profilePhoto}` : '',
                    birthDate: user.birthDate || null,
                    address: user.address || '',
                    number: user.number || '',
                    type: user.tagAdmin ? 'admin':'author'
                }
            })
        }
    }

    render() { 
        return ( 
            <Container>
                    <Box xs={12} display="flex" justifyContent="center"
                        alignItems="center" flexWrap="wrap"
                    >
                        <Grid item xs={12} lg={3} className="formGroup">
                            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                                <Tooltip title={this.state.user.profilePhoto ? "Remover Imagem" : ""} 
                                    placement="right-start"
                                >
                                    <figure onClick={this.removePhoto}>
                                        { !this.state.sendingPhoto ? 
                                            <img className={this.state.user.profilePhoto ? "profile_photo" : "profile_photo_not_found"} 
                                                src={this.state.user.profilePhoto ? this.state.user.profilePhoto : ImgDefault}
                                                alt="Foto de perfil" /> : <CircularProgress />
                                            }
                                    </figure>
                                </Tooltip>

                                    {this.state.photo ? 
                                            <Box display="flex" justifyContent="center"
                                                alignItems="center" mb={2}
                                            >
                                                <Icon className="marginRight">done</Icon>Foto selecionada
                                            </Box> : ''
                                    }
                                    <label className="fakeButton">
                                        <Icon>
                                            photo
                                        </Icon>
                                        {this.state.sendingPhoto ?
                                            'Enviando foto...' : 'Alterar foto'
                                        }
                                        <input type="file" name="profilePhoto"
                                            onChange={(photo) => this.addPhoto(photo)}
                                            className="profile_photo_input"
                                            />
                                    </label>
                            </Box>
                        </Grid>
                        <Grid item xs={12} lg={9} className="formGroup">
                            <TextField label="Nome *"
                                className="formInput"
                                error={Boolean(this.state.user.name.length > 50)}
                                helperText={this.state.user.name.length > 50 ? 
                                    "Máximo permitido 50 caracteres" : ""}
                                value={this.state.user.name}
                                onChange={this.handleChange('name')}
                            />
                            <TextField label="E-mail *"
                                className="formInput"
                                value={this.state.user.email}
                                onChange={this.handleChange('email')}
                            />
                            <TextField label="Genero *"
                                className="formInput"
                                value={this.state.user.gender} select
                                onChange={this.handleChange('gender')}
                            >
                                <MenuItem key={'male'} value={'male'}>
                                    Masculino
                                </MenuItem>
                                <MenuItem key={'female'} value={'female'}>
                                    Feminino
                                </MenuItem>
                                <MenuItem key={'undefined'} value={'undefined'}>
                                    Prefere não informar
                                </MenuItem>
                            </TextField>

                            <TextField label="CPF *" className="formInput"
                                value={this.state.user.cpf}
                                onChange={this.handleChangeMaskData('cpf')} 
                                inputProps={{ maxLength: 14 }} 
                            />
                            <TextField label="Número de telefone *"
                                className="formInput"
                                placeholder="Ex: (xx)xxxx-xxxx"
                                value={this.state.user.telphone}
                                onChange={this.handleChangeMaskData('telphone')}
                                inputProps={{ maxLength: 14 }}
                            />
                            <TextField label="Número de celular *"
                                className="formInput"
                                placeholder="Ex: (xx)xxxxx-xxxx"
                                value={this.state.user.celphone}
                                onChange={this.handleChangeMaskData('celphone')}
                                inputProps={{ maxLength: 15 }}
                            />
                            
                            <MuiPickersUtilsProvider utils={MomentUtils}>
                                <KeyboardDatePicker label="Data de nascimento"
                                    clearable cancelLabel="Cancelar"
                                    clearLabel="Limpar"
                                    className="formInput"
                                    value={this.state.user.birthDate}
                                    onChange={this.handleDate}
                                    mask="__/__/____"
                                    maxDate={new Date()}
                                    maxDateMessage="Data acima do permitido"
                                    minDateMessage="Data abaixo do permitido" />
                            </MuiPickersUtilsProvider>
                            <TextField label="Endereço"
                                className="formInput"
                                value={this.state.user.address}
                                onChange={this.handleChange('address')}
                            />
                            <TextField label="Número"
                                type="number"
                                className="formInput"
                                value={this.state.user.number}
                                onChange={this.handleChange('number')}
                            />
                        </Grid>
                    </Box>
                    
                    <Grid item xs={12}>
                        <CustomButton color="success" icon="done" iconSize="small"
                            text={this.state.saving ? 'Salvando...' : 'Salvar' } onClick={this.save} loading={this.state.saving}
                        />
                    </Grid>
            </Container>
        );
    }
}

const mapStateToProps = state => ({user: state.user})
const mapDispatchToProps = dispatch => bindActionCreators({setUser}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(GeneralInformation);