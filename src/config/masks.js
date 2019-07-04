export const cpfMask = (elem) => {
    elem = elem.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g,"$1.$2.$3-$4")
    return elem
}


export const telphoneMask = (elem) => {
    elem = elem.replace(/\D/g,"")
    elem = elem.replace(/^(\d{2})(\d)/g,"($1) $2")
    elem = elem.replace(/(\d)(\d{4})$/,"$1-$2")

    return elem
}

export const celphoneMask = (elem) => {
    elem = elem.replace(/\D/g,"")
    elem = elem.replace(/^(\d{2})(\d)/g,"($1) $2")
    elem = elem.replace(/(\d)(\d{4})$/,"$1-$2")

    return elem
}


export default {cpfMask, telphoneMask, celphoneMask}