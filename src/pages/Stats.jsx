import React, {Component} from 'react'
import {Container} from '@material-ui/core'
import {connect} from 'react-redux'

import axios from 'axios'
import {backendUrl} from '../config/backend'

class Stats extends Component{
    
    state = {
        file: null,
        directory: ''
    }

    changeFile = (file) => {
        this.setState({file: file.target.files[0]})
    }

    sendFile = (state) => async event => {
        event.preventDefault()
        const id = 123
        const url = `${backendUrl}/article/img/${id}`
        const config = {
            headers: {
                'content-type': 'multipart/form-data' 
            }
        }

        const formData = new FormData()
        await formData.append('smallImg', state.file) 

        await axios.post(url, formData, config).then(() => {
            console.log('enviado com sucesso')
        }).catch((error) => console.log(error))

    }


    componentDidMount(){
        const id = 123
        const testUrl = `${backendUrl}/article/img/${id}`
        
        axios.get(testUrl).then( async res => {
            await this.setState({directory: res.data.replace('public', `${backendUrl}/files`)})
        })
    }


    render(){
        return(
            <Container>
                <h1>Aqui em baixo tens um formulario</h1>
                <form onSubmit={this.sendFile(this.state)}>
                    <input type='file' name='smallImg' id='smallImg' onChange={this.changeFile}/>
                    <button type="submit">Enviar</button>
                </form>

                <h1>Aqui terás uma imagem</h1>
                <img src={this.state.directory} alt="Imagem legal" />
            </Container>
        )
    }
}

const mapStateToProps = state => ({user: state.user})

export default connect(mapStateToProps)(Stats)