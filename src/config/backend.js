//Development APIS
//const backendUrl = 'http://localhost:3001'

//Production APIS
const backendUrl = 'https://cm-gestao-v1.allanalves23.top'

const defineErrorMsg = error => {

    let errorMsg = 'Ocorreu um erro desconhecido, se persistir reporte'
            
    if(error.isAxiosError) errorMsg = 'Ops, não conseguimos conectar ao servidor, tente novamente mais tarde!'
    if(error.response && error.response.data) errorMsg = error.response.data

    return errorMsg
}

export {backendUrl, defineErrorMsg}