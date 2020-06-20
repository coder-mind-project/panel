import React, { useState, useEffect } from 'react';
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

import axios from 'axios';
import { defineErrorMsg } from '@/config/backend';
import { success, error, info } from '@/config/toasts';
import { callToast as toastEmitter } from '@/redux/toast/toastActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

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
    callToast,
    onSaveChanges,
  } = props;

  const [mounted, setMounted] = useState(false);

  const [logoImg, setLogoImg] = useState(null);
  const [isSavingLogo, setIsSavingLogo] = useState(false);
  const [secondaryImg, setSecondaryImg] = useState(null);
  const [isSavingSecondary, setIsSavingSecondary] = useState(false);
  const [headerImg, setHeaderImg] = useState(null);
  const [isSavingHeader, setIsSavingHeader] = useState(false);

  function toogleDetails() {
    if (!expanded) {
      open('images');
    } else {
      close();
    }
  }

  function logoUrl() {
    return logoImg || DefaultLogoImg;
  }

  function secondaryImgUrl() {
    return secondaryImg || DefaultSecondaryImg;
  }

  function headerImgUrl() {
    return headerImg || DefaultHeaderImg;
  }

  function getButtonLabel(img, isLoading) {
    if (!img && isLoading) return 'Salvando...';
    if (img && isLoading) return 'Alterando...';
    if (img && !isLoading) return 'Alterar imagem';

    return 'Adicionar imagem';
  }

  function setSavingImg(reason, isSaving = true) {
    if (reason === 'logo') {
      setIsSavingLogo(isSaving);
    }

    if (reason === 'secondary') {
      setIsSavingSecondary(isSaving);
    }

    if (reason === 'header') {
      setIsSavingHeader(isSaving);
    }
  }

  async function changeImage(image, reason) {
    setSavingImg(reason);

    const img = image.target.files[0];
    if (!img) return callToast(info('Selecione uma imagem'));

    const id = article._id;

    const formData = new FormData();
    formData.append('image', img);

    // Overriding content-type https header for uploading images
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };

    const url = `/articles/images/${id}?type=${reason}`;

    await axios.post(url, formData, config).then(async (res) => {
      callToast(success('Operação realizada com sucesso'));
      if (reason === 'logo') {
        setLogoImg(res.data.logoImg);
        onSaveChanges({ logoImg: res.data.logoImg });
      }

      if (reason === 'secondary') setSecondaryImg(res.data.secondaryImg);
      if (reason === 'header') setHeaderImg(res.data.headerImg);
    }).catch((err) => {
      const msg = defineErrorMsg(err);
      callToast(error(msg));
    });

    setSavingImg(reason, false);
    return null;
  }

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      setLogoImg(article.logoImg);
      setSecondaryImg(article.secondaryImg);
      setHeaderImg(article.headerImg);
    }
  }, [
    mounted,
    article.logoImg,
    article.secondaryImg,
    article.headerImg,
  ]);

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
                  <InputFileButton onChange={(image) => changeImage(image, 'logo')} name="logo" disabled={isSavingLogo}>
                    <Button size="small" color="primary" variant="contained">
                      {getButtonLabel(logoImg, isSavingLogo)}
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
                  <InputFileButton onChange={(image) => changeImage(image, 'secondary')} name="secondary" disabled={isSavingSecondary}>
                    <Button size="small" color="primary" variant="contained">
                      {getButtonLabel(secondaryImg, isSavingSecondary)}
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
                  <InputFileButton onChange={(image) => changeImage(image, 'header')} name="header" disabled={isSavingHeader}>
                    <Button size="small" color="primary" variant="contained">
                      {getButtonLabel(headerImg, isSavingHeader)}
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
  onSaveChanges: PropTypes.func.isRequired,
  callToast: PropTypes.func.isRequired,
  expanded: PropTypes.bool,
};

ArticleImages.defaultProps = {
  expanded: false,
};

const mapStateToProps = (state) => ({ toast: state.config });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ArticleImages);
