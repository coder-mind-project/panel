export function setError(error) {
  return {
    type: 'ERROR',
    error,
  };
}

export default { setError };
