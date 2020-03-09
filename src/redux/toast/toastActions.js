export function callToast(config) {
  return {
    type: 'TOAST',
    config,
  };
}

export default { callToast };
