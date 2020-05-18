import axios from 'axios';

const success = (resp) => resp;
const error = (err) => {
  const user = localStorage.getItem('user');

  if (err && err.response && user) {
    const code = err.response.status;

    if (code === 401) {
      localStorage.removeItem('user');
      window.location = '/';
    }

    if (code === 406) {
      setTimeout(() => {
        window.location = '/';
      }, 3000);
    }
  }

  return Promise.reject(err);
};


axios.interceptors.response.use(success, error);
