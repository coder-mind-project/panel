export function callToast(config) {
  return {
    type: 'TOAST',
    config,
  };
}
