const success = (response) => {
    return {
        type: 'success',
        msg: response && typeof response === 'string' ? response : 'Operação realizada com sucesso',
        display: true
    }
}

const error = (response) => {
    return {
        type: 'error',
        msg: response && typeof response === 'string' ? response : 'Ocorreu um erro desconhecido, se persistir reporte!',
        display: true
    }
}

const warning = (response) => {
    return {
        type: 'warning',
        msg: response && typeof response === 'string' ? response : '',
        display: true
    }
}

const info = (response) => {
    return {
        type: 'info',
        msg: response && typeof response === 'string' ? response : '',
        display: true
    }
}

export {info, warning, error, success}