/* eslint-disable no-console */

/**
 * @function
 * @deprecated
 * @description Format a string applying a cpf mask
 * @param {String} elem Element to be formatted
 * @returns {String} A formatted string
 */
export const cpfMask = (elem) => {
  try {
    let aux = elem;
    aux = aux.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4');
    return aux;
  } catch (error) {
    console.error(error);
    return elem;
  }
};

/**
 * @function
 * @description Format a string applying a cellphone number mask
 * @param {String} elem Element to be formatted
 * @returns {String} A formatted string
 */
export const celphoneMask = (elem) => {
  try {
    let aux = elem;
    aux = aux.replace(/\D/g, '');
    aux = aux.replace(/^(\d{2})(\d)/g, '($1) $2');
    aux = aux.replace(/(\d)(\d{4})$/, '$1-$2');

    return aux;
  } catch (error) {
    console.error(error);
    return elem;
  }
};

/**
 * @function
 * @description Format a string to be acceptable in url format
 * @param {String} url String to be formatted
 * @returns {String} A formatted string
 */
export const formatCustomURL = (url) => {
  try {
    let aux = url;
    aux = aux.split(' ').join('-');
    aux = aux.toLowerCase();

    return aux;
  } catch (error) {
    console.error(error);
    return url;
  }
};

/**
 * @function
 * @description Format a simple date (without hours), like MM-DD-YYYY
 * @param {Date | String} date
 * @returns {String} A formatted simple date, like DD/MM/YYYY
 */
export const displayDate = (date) => {
  try {
    if (typeof date === 'string') {
      const aux = date.split('T');
      const aux2 = aux[0].split('-');
      return `${aux2[2]}/${aux2[1]}/${aux2[0]}`;
    }
    return date;
  } catch (error) {
    console.error(error);
    return date;
  }
};

/**
 * @function
 * @description Format a completed date (with hours), like YYYY-MM-DDTHH:mm:SS
 * @param {Date | String} date
 * @returns {String} A formatted completed date, like DD/MM/YYYY - HH:mm:SS
 */
export const displayFullDate = (date) => {
  try {
    let aux = date.split('T');

    if (aux.length === 1) {
      aux = date.split(' ');
    }

    let dayMonthYear = aux[0].split('-');
    dayMonthYear = `${dayMonthYear[2]}/${dayMonthYear[1]}/${dayMonthYear[0]}`;
    const hours = aux[1].split('.')[0];

    return `${dayMonthYear} - ${hours}`;
  } catch (error) {
    console.error(error);
    return date;
  }
};

/**
 * @function
 * @description Generates a random integer number between 2 limits
 * @param {Number} min Minimum limit
 * @param {Number} max Maximum limit
 * @returns {Number} A random integer number
 */
export const randomNumber = (min, max) => {
  try {
    const minIsNaN = Number.isNaN(Number(min));
    const maxIsNaN = Number.isNaN(Number(max));

    if (minIsNaN || maxIsNaN) {
      throw new Error(`The 'min' and 'max' fields must be a number: Expected a number for ${minIsNaN ? "'min'" : "'max'"} value, found ${minIsNaN ? typeof min : max}.`);
    }

    const integerMin = Math.ceil(min);
    const integerMax = Math.floor(max);

    return Math.floor(Math.random() * (integerMax - integerMin) + integerMin);
  } catch (error) {
    console.error(error);
    return 0;
  }
};
