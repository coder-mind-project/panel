import React from 'react';
import PropTypes from 'prop-types';
import { articleType } from '@/types';

import {
  ExpansionPanel,
  ExpansionPanelDetails,
  Icon,
  Typography,
  Box,
  Button,
  Divider,
} from '@material-ui/core';

import DefaultLogoImg from '@/assets/img_not_found_512x512.png';
import DefaultSecondaryImg from '@/assets/img_not_found_768.png';
import DefaultHeaderImg from '@/assets/img_not_found_1080.png';

import InputFileButton from '@/components/InputFiles.jsx';
import {
  CustomExpansionPanelSummary,
  ArticleLogoArea,
  ArticleSecondaryImageArea,
  ArticleHeaderImageArea,
} from './styles';

function ArticleImages(props) {
  const {
    article,
    open,
    close,
    expanded,
  } = props;

  function toogleDetails() {
    if (!expanded) {
      open('images');
    } else {
      close();
    }
  }

  function logoUrl() {
    return (article && article.logoImg) || DefaultLogoImg;
  }

  function secondaryImgUrl() {
    return (article && article.secondaryImg) || DefaultSecondaryImg;
  }

  function headerImgUrl() {
    return (article && article.headerImg) || DefaultHeaderImg;
  }

  // eslint-disable-next-line no-unused-vars
  function changeImage(reason) {

  }

  return (
    <ExpansionPanel expanded={expanded}>
      <CustomExpansionPanelSummary
        onClick={toogleDetails}
        expandIcon={<Icon>expand_more</Icon>}
      >
        <Typography variant="h6" component="h2">Imagens</Typography>
      </CustomExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Box width="100%">
          <ArticleLogoArea>
            <Box display="flex" justifyContent="space-between" flexWrap="wrap">
              <Box display="flex" flexDirection="column">
                <Box display="flex" flexDirection="column">
                  <Box display="flex">
                    <Icon color="action" fontSize="small">keyboard_arrow_right</Icon>
                    <Typography component="span" variant="body2">Logo do artigo</Typography>
                  </Box>
                  <Box ml={2}>
                    <Typography component="span" variant="caption">Esta imagem será para identificar o artigo, utilize uma imagem auto-descritiva para seu artigo.</Typography>
                  </Box>
                </Box>
              </Box>
              <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" marginX={2} marginY={1} width="100%">
                <img src={logoUrl()} alt={article && article.title} className="article-logo-img" />
                <Box display="flex" alignItems="center">
                  <InputFileButton onChange={() => changeImage('logo')} name="logo">
                    <Button size="small" color="primary" variant="contained">
                      {article.logoImg ? 'Alterar imagem' : 'Adicionar imagem'}
                    </Button>
                  </InputFileButton>
                </Box>
              </Box>
            </Box>
            <Divider />
          </ArticleLogoArea>
          <ArticleSecondaryImageArea>
            <Box display="flex" justifyContent="space-between" flexWrap="wrap">
              <Box display="flex" flexDirection="column">
                <Box display="flex" flexDirection="column">
                  <Box display="flex">
                    <Icon color="action" fontSize="small">keyboard_arrow_right</Icon>
                    <Typography component="span" variant="body2">Imagem de recomendação</Typography>
                  </Box>
                  <Box ml={2}>
                    <Typography component="span" variant="caption">Esta imagem será utilizada para recomendação em outros artigos, utilize uma imagem auto-descritiva.</Typography>
                  </Box>
                </Box>
              </Box>
              <Box display="flex" flexDirection="column" justifyContent="space-between" alignItems="center" marginX={2} marginY={1} width="100%">
                <img src={secondaryImgUrl()} alt={article && article.title} className="article-secondary-img" />
                <Box display="flex" alignItems="center">
                  <InputFileButton onChange={() => changeImage('secondary')} name="secondary">
                    <Button size="small" color="primary" variant="contained">
                      {article.logoImg ? 'Alterar imagem' : 'Adicionar imagem'}
                    </Button>
                  </InputFileButton>
                </Box>
              </Box>
            </Box>
            <Divider />
          </ArticleSecondaryImageArea>
          <ArticleHeaderImageArea>
            <Box display="flex" justifyContent="space-between" flexWrap="wrap">
              <Box display="flex" flexDirection="column">
                <Box display="flex" flexDirection="column">
                  <Box display="flex">
                    <Icon color="action" fontSize="small">keyboard_arrow_right</Icon>
                    <Typography component="span" variant="body2">Imagem de cabeçalho</Typography>
                  </Box>
                  <Box ml={2}>
                    <Typography component="span" variant="caption">Esta imagem será utilizada no cabeçalho de apresentação do artigo.</Typography>
                  </Box>
                </Box>
              </Box>
              <Box display="flex" flexDirection="column" justifyContent="space-between" alignItems="center" marginX={2} marginY={1} width="100%">
                <img src={headerImgUrl()} alt={article && article.title} className="article-header-img" />
                <Box display="flex" alignItems="center">
                  <InputFileButton onChange={() => changeImage('header')} name="header">
                    <Button size="small" color="primary" variant="contained">
                      {article.logoImg ? 'Alterar imagem' : 'Adicionar imagem'}
                    </Button>
                  </InputFileButton>
                </Box>
              </Box>
            </Box>
          </ArticleHeaderImageArea>
        </Box>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

ArticleImages.propTypes = {
  article: articleType.isRequired,
  open: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  expanded: PropTypes.bool,
};

ArticleImages.defaultProps = {
  expanded: false,
};

export default ArticleImages;
