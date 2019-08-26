//Development APIS
const backendUrl = 'https://cm-gestao-v1.allanalves23.top'

//Production APIS
//const backendUrl = 'https://cm-gestao-v1.allanalves23.top'

//ipinfo.io API
const ipinfo = 'https://ipinfo.io'
const ipinfoToken = 'eee6292429bd9f'

const defineErrorMsg = error => {

    let errorMsg = 'Ocorreu um erro desconhecido, se persistir reporte'
            
    if(error.isAxiosError) errorMsg = 'Ops, não conseguimos conectar ao servidor, tente novamente mais tarde!'
    if(error.response && error.response.data) errorMsg = error.response.data

    return errorMsg
}

export {backendUrl, defineErrorMsg, ipinfo, ipinfoToken}