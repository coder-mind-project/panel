function isString(value) {
  if (typeof value !== 'string') {
    throw new Error(`typeof value is ${typeof value}, expected 'string'`);
  }
}

export function isValidLink(value) {
  isString(value);
  return value && (value.includes('http://') || value.includes('https://')) && value.includes('.');
}

export function isValidEmail(value) {
  isString(value);
  return value && value.includes('@') && value.includes('.');
}

export function includesOnlyNumbers(value) {
  isString(value);
  return [...value].every((char) => '0123456789'.includes(char));
}
