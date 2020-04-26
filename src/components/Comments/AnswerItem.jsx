import React from 'react';
import { commentType } from '@/types';

import {
  Box,
  Typography,
  Chip,
  Icon,
  Tooltip,
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
        {/* Author's answer */}
        { answer.isAuthor
          && (
            <Tooltip
              title={(
                <Typography
                  component="span"
                  variant="caption"
                >
                  Esta resposta é do autor do artigo
                </Typography>
              )}
              placement="top-start"
            >
              <Chip
                icon={<Icon fontSize="small">grade</Icon>}
                label={answer.userName}
                color="primary"
                size="small"
                className="answer-owner"
              />
            </Tooltip>
          )}
        {/* Coder Mind User (that is not author) answer */}
        { !answer.isAuthor && answer.userId
          && (
            <Tooltip
              title={(
                <Typography
                  component="span"
                  variant="caption"
                >
                  Autor Coder Mind
                </Typography>
              )}
              placement="top-start"
            >
              <Typography variant="body2" component="span" className="answer-owner">
                <Icon fontSize="small" className="cm-user-icon">code</Icon>
                {answer.userName}
              </Typography>
            </Tooltip>
          )}
        {/* Common / reader answer */}
        { !answer.isAuthor && !answer.userId
          && (
            <Typography variant="body2" component="span" className="answer-owner">
              {answer.userName}
            </Typography>
          )}
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
