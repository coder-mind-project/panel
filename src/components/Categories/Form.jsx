import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { categoryType } from '@/types';

import {
  Icon,
  Dialog,
  DialogActions,
  DialogContent,
  Box,
  Divider,
  Typography,
  Button,
  LinearProgress,
} from '@material-ui/core';

import AsyncSelect from 'react-select/async';

import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { backendUrl, defineErrorMsg } from '@/config/backend';

import { callToast as toastEmitter } from '@/redux/toast/toastActions';
import { success, error as toastError } from '@/config/toasts';

import {
  CustomTextField,
  CustomFormGroup,
  CustomInputLabel,
} from './styles';

function CategoryForm(props) {
  const {
    callToast,
    propCategory,
    open,
    onClose,
  } = props;

  const [category, setCategory] = useState({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  function handleChange(event, attr) {
    const { value } = { ...event.target };
    setCategory({
      ...category,
      [attr]: value,
    });
  }

  function handleChangeSelect(value, attr) {
    setCategory({
      ...category,
      [attr]: value,
    });
  }

  function close(saved = false) {
    if (loading) return;
    onClose(saved);
  }

  async function loadThemes(query) {
    let themes = [];
    try {
      const url = `${backendUrl}/themes?query=${query}`;
      const response = await axios(url);

      themes = response.data.themes.map((elem) => ({
        ...elem,
        label: elem.name,
        value: elem._id,
      })) || [];
    } catch (err) {
      callToast(error('Ocorreu um erro ao obter os temas, se persistir reporte'));
    }

    return themes;
  }

  function getThemes(value) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(value.length >= 3 ? loadThemes(value) : []);
      });
    }, 1000);
  }

  function formatData() {
    const data = { ...category };

    data.themeId = data.theme ? data.theme._id : null;
    delete data.theme;

    return data;
  }

  async function save() {
    if (loading) return;

    const method = category._id ? 'put' : 'post';
    const url = method === 'post' ? `${backendUrl}/categories` : `${backendUrl}/categories/${category._id}`;
    setLoading(true);

    const data = formatData(category);
    await axios[method](url, data).then(() => {
      callToast(success('Operação realizada com sucesso'));
      close(true);
    }).catch((err) => {
      const msg = defineErrorMsg(err);
      setError(err.response.data);
      callToast(toastError(msg));
    });

    setLoading(false);
  }

  useEffect(() => {
    if (open) {
      if (!propCategory._id) {
        setCategory({
          name: '', alias: '', theme: null, description: '',
        });
      } else setCategory(propCategory);
    }
  }, [open, propCategory]);

  return (
    <Dialog
      open={open}
      onClose={() => close()}
      onEscapeKeyDown={() => close()}
      onBackdropClick={() => close()}
      maxWidth="md"
    >
      {loading && <LinearProgress color="primary" /> }
      <Box mb={1} p={2}>
        <Box display="flex" alignItems="center">
          <Icon style={{ marginRight: 3, color: '#444' }}>category</Icon>
          <Typography variant="h5" component="h1">{category._id ? 'Atualizar categoria' : 'Inserir categoria'}</Typography>
        </Box>
        <Divider style={{ marginTop: 10 }} />
      </Box>
      <DialogContent>
        <Box display="flex" alignItems="center" flexWrap="wrap">
          <CustomTextField
            label="Categoria"
            error={Boolean(error.name)}
            helperText={error.name
              ? error.msg : ''}
            onBlur={() => setError({})}
            value={category.name}
            onChange={(event) => handleChange(event, 'name')}
          />
          <CustomTextField
            label="Apelido"
            error={Boolean(error.alias)}
            helperText={error.alias
              ? error.msg
              : ''}
            onBlur={() => setError({})}
            value={category.alias}
            onChange={(event) => handleChange(event, 'alias')}
          />
          <CustomFormGroup>
            <CustomInputLabel>
              Tema
            </CustomInputLabel>
            <AsyncSelect
              cacheOptions
              value={category.theme || null}
              isClearable
              loadOptions={getThemes}
              onChange={(value) => handleChangeSelect(value, 'theme')}
              noOptionsMessage={(event) => (event.inputValue.length >= 3
                ? 'Nenhum resultado encontrado'
                : 'Faça uma busca com pelo menos 3 caracteres')}
              loadingMessage={() => 'Carregando...'}
              placeholder=""
            />
          </CustomFormGroup>
          <CustomTextField
            label="Descrição"
            error={Boolean(error.description)}
            helperText={error.description
              ? error.msg
              : ''}
            onBlur={() => setError({})}
            fullWidth
            value={category.description}
            multiline
            rows={3}
            onChange={(event) => handleChange(event, 'description')}
          />
        </Box>
      </DialogContent>
      <DialogActions style={{ margin: 10 }}>
        <Button variant="contained" onClick={() => close()}>
          Fechar
        </Button>
        <Button variant="contained" color="primary" onClick={save}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

CategoryForm.propTypes = {
  callToast: PropTypes.func.isRequired,
  propCategory: categoryType.isRequired,
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

CategoryForm.defaultProps = {
  open: false,
};


const mapStateToProps = (state) => ({ toast: state.config });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(CategoryForm);
