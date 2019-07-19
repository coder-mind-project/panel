import axios from 'axios'
const success = resp => resp
const error = async error => {
    
    const user = await localStorage.getItem('user')

    if(error.response.status === 401 && user){
        localStorage.removeItem('user')
        window.location = '/'
    }else{
        return Promise.reject(error)
    }
}


axios.interceptors.response.use(success, error)