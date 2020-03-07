import React from 'react';
import PropTypes from 'prop-types';
import { commentType } from '@/types';

import axios from 'axios';
import {
  Box,
  Grid,
  Icon,
  IconButton,
  Typography,
  Divider,
  Tooltip,
} from '@material-ui/core';
import { backendUrl } from '@/config/backend';

import { CustomLink } from './styles';

const UnreadComment = (props) => {
  const {
    notification,
    reloadComments,
    close,
  } = props;

  function checkNotification() {
    const readed = {
      _id: notification._id,
      readed: true,
    };

    const url = `${backendUrl}/comments`;

    axios.patch(url, readed).then(() => {
      reloadComments(readed);
    });
  }

  return (
    <Grid item xs={12}>
      <Box display="flex" mb={1} mt={1}>
        <Grid item xs={10}>
          <CustomLink to="/comments" onClick={close}>
            <Typography component="p" variant="button">
              {notification.article.title}
            </Typography>
            <Box>
              <Typography component="span" variant="body2">{notification.userName}</Typography>
              {' '}
              <Typography component="span" variant="body2">fez um novo comentário</Typography>
            </Box>
          </CustomLink>
        </Grid>
        <Grid item xs={2}>
          <Tooltip
            title={(
              <Typography component="span" variant="body2">
                Marcar como lido
              </Typography>
            )}
          >
            <IconButton color="primary" onClick={checkNotification}>
              <Icon>
                done
              </Icon>
            </IconButton>
          </Tooltip>
        </Grid>
      </Box>
      <Divider />
    </Grid>
  );
};

UnreadComment.propTypes = {
  notification: commentType.isRequired,
  reloadComments: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
};

export default UnreadComment;
