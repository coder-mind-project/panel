import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { commentType } from '@/types';

import {
  Box,
  Typography,
  Chip,
  Icon,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
} from '@material-ui/core';

import { devices } from '@/config/devices';

import { displayFullDate, displayDate } from '@/config/masks';

import axios from 'axios';


import WhatIsDisabledAnswersDialog from './WhatIsDisabledAnswersDialog';

import {
  AnswerOwner,
  AnswerMessage,
} from './styles';

function AnswerItem(props) {
  const {
    answer,
    changeAnswerState,
  } = props;

  const [whatIsDisabledAnswers, setWhatIsDisabledAnswers] = useState(false);
  const [anchorMenu, setAnchorMenu] = useState(null);

  const matches = useMediaQuery(devices.mobileLarge);

  function openMenu(evt) {
    const { currentTarget } = evt;
    setAnchorMenu(currentTarget);
  }

  function closeMenu() {
    setAnchorMenu(null);
  }

  function openWhatIsDisabledAnswersDialog() {
    setWhatIsDisabledAnswers(true);
  }

  function closeWhatIsDisabledAnswersDialog() {
    setWhatIsDisabledAnswers(false);
  }

  function changeState() {
    const { _id } = answer;
    const url = `/comments/${_id}`;

    let method = 'put';
    let newState = 'enabled';
    if (answer.state === 'enabled') {
      method = 'delete';
      newState = 'disabled';
    }

    axios[method](url);

    const updatedAnswer = {
      ...answer,
      state: newState,
    };
    changeAnswerState(updatedAnswer);

    closeMenu();
  }

  return (
    <Box
      width="100%"
      mt={1}
      mb={2}
    >
      <WhatIsDisabledAnswersDialog
        open={whatIsDisabledAnswers}
        closeDialog={closeWhatIsDisabledAnswersDialog}
      />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
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
            {answer.createdAt && matches ? displayDate(answer.createdAt) : ''}
            {answer.createdAt && !matches ? displayFullDate(answer.createdAt) : ''}
          </Typography>
          {answer.state !== 'enabled'
            && (
              <Tooltip
                title={(
                  <Typography
                    component="span"
                    variant="caption"
                  >
                    Este comentário está desabilitado
                  </Typography>
              )}
                placement="right"
              >
                <IconButton
                  size="small"
                  className="cm-disable-indicator"
                  onClick={openWhatIsDisabledAnswersDialog}
                >
                  <Icon
                    fontSize="small"
                    color="action"
                  >
                    lock
                  </Icon>
                </IconButton>
              </Tooltip>
            )
          }
        </AnswerOwner>
        <IconButton size="small" onClick={openMenu}>
          <Icon fontSize="small">
            expand_more
          </Icon>
        </IconButton>
        <Menu
          anchorEl={anchorMenu}
          keepMounted
          open={Boolean(anchorMenu)}
          onClose={closeMenu}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <MenuItem
            onClick={changeState}
            selected={false}
          >
            {answer.state === 'enabled' ? 'Desabilitar' : 'Habilitar'}
          </MenuItem>
        </Menu>
      </Box>
      <AnswerMessage state={answer.state}>
        <Typography variant="body2" component="span" className="answer-message">
          {answer.message}
        </Typography>
      </AnswerMessage>
    </Box>
  );
}

AnswerItem.propTypes = {
  answer: commentType.isRequired,
  changeAnswerState: PropTypes.func.isRequired,
};

export default AnswerItem;
