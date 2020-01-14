import axios from 'axios'
const success = resp => resp
const error = async error => {
    
    const user = localStorage.getItem('user')

    if(error && error.response && error.response.status === 401 && user){
        localStorage.removeItem('user')
        window.location = '/'
    }else if(error && error.response && error.response.status === 406 && user){
        setTimeout(() => {
            window.location = '/'
        }, 3000)
        return Promise.reject(error)
    }else{
        return Promise.reject(error)
    }
}


axios.interceptors.response.use(success, error)