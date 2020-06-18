import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { appTheme, articleType } from '@/types';

import {
  ExpansionPanel,
  Box,
  Typography,
  ExpansionPanelDetails,
  Icon,
} from '@material-ui/core';

import { connect } from 'react-redux';

import axios from 'axios';
import { bindActionCreators } from 'redux';
import { callToast as toastEmitter } from '@/redux/toast/toastActions';
import { error } from '@/config/toasts';

import CustomAsyncSelect from '@/components/AsyncSelect.jsx';

import { CustomExpansionPanelSummary, CustomLink } from './styles';

function ArticleThemesAndCategories(props) {
  const {
    article,
    open,
    close,
    expanded,
    themeApp,
    callToast,
  } = props;

  const [theme, setTheme] = useState(null);
  const [category, setCategory] = useState(null);
  const [mounted, setMounted] = useState(false);

  function toogleDetails() {
    if (!expanded) {
      open('themes&categories');
    } else {
      close();
    }
  }

  function onChangeTheme(newTheme) {
    setTheme(newTheme);
  }

  async function loadThemes(query) {
    if (category) setCategory(null);

    let themes = [];
    try {
      const url = `/themes?query=${query}`;
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

  function onChangeCategory(newCategory) {
    setCategory(newCategory);
  }

  function themeIsDefined() {
    return (theme && theme._id);
  }

  async function loadCategories(query) {
    let categories = [];
    try {
      const url = `/categories/theme/${theme._id}?query=${query}`;
      const response = await axios(url);

      categories = response.data.map((elem) => ({
        ...elem,
        label: elem.name,
        value: elem._id,
      })) || [];
    } catch (err) {
      callToast(error('Ocorreu um erro ao obter as categorias, se persistir reporte'));
    }

    return categories;
  }

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      setTheme(article.theme);
      setCategory(article.category);
    }
  }, [theme, category, mounted, article.theme, article.category]);

  useEffect(() => {
    if (!theme) {
      setCategory(null);
    }
  }, [theme]);

  return (
    <ExpansionPanel expanded={expanded}>
      <CustomExpansionPanelSummary
        onClick={toogleDetails}
        expandIcon={<Icon>expand_more</Icon>}
      >
        <Typography variant="h6" component="h2">Temas & Categorias</Typography>
      </CustomExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Box width="100%">
          <Box mb={2}>
            <CustomAsyncSelect
              label="Tema"
              value={theme}
              onChange={onChangeTheme}
              loadOptions={loadThemes}
              helperText={(
                <Typography component="span" variant="caption">
                  Sem ideias? veja a lista de
                  {' '}
                  <CustomLink to="/themes" theme={themeApp} target="_blank">temas disponíveis</CustomLink>
                </Typography>
              )}
            />
          </Box>
          { themeIsDefined() && (
            <Box mb={2}>
              <CustomAsyncSelect
                label="Categoria"
                value={category}
                onChange={onChangeCategory}
                loadOptions={loadCategories}
                helperText={(
                  <Typography component="span" variant="caption">
                    Sem ideias? veja a lista de
                    {' '}
                    <CustomLink to="/themes" theme={themeApp} target="_blank">categorias disponíveis</CustomLink>
                  </Typography>
                  )}
              />
            </Box>
          )}
        </Box>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

ArticleThemesAndCategories.propTypes = {
  themeApp: appTheme.isRequired,
  article: articleType.isRequired,
  open: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  expanded: PropTypes.bool,
  callToast: PropTypes.func.isRequired,
};

ArticleThemesAndCategories.defaultProps = {
  expanded: false,
};


const mapStateToProps = (state) => ({ themeApp: state.theme });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ArticleThemesAndCategories);
