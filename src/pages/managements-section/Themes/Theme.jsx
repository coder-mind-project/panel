import React, { useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';

import {
  Container, Grid, TextField, Divider,
  Paper, Icon, Breadcrumbs, Box,
} from '@material-ui/core';

import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CustomButton from '../../../components/Button';
import Header from '../../../components/Header';
import Searching from '../../../assets/loading.gif';

import { backendUrl, defineErrorMsg } from '../../../config/backend';

import '../../css/defaultPage.css';
import '../../css/forms.css';

import { callToast as toastEmitter } from '../../../redux/toastActions';
import { success, error as toastError } from '../../../config/toasts';

function Theme(props) {
  const { callToast, match } = { ...props };

  const [theme, setTheme] = useState({});
  const [loading, setLoading] = useState(false);
  const [redirectTo, setRedirectTo] = useState('');
  const [error, setError] = useState({});

  function handleChange(attr) {
    return (event) => {
      const { value } = { ...event.target };
      setTheme({
        ...theme,
        [attr]: value,
      });
    };
  }

  function goTo(path) {
    setRedirectTo(`/${path}`);
  }

  async function save() {
    const method = theme._id ? 'put' : 'post';
    const url = method === 'post' ? `${backendUrl}/themes` : `${backendUrl}/themes/${theme._id}`;

    axios[method](url, theme).then(() => {
      callToast(success('Operação realizada com sucesso'));
      setTimeout(() => {
        goTo('themes');
      }, 2000);
    }).catch(async (err) => {
      const msg = await defineErrorMsg(err);
      setError(err.response.data);
      callToast(toastError(msg));
    });
  }

  useEffect(() => {
    async function getTheme(id) {
      const url = `${backendUrl}/themes/${id}`;
      setLoading(true);
      await axios(url).then((res) => {
        const result = res && res.data ? res.data : {};
        if (!result._id) setRedirectTo('/themes');
        setTheme(result);
      }).catch((err) => {
        setError(err.response.data);
        goTo('themes');
      });

      setLoading(false);
    }

    if (!loading && !theme._id && !error.code) {
      if (!match.params.id) setRedirectTo('/themes');
      const { id } = { ...match.params };

      getTheme(id);
    }
  }, [theme, loading, error, redirectTo]);

  return (
    <Container id="component">
      <Header
        title="Tema"
        description="Consulte, altere, crie e remova temas do sistema"
        icon="bookmark"
      />
      <Box mb={3}>
        <Breadcrumbs separator={<Icon>navigate_next_icon</Icon>}>
          <Link to="/management" className="defaultFontColor">
            <strong>Configurações</strong>
          </Link>
          <Link to="/themes" className="defaultFontColor">
            <strong>Temas</strong>
          </Link>
          <strong>
            {theme._id ? 'Editar tema' : 'Criar tema'}
          </strong>
        </Breadcrumbs>
      </Box>
      { !loading
              && (
              <Paper className="form">
                {redirectTo
                      && <Redirect to={redirectTo} />
                  }
                <Grid container>
                  <Grid item xs={12} md={6} className="formGroup">
                    <TextField
                      label="Tema"
                      error={Boolean(error.name)}
                      helperText={error.name
                        ? error.msg : ''}
                      fullWidth
                      onBlur={() => setError({})}
                      className="formInput"
                      value={theme.name}
                      onChange={handleChange('name')}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} className="formGroup">
                    <TextField
                      label="Apelido"
                      error={Boolean(error.alias)}
                      helperText={error.alias
                        ? error.msg
                        : ''}
                      onBlur={() => setError({})}
                      className="formInput"
                      value={theme.alias}
                      fullWidth
                      onChange={handleChange('alias')}
                    />
                  </Grid>
                  <p>{error.name}</p>
                  <Grid item xs={12} className="formGroup">
                    <TextField
                      label="Descrição"
                      error={Boolean(error.description)}
                      helperText={error.description
                        ? error.msg
                        : ''}
                      onBlur={() => setError({})}
                      className="formInput"
                      fullWidth
                      value={theme.description}
                      onChange={handleChange('description')}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Divider className="separator" />
                </Grid>
                <Grid item xs={12} className="footList">
                  <CustomButton
                    className="buttonFootList"
                    text="Voltar"
                    color="gray"
                    icon="logout"
                    onClick={() => goTo('themes')}
                  />
                  <CustomButton
                    className="buttonFootList"
                    text="Salvar"
                    color="success"
                    icon="done"
                    onClick={save}
                  />
                </Grid>
              </Paper>
              )
          }
      {loading
              && (
              <Container className="center spinnerContainer">
                <img src={Searching} alt="Procurando categorias..." />
                <h4>
                  Carregando, por favor aguarde...
                </h4>
              </Container>
              )
          }
    </Container>
  );
}


const mapStateToProps = (state) => ({ toast: state.config });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Theme);
