import axios from 'axios'

export function setUser(user) {

    const storage = JSON.parse(localStorage.getItem('user'))

    const currentToken = storage ? storage.token : null
    const newToken = user.token
    const token = newToken || currentToken 

    if(token){
        axios.defaults.headers.common['Authorization'] = `bearer ${token}`
    }else{
        delete axios.defaults.headers.common['Authorization']
    }
    
    return {
        type: 'SAVE_USER',
        user: user.user
    }
}
