// Development APIS
const backendUrl = process.env.REACT_APP_LOCAL_API_DEVELOPMENT;

// Production APIS
// const backendUrl = process.env.REACT_APP_PRODUCTION_API_DEVELOPMENT

// ipinfo.io API
const ipinfo = process.env.REACT_APP_IP_INFO_API;
const ipinfoToken = process.env.REACT_APP_IP_INFO_TOKEN;

const defineErrorMsg = (error) => {
  let errorMsg = 'Ocorreu um erro desconhecido, se persistir reporte';

  if (error.isAxiosError) {
    errorMsg = 'Ops, não conseguimos conectar ao servidor, tente novamente mais tarde!';
  }
  if (error.response && error.response.data) {
    errorMsg = typeof error.response.data === 'string' ? error.response.data : error.response.data.msg;
  }

  return errorMsg;
};

export {
  backendUrl, defineErrorMsg, ipinfo, ipinfoToken,
};
