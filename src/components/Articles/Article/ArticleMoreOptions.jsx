import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { articleType } from '@/types';

import {
  ExpansionPanel,
  ExpansionPanelDetails,
  Icon,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Box,
} from '@material-ui/core';

import { CODER_MIND_URL } from '@/config/dataProperties';
import { formatCustomURL } from '@/config/masks';

import {
  FaYoutube,
  FaVideo,
  FaGitlab,
  FaGithub,
  FaStore,
} from 'react-icons/fa';

import { CustomTooltip } from '@/components/styles';
import { CustomExpansionPanelSummary, BoxSocialMedia } from './styles';

function ArticleMoreOptions(props) {
  const {
    article,
    open,
    close,
    expanded,
  } = props;

  const [mounted, setMounted] = useState(false);
  const [openTooltip, setOpenTooltip] = useState(false);

  const [socialRepository, setSocialRepository] = useState('');
  const [socialRepositoryType, setSocialRepositoryType] = useState('github');
  const [socialVideo, setSocialVideo] = useState('');
  const [socialVideoType, setSocialVideoType] = useState('youtube');
  const [customUri, setCustomUri] = useState('');

  function toogleDetails() {
    if (!expanded) {
      open('moreOptions');
    } else {
      close();
    }
  }

  function getRepoTypeIcon() {
    switch (socialRepositoryType) {
      case 'github': return (<FaGithub />);
      case 'gitlab': return (<FaGitlab />);
      default: return (<FaStore />);
    }
  }

  function getVideoTypeIcon() {
    return (socialVideoType === 'youtube' ? <FaYoutube /> : <FaVideo />);
  }

  function changeSocialRepositoryType(evt) {
    const { value } = evt.target;
    setSocialRepository('');
    setSocialRepositoryType(value);
  }

  function changeSocialVideoType(evt) {
    const { value } = evt.target;
    setSocialVideo('');
    setSocialVideoType(value);
  }

  function changeCustomUri(evt) {
    const { value } = evt.target;
    setCustomUri(value);
    setOpenTooltip(true);
  }

  function hideCustomUriTooltip() {
    setOpenTooltip(false);
  }

  useEffect(() => {
    if (article._id && !mounted) {
      setMounted(true);
      setSocialRepository(article.socialRepository);
      setSocialRepositoryType(article.socialRepositoryType);
      setSocialVideo(article.socialVideo);
      setSocialVideoType(article.socialVideoType);
      setCustomUri(article.customUri);
    }
  }, [article, socialRepository, socialRepositoryType, socialVideo, socialVideoType, mounted]);

  return (
    <ExpansionPanel expanded={expanded}>
      <CustomExpansionPanelSummary
        onClick={toogleDetails}
        expandIcon={<Icon>expand_more</Icon>}
      >
        <Typography variant="h6" component="h2">Mais opções</Typography>
      </CustomExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Box>
          <BoxSocialMedia>
            <CustomTooltip
              placement="top-start"
              arrow
              open={openTooltip}
              title={(
                <Typography component="span" variant="caption">
                  A url do artigo ficará:
                  {' '}
                  {CODER_MIND_URL}
                  /artigos/
                  <strong>{customUri ? formatCustomURL(customUri) : ''}</strong>
                </Typography>
          )}
            >
              <TextField
                label="Url Personalizada"
                margin="dense"
                fullWidth
                value={customUri}
                onChange={changeCustomUri}
                onBlur={hideCustomUriTooltip}
              />
            </CustomTooltip>
          </BoxSocialMedia>
          <BoxSocialMedia>
            <TextField
              label="Repositório"
              margin="dense"
              error={false}
              helperText={(
                <Typography component="span" variant="caption">
                  <strong>Informe o link completo do repositório</strong>
                </Typography>
          )}
              value={socialRepository || ''}
              onChange={(evt) => setSocialRepository(evt.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {getRepoTypeIcon()}
                  </InputAdornment>
                ),
              }}
            />
            <FormControl className="social-media-type">
              <InputLabel>Tipo</InputLabel>
              <Select
                value={socialRepositoryType || 'github'}
                onChange={changeSocialRepositoryType}
              >
                <MenuItem value="github">GitHub</MenuItem>
                <MenuItem value="gitlab">GitLab</MenuItem>
                <MenuItem value="other">Outro</MenuItem>
              </Select>
            </FormControl>
          </BoxSocialMedia>
          <BoxSocialMedia>
            <TextField
              label="Video"
              margin="dense"
              error={false}
              helperText={(
                <Typography component="span" variant="caption">
                  <strong>Informe o link completo do video</strong>
                </Typography>
          )}
              value={socialVideo || ''}
              onChange={(evt) => setSocialVideo(evt.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {getVideoTypeIcon()}
                  </InputAdornment>
                ),
              }}
            />
            <FormControl className="social-media-type">
              <InputLabel>Tipo</InputLabel>
              <Select
                value={socialVideoType || 'youtube'}
                onChange={changeSocialVideoType}
              >
                <MenuItem value="youtube">Youtube</MenuItem>
                <MenuItem value="other">Outro</MenuItem>
              </Select>
            </FormControl>
          </BoxSocialMedia>
        </Box>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

ArticleMoreOptions.propTypes = {
  article: articleType.isRequired,
  open: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  expanded: PropTypes.bool,
};

ArticleMoreOptions.defaultProps = {
  expanded: false,
};

export default ArticleMoreOptions;
