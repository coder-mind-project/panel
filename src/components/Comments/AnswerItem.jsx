import React from 'react';
import { commentType } from '@/types';

import {
  Box,
  Typography,
} from '@material-ui/core';

import { displayFullDate } from '@/config/masks';

import {
  AnswerOwner,
  AnswerMessage,
} from './styles';

function AnswerItem(props) {
  const {
    answer,
  } = props;

  return (
    <Box
      width="100%"
      mt={1}
      mb={2}
    >
      <AnswerOwner>
        <Typography variant="body2" component="span" className="answer-owner">
          {answer.userName}
        </Typography>
        <Typography variant="body2" component="span">
          {answer.createdAt ? displayFullDate(answer.createdAt) : ''}
        </Typography>
      </AnswerOwner>
      <AnswerMessage>
        <Typography variant="body2" component="span" className="answer-message">
          {answer.message}
        </Typography>
      </AnswerMessage>
    </Box>
  );
}

AnswerItem.propTypes = {
  answer: commentType.isRequired,
};

export default AnswerItem;
