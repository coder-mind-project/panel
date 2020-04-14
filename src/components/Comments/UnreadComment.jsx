import React from 'react';
import PropTypes from 'prop-types';
import { commentType, appTheme } from '@/types';

import { connect } from 'react-redux';

import {
  Box,
  Typography,
  Divider,
} from '@material-ui/core';
import { backendUrl } from '@/config/backend';

import ArticleSmallImgSample from '@/assets/img_not_found_512x512.png';
import {
  CustomLink,
  ArticleSmallImgContainer,
  CommentContainer,
} from './styles';

const UnreadComment = (props) => {
  const {
    notification,
    close,
    theme,
  } = props;

  return (
    <CommentContainer item xs={12}>
      <Box display="flex" mb={1} mt={1}>
        <CustomLink to={`/comments?cid=${notification._id}`} onClick={close} theme={theme}>
          <Box display="flex" alignItems="center">
            <ArticleSmallImgContainer>
              <img
                className="article-small-img"
                src={notification.article.smallImg ? `${backendUrl}${notification.article.smallImg}` : ArticleSmallImgSample}
                alt={notification.article.title}
              />
            </ArticleSmallImgContainer>
            <Box>
              <Typography component="span" variant="body2">
                {notification.userName.length > 30 ? `${notification.userName.slice(0, 29)}...` : notification.userName}
                {' '}
                fez um novo comentário no artigo
                {' '}
                <strong>{notification.article.title}</strong>
              </Typography>
            </Box>
          </Box>
        </CustomLink>
      </Box>
      <Divider />
    </CommentContainer>
  );
};

UnreadComment.propTypes = {
  notification: commentType.isRequired,
  close: PropTypes.func.isRequired,
  theme: appTheme.isRequired,
};

const mapStateToProps = (state) => ({ theme: state.theme });

export default connect(mapStateToProps)(UnreadComment);
