import React, {Component} from 'react'
import {Container} from '@material-ui/core'
import {connect} from 'react-redux'


class Stats extends Component{
    render(){
        return(
            <Container>
                <h1>Home component</h1>
            </Container>
        )
    }
}

const mapStateToProps = state => ({user: state.user})

export default connect(mapStateToProps)(Stats)