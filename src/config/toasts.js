const success = (response) => ({
  type: 'success',
  msg: response && typeof response === 'string' ? response : 'Operação realizada com sucesso',
  display: true,
});

const error = (response) => ({
  type: 'error',
  msg: response && typeof response === 'string' ? response : 'Ocorreu um erro desconhecido, se persistir reporte!',
  display: true,
});

const warning = (response) => ({
  type: 'warning',
  msg: response && typeof response === 'string' ? response : '',
  display: true,
});

const info = (response) => ({
  type: 'info',
  msg: response && typeof response === 'string' ? response : '',
  display: true,
});

export {
  info, warning, error, success,
};
