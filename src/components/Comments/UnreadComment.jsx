import React from 'react';
import PropTypes from 'prop-types';
import { commentType } from '@/types';

import {
  Box,
  Typography,
  Divider,
} from '@material-ui/core';

import axios from 'axios';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { callToast as toastEmitter } from '@/redux/toast/toastActions';
import { error as toastError } from '@/config/toasts';

import ArticlelogoImgSample from '@/assets/img_not_found_512x512.png';
import {
  ArticleLogoImgContainer,
  CommentContainer,
  CustomMenuItem,
} from './styles';

const UnreadComment = (props) => {
  const {
    notification,
    selectComment,
    callToast,
  } = props;

  function markAsRead() {
    const { _id } = notification;

    const url = `/comments/${_id}`;
    axios.patch(url).catch(() => {
      callToast(toastError('Ocorreu um erro ao marcar o comentário como lido'));
    });
  }

  function displayCommentDetails() {
    markAsRead();
    selectComment(notification);
  }

  return (
    <CommentContainer item xs={12}>
      <CustomMenuItem onClick={displayCommentDetails}>
        <Box display="flex" alignItems="center" width="100%">
          <ArticleLogoImgContainer>
            <img
              className="article-small-img"
              src={notification.article.logoImg ? `${notification.article.logoImg}` : ArticlelogoImgSample}
              alt={notification.article.title}
            />
          </ArticleLogoImgContainer>
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
  callToast: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({ toast: state.config });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UnreadComment);
