const backendUrl = process.env.REACT_APP_PRODUCTION_API
      || process.env.REACT_APP_DEVELOPMENT_API
      || process.env.REACT_APP_LOCAL_API_DEVELOPMENT;

const ipinfo = process.env.REACT_APP_IP_INFO_API;
const ipinfoToken = process.env.REACT_APP_IP_INFO_TOKEN;

const defineErrorMsg = (error) => {
  let errorMsg = 'Ocorreu um erro desconhecido, se persistir reporte';

  if (error.isAxiosError) {
    errorMsg = 'Ops, não conseguimos conectar ao servidor, tente novamente mais tarde!';
  }
  if (error.response && error.response.data) {
    if (typeof error.response.data === 'string') {
      errorMsg = error.response.data;
    } else {
      errorMsg = error.response.data.message || error.response.data.msg;
    }
  }

  return errorMsg;
};

const defineErrorType = (error) => {
  let errorType = 'internal';

  if (error && error.response && error.response.data) {
    const keys = Object.keys(error.response.data);
    const remainingKeys = keys.filter((elem) => elem !== 'code' && elem !== 'msg');

    if (remainingKeys.length === 1) {
      [errorType] = remainingKeys;
    }
  }

  return errorType;
};

export {
  backendUrl,
  defineErrorMsg,
  defineErrorType,
  ipinfo,
  ipinfoToken,
};
