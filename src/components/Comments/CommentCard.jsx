import React, { useState } from 'react';
import { commentType, appTheme } from '@/types';
import PropTypes from 'prop-types';

import {
  CardMedia,
  CardContent,
  Typography,
  Button,
  Chip,
  Box,
  useMediaQuery,
  Icon,
} from '@material-ui/core';

import ArticleLogoSample from '@/assets/img_not_found_512x512.png';

import { connect } from 'react-redux';
import axios from 'axios';

import { bindActionCreators } from 'redux';
import { callToast as toastEmitter } from '@/redux/toast/toastActions';
import { error as toastError } from '@/config/toasts';

import { backendUrl, defineErrorType } from '@/config/backend';
import { devices } from '@/config/devices';

import CommentDetailsDialog from './CommentDetailsDialog';
import AnswersSection from './AnswersSection';

import {
  CustomCard,
  CustomCardActionArea,
  CustomCardActions,
  CustomChip,
} from './styles';

function CommentCard(props) {
  const {
    comment,
    theme,
    callToast,
    emitAsRead,
    updateCard,
  } = props;

  /**
   * @description Controller states
   */
  const [showDetails, setShowDetails] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

  const matches = useMediaQuery(devices.tablet);

  function openDetails() {
    setShowDetails(true);
  }

  function closeDetails() {
    setShowDetails(false);
  }

  function openAnswers() {
    setShowAnswers(true);
  }

  function closeAnswers() {
    setShowAnswers(false);
  }

  function formatCommentMessage(message) {
    if (!message) return '';

    let sentence = '';
    const words = message.split(' ');

    if (Array.isArray(words)) {
      for (let index = 0; index < words.length; index++) {
        const word = words[index];

        switch (index) {
          case 0: {
            if (word.length > 30) return `${word.slice(0, 29)}...`;

            break;
          }
          case 1:
          case 2:
          case 3: {
            if (word.length > 30) return `${sentence} ${word.slice(0, 29)}...`;
            break;
          }
          default: {
            return message.length > 100 ? `${message.slice(0, 99)}...` : message;
          }
        }

        sentence += `${word} `;
      }
    }

    return message.length > 100 ? `${message.slice(0, 99)}...` : message;
  }

  function markAsRead() {
    const { _id } = comment;

    emitAsRead('readed', comment);

    const url = `${backendUrl}/comments/${_id}`;
    axios.patch(url).catch((error) => {
      const pending = defineErrorType(error);
      if (pending !== 'id') callToast(toastError('Ocorreu um erro ao marcar o comentário como lido'));
    });
  }

  function emitCommentUpdated(commentUpdated) {
    updateCard(commentUpdated);
  }

  return (
    <CustomCard>
      <CommentDetailsDialog
        open={showDetails}
        comment={comment}
        closeDialog={closeDetails}
        updateComment={emitCommentUpdated}
        readComment={markAsRead}
        provider="comments"
      />
      { showAnswers
        && (
          <AnswersSection
            open={showAnswers}
            comment={comment}
            closeDialog={closeAnswers}
            readComment={markAsRead}
          />
        )
      }
      <CustomCardActionArea comment={comment} onClick={openDetails}>
        <CardMedia
          component="img"
          alt={comment && comment.article ? comment.article.title : 'Artigo não definido'}
          height="110"
          image={comment && comment.article ? `${backendUrl}${comment.article.smallImg}` : ArticleLogoSample}
          title={comment && comment.article ? comment.article.title : 'Artigo não definido'}
          className="article-logo"
        />
        <CardContent>
          <Typography variant="h5" component="h2" className="comment-user-name">
            {comment.userName && comment.userName.length > 22 ? `${comment.userName.slice(0, 21)}...` : comment.userName}
          </Typography>
          <Box
            width="100%"
            display="flex"
            alignItems="center"
            mt={1}
            mb={1}
          >
            <Chip
              icon={(<Icon fontSize="small">{comment.readedAt ? 'drafts' : 'markunread'}</Icon>)}
              color={comment.readedAt ? 'primary' : 'default'}
              size="small"
              label={comment.readedAt ? 'Lido' : 'Não lido'}
            />
            {comment.state !== 'enabled'
              && (
                <CustomChip
                  icon={(<Icon fontSize="small">lock</Icon>)}
                  size="small"
                  label="Desabilitado"
                />
              )}
          </Box>
          <Typography variant="body2" color="textSecondary" component="p">
            {formatCommentMessage(comment.message)}
          </Typography>
        </CardContent>
      </CustomCardActionArea>
      <CustomCardActions>
        { !comment.readedAt
            && (
              <Button onClick={markAsRead} size="small" color={theme === 'dark' ? 'default' : 'primary'}>
                { matches
                  && (
                    <Icon>
                      done
                    </Icon>
                  )
                }
                { !matches && 'Marcar como lido'}
              </Button>
            )}
        <Button onClick={openAnswers} size="small" color={theme === 'dark' ? 'default' : 'primary'}>
          { matches
            && (
              <Icon>
                comment
              </Icon>
            )
          }
          { !matches && 'Responder'}
        </Button>
      </CustomCardActions>
    </CustomCard>
  );
}

CommentCard.propTypes = {
  comment: commentType.isRequired,
  theme: appTheme.isRequired,
  callToast: PropTypes.func.isRequired,
  emitAsRead: PropTypes.func.isRequired,
  updateCard: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);
const mapStateToProps = (state) => ({ theme: state.theme, toast: state.config });

export default connect(mapStateToProps, mapDispatchToProps)(CommentCard);
