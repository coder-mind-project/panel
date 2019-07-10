import React, {Component} from 'react'
import {Container} from '@material-ui/core'
import {connect} from 'react-redux'


class Stats extends Component{
    
    state = {
        text: ''
    }

    // changeFile = (file) => {
    //     this.setState({file: file.target.files[0]})
    // }

    // sendFile = (state) => async event => {
    //     event.preventDefault()
    //     const id = 123
    //     const url = `${backendUrl}/article/img/${id}`
    //     const config = {
    //         headers: {
    //             'content-type': 'multipart/form-data' 
    //         }
    //     }

    //     const formData = new FormData()
    //     await formData.append('smallImg', state.file) 

    //     await axios.post(url, formData, config).then(() => {
    //         console.log('enviado com sucesso')
    //     }).catch((error) => console.log(error))

    // }


    // componentDidMount(){
    //     const id = 123
    //     const testUrl = `${backendUrl}/article/img/${id}`
        
    //     axios.get(testUrl).then( async res => {
    //         await this.setState({directory: res.data.replace('public', `${backendUrl}/files`)})
    //     })
    // }
    render(){
        
        return(
            <Container>
                <h1>Digite seu texto</h1>
            </Container>
        )
    }
}

const mapStateToProps = state => ({user: state.user})

export default connect(mapStateToProps)(Stats)