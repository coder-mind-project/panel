import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { articleType } from '@/types';

import {
  Box,
  Button,
  useMediaQuery,
  Icon,
} from '@material-ui/core';

import CustomButton from '@/components/Buttons/Button.jsx';

import { devices } from '@/config/devices';

import {
  ArticleTitleTextField,
  ArticleIcon,
  ArticleLogo,
  CustomDivider,
  HudButtons,
} from './styles';

function ArticleHeader(props) {
  const {
    article,
    onChange,
    onPublish,
    onShowSettings,
    onTooglePreview,
  } = props;

  const [articleTitle, setArticleTitle] = useState('');
  const [articleDescription, setArticleDescription] = useState('');

  const matches = useMediaQuery(devices.mobileExtraLarge);

  function handleChange(evt, attr) {
    onChange(evt, attr);
  }

  useEffect(() => {
    const { title, description } = article;
    setArticleTitle(title || '');
    setArticleDescription(description || '');
  }, [article, articleTitle, articleDescription]);

  return (
    <Box marginBottom={1} minHeight="85px">
      <Box display="flex" justifyContent="space-between">
        <Box display="flex">
          <ArticleLogo>
            { !article.logoImg && <ArticleIcon color="action">text_snippet</ArticleIcon>}
            { article.logoImg && <img src={article.logoImg} alt={article.title} />}
          </ArticleLogo>
          <Box marginBottom={1} display="flex" flexDirection="column">
            <ArticleTitleTextField
              value={articleTitle}
              placeholder={articleTitle ? '' : 'Artigo sem título'}
              onChange={(evt) => handleChange(evt, 'title')}
            />
            <ArticleTitleTextField
              fontSize={0.9}
              value={articleDescription || ''}
              placeholder={articleDescription ? '' : 'Nenhuma descrição definida'}
              onChange={(evt) => handleChange(evt, 'description')}
            />
          </Box>
        </Box>
        <Box>
          <HudButtons smalldevices={matches.toString()}>
            <Box marginX={1} marginBottom={matches ? 1 : 0}>
              <Button
                color="primary"
                variant="contained"
                size={matches ? 'small' : 'medium'}
                onClick={onPublish}
              >
                { matches ? <Icon>publish</Icon> : 'Publicar'}
              </Button>

            </Box>
            { !matches && (
              <Box marginX={1} marginBottom={matches ? 1 : 0}>
                <Button
                  variant="contained"
                  onClick={onTooglePreview}
                  size={matches ? 'small' : 'medium'}
                >
                  { matches ? <Icon>preview</Icon> : 'Preview'}
                </Button>
              </Box>
            )}
            <Box marginX={1}>
              <CustomButton
                icon="settings"
                color="default"
                size={matches ? 'small' : 'medium'}
                onClick={onShowSettings}
                marginBottom="0"
              />
            </Box>
          </HudButtons>
        </Box>
      </Box>
      <CustomDivider />
    </Box>
  );
}

ArticleHeader.propTypes = {
  article: articleType.isRequired,
  onChange: PropTypes.func.isRequired,
  onPublish: PropTypes.func.isRequired,
  onShowSettings: PropTypes.func.isRequired,
  onTooglePreview: PropTypes.func.isRequired,
};

export default ArticleHeader;
