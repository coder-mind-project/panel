import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { commentSettingsType, appTheme } from '@/types';

import {
  DialogContent,
  Box,
  Typography,
  IconButton,
  Icon,
  Divider,
  Button,
  Tooltip,
  Grid,
  useMediaQuery,
} from '@material-ui/core';

import { connect } from 'react-redux';

import { backendUrl } from '@/config/backend';
import { devices } from '@/config/devices';

import ArticleLogoSample from '@/assets/img_not_found_512x512.png';

import { displayFullDate } from '@/config/masks';

import AnswersSection from './AnswersSection';

import {
  DialogSettingsTitle,
  CustomDialog,
  SettingsTitleContent,
  CustomDialogActions,
  CustomTextField,
  CustomLink,
  HudIconButton,
} from './styles';

function CommentDetailsDialog(props) {
  const {
    open,
    closeDialog,
    comment,
    theme,
  } = props;

  /**
   * @description Controller states
   */
  const [showResponses, setShowResponses] = useState(false);

  const matches = useMediaQuery(devices.tablet);

  function close(event) {
    closeDialog(event);
  }

  function openAnswersSection() {
    setShowResponses(true);
  }

  function closeAnswersSection() {
    setShowResponses(false);
  }

  return (
    <CustomDialog
      open={open}
      onClose={close}
      maxWidth="md"
    >
      <AnswersSection
        open={showResponses}
        closeDialog={closeAnswersSection}
        comment={comment}
      />
      <DialogSettingsTitle id="title" disableTypography>
        <SettingsTitleContent>
          <Box display="flex" alignItems="center">
            <Box mr={1} display="flex" alignItems="center">
              <Icon color="action" fontSize="small">
                comment
              </Icon>
            </Box>
            <Typography
              component="span"
              variant="body1"
              className="dialog-title"
            >
              Comentário de
              {' '}
              <Typography component="span" variant="body1">
                {comment.userName}
              </Typography>
              {comment.article ? ` - ${comment.article.title}` : ''}
            </Typography>
          </Box>
          <IconButton onClick={close} size="small">
            <Icon>
              clear
            </Icon>
          </IconButton>
        </SettingsTitleContent>
        <Divider />
      </DialogSettingsTitle>
      <DialogContent>
        <Box width="100%" display="flex" flexWrap="wrap">
          <Grid item xs={12} sm={7}>
            <CustomTextField
              label="Nome do leitor"
              value={comment.userName}
            />
            <CustomTextField
              label="E-mail do leitor"
              value={comment.userEmail}
            />
            <CustomTextField
              label="Mensagem"
              multiline
              rows={5}
              value={comment.message}
            />
          </Grid>
          { !matches
            && (
              <Grid item xs={12} sm={5}>
                <img
                  style={{ boxShadow: '0px 0px 2px 1px #ccc', objectFit: 'cover' }}
                  width="100%"
                  height="200px"
                  src={comment.article ? `${backendUrl}${comment.article.smallImg}` : ArticleLogoSample}
                  alt={comment.article ? comment.article.title : 'Artigo não definido'}
                />
                <Box
                  width="100%"
                  display="flex"
                  justifyContent="center"
                  mt={2}
                >
                  <CustomLink to={`/articles/${comment.article.customURL}`}>
                    <Button
                      color="primary"
                      variant={theme === 'dark' ? 'contained' : 'text'}
                      size="small"
                    >
                      Abrir artigo
                    </Button>
                  </CustomLink>
                </Box>
              </Grid>
            )}
        </Box>
      </DialogContent>
      <CustomDialogActions>
        <Box
          display="flex"
          alignItems="center"
        >
          { comment.readedAt
              && (
                <Tooltip
                  title={(
                    <Typography component="span" variant="caption">
                      Comentário lido em:
                      {' '}
                      {displayFullDate(comment.readedAt)}
                    </Typography>
                  )}
                  placement="right-start"
                >
                  <HudIconButton
                    size="small"
                    color={theme === 'dark' ? 'inherit' : 'primary'}
                  >
                    <Icon>
                      done
                    </Icon>
                  </HudIconButton>
                </Tooltip>
              )}
          <Tooltip
            title={(
              <Typography component="span" variant="caption">
                Comentado em:
                {' '}
                {displayFullDate(comment.createdAt)}
              </Typography>
          )}
            placement="right-start"
          >
            <IconButton size="small">
              <Icon>
                info
              </Icon>
            </IconButton>
          </Tooltip>
        </Box>
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
        >
          {matches
          && (
            <Box mr={2}>
              <CustomLink to={`/articles/${comment.article.customURL}`}>
                <Button
                  color="primary"
                  variant="contained"
                  size="small"
                >
                  Abrir artigo
                </Button>
              </CustomLink>
            </Box>
          )}
          <Box>
            <Button
              onClick={openAnswersSection}
              color="primary"
              variant="contained"
              size="small"
            >
              Responder
            </Button>
          </Box>
        </Box>

      </CustomDialogActions>
    </CustomDialog>
  );
}

CommentDetailsDialog.propTypes = {
  open: PropTypes.bool,
  closeDialog: PropTypes.func.isRequired,
  comment: commentSettingsType.isRequired,
  theme: appTheme.isRequired,
};

CommentDetailsDialog.defaultProps = {
  open: false,
};

const mapStateToProps = (state) => ({ toast: state.config, theme: state.theme });

export default connect(mapStateToProps)(CommentDetailsDialog);
