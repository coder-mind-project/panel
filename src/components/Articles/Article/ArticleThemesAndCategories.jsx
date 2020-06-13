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

import CustomAsyncSelect from '@/components/AsyncSelect.jsx';

import { CustomExpansionPanelSummary, CustomLink } from './styles';

function ArticleThemesAndCategories(props) {
  const {
    article,
    open,
    close,
    expanded,
    themeApp,
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

  function loadThemes() {

  }

  function onChangeCategory(newCategory) {
    setCategory(newCategory);
  }

  function loadCategories() {

  }

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      setTheme(article.theme);
      setCategory(article.category);
    }
  }, [theme, category, mounted, article.theme, article.category]);

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
};

ArticleThemesAndCategories.defaultProps = {
  expanded: false,
};


const mapStateToProps = (state) => ({ themeApp: state.theme });

export default connect(mapStateToProps)(ArticleThemesAndCategories);
