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

export const formatCustomURL = (url) => {
    url = url.split(' ').join('-')
    url = url.toLowerCase()
    return url
}

export const displayDate = (date) => {
    if(typeof date === 'string'){
        const aux = date.split('T')
        const aux2 = aux[0].split('-')
        return `${aux2[2]}/${aux2[1]}/${aux2[0]}`
    }else{
        return date
    }
}

export const displayFullDate = (date) => {
    const aux = date.split('T')
    let dayMonthYear = aux[0].split('-')
    dayMonthYear = `${dayMonthYear[2]}/${dayMonthYear[1]}/${dayMonthYear[0]}`
    
    let hours = aux[1].split('.')[0]

    return `${dayMonthYear} - ${hours}`
} 


export default {cpfMask, telphoneMask, celphoneMask, displayFullDate}