import React from 'react';
import PropTypes from 'prop-types';
import { commentType } from '@/types';

import {
  Box,
  Typography,
  Divider,
} from '@material-ui/core';
import { backendUrl } from '@/config/backend';

import ArticleSmallImgSample from '@/assets/img_not_found_512x512.png';
import {
  ArticleSmallImgContainer,
  CommentContainer,
  CustomMenuItem,
} from './styles';

const UnreadComment = (props) => {
  const {
    notification,
    selectComment,
  } = props;

  function displayCommentDetails() {
    selectComment(notification);
  }

  return (
    <CommentContainer item xs={12}>
      <CustomMenuItem onClick={displayCommentDetails}>
        <Box display="flex" alignItems="center" width="100%">
          <ArticleSmallImgContainer>
            <img
              className="article-small-img"
              src={notification.article.smallImg ? `${backendUrl}${notification.article.smallImg}` : ArticleSmallImgSample}
              alt={notification.article.title}
            />
          </ArticleSmallImgContainer>
          <Box className="comment-info">
            <Typography component="p" variant="body2">
              {`${notification.userName.length > 30 ? `${notification.userName.slice(0, 29)}...` : notification.userName} fez um novo comentário no artigo ${notification.article.title}`}
            </Typography>
          </Box>
        </Box>
      </CustomMenuItem>
      <Divider />
    </CommentContainer>
  );
};

UnreadComment.propTypes = {
  notification: commentType.isRequired,
  selectComment: PropTypes.func.isRequired,
};


export default UnreadComment;
