import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { articleType } from '@/types';

import { Box, useMediaQuery } from '@material-ui/core';

import CustomButton from '@/components/Buttons/Button.jsx';

import { devices } from '@/config/devices';

import {
  ArticleTitleTextField,
  ArticleDescriptionTextField,
  ArticleIcon,
  ArticleLogo,
  CustomDivider,
  HudButtons,
} from './styles';

function ArticleHeader(props) {
  const {
    article,
    onPublish,
    onShowSettings,
    onTooglePreview,
    isPreviewed,
  } = props;

  const [mounted, setMounted] = useState(false);
  const [articleTitle, setArticleTitle] = useState('');
  const [articleDescription, setArticleDescription] = useState('');

  const matches = useMediaQuery(devices.mobileExtraLarge);

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      const { title, description } = article;
      setArticleTitle(title || '');
      setArticleDescription(description || '');
    }
  }, [article, articleTitle, articleDescription, mounted]);

  return (
    <Box marginBottom={1} minHeight="85px">
      <Box marginBottom={1} display="flex" flexDirection="column">
        <Box display="flex" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <ArticleLogo>
              { !article.logoImg && <ArticleIcon color="action" onClick={() => onShowSettings('images')}>text_snippet</ArticleIcon>}
              { article.logoImg && <img src={article.logoImg} alt={article.title} />}
            </ArticleLogo>
            <ArticleTitleTextField
              value={articleTitle}
              placeholder={articleTitle ? '' : 'Artigo sem título'}
              onChange={(evt) => setArticleTitle(evt.target.value)}
            />
          </Box>
          <Box>
            <HudButtons smalldevices={matches.toString()}>
              <Box marginX={1} marginBottom={matches ? 1 : 0}>
                <CustomButton
                  color="primary"
                  text={matches ? '' : 'Publicar'}
                  icon="publish"
                  variant="contained"
                  size={matches ? 'small' : 'medium'}
                  onClick={onPublish}
                />
              </Box>
              { !matches && (
                <Box marginX={1} marginBottom={matches ? 1 : 0}>
                  <CustomButton
                    variant="contained"
                    color="default"
                    text={matches ? '' : 'Preview'}
                    icon={isPreviewed ? 'visibility_off' : 'visibility'}
                    onClick={onTooglePreview}
                    size={matches ? 'small' : 'medium'}
                  />
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
        <Box marginY={1} width="100%">
          <ArticleDescriptionTextField
            fontSize={0.9}
            value={articleDescription || ''}
            placeholder={articleDescription ? '' : 'Nenhuma descrição definida'}
            onChange={(evt) => setArticleDescription(evt.target.value)}
          />
        </Box>
      </Box>
      <CustomDivider />
    </Box>
  );
}

ArticleHeader.propTypes = {
  article: articleType.isRequired,
  onPublish: PropTypes.func.isRequired,
  onShowSettings: PropTypes.func.isRequired,
  onTooglePreview: PropTypes.func.isRequired,
  isPreviewed: PropTypes.bool,
};

ArticleHeader.defaultProps = {
  isPreviewed: false,
};

export default ArticleHeader;
