import React, {Component} from 'react'
import {Container} from '@material-ui/core'
import {connect} from 'react-redux'


class Stats extends Component{
    render(){
        return(
            <Container>
                Test
                {/* <Box width="125px" height="100px">
                    <Image src={BrokenRobot} aspectRatio={(16/9)} />
                </Box> */}
            </Container>
        )
    }
}

const mapStateToProps = state => ({user: state.user})

export default connect(mapStateToProps)(Stats)