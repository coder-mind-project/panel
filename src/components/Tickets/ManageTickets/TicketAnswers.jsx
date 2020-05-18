import React, { useState, useEffect } from 'react';

import {
  Drawer,
  Box,
  IconButton,
  Icon,
  Divider,
  useMediaQuery,
  Typography,
  Menu,
  MenuItem,
  Checkbox,
} from '@material-ui/core';

import { devices } from '@/config/devices';

import BoxAnswers from './BoxAnswers';
import BoxAnswer from './BoxAnswer';

function TicketAnswers(props) {
  const { ticket, open, close } = { ...props };

  const [answers, setAnswers] = useState([]);
  const [latestAnswer, setLatestAnswer] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [anchorMenu, setAnchorMenu] = useState(null);
  const [sendEmail, setSendEmail] = useState(true);

  const matches = useMediaQuery(devices.mobileLarge);

  function showMenu(evt) {
    setAnchorMenu(evt.currentTarget);
  }

  function closeMenu() {
    setAnchorMenu(null);
  }

  function handleChecked(attr, setAttr) {
    setAttr(!attr);

    localStorage.setItem('tickets-send-email', !attr);

    closeMenu();
  }

  function catchLatestAnswer(response = null) {
    setLatestAnswer(response);
  }

  function catchUpdatedAnswers(responses) {
    setAnswers(responses);
  }

  function setError(error) {
    setHasError(error);
  }

  function clearError() {
    setHasError(false);
  }

  useEffect(() => {
    function getConfigs() {
      const autoEmail = JSON.parse(localStorage.getItem('tickets-send-email'));

      setSendEmail(autoEmail);
    }
    getConfigs();
  }, [sendEmail, ticket]);

  return (
    <Drawer
      anchor="right"
      open={open}
      variant="persistent"
      PaperProps={{ style: { position: 'absolute', width: matches ? '100%' : '60%' } }}
      BackdropProps={{ style: { position: 'absolute' } }}
      ModalProps={{
        container: document.getElementById('drawer-container'),
        style: { position: 'absolute' },
      }}
    >
      <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
        <Box width="100%">
          <Box width="100%" display="flex" justifyContent="space-between" alignItems="center">
            <IconButton onClick={close}>
              <Icon>
                keyboard_arrow_right
              </Icon>
            </IconButton>
            <IconButton onClick={showMenu}>
              <Icon>
                more_vert
              </Icon>
            </IconButton>
          </Box>
          <Divider />
        </Box>
        <Menu
          open={Boolean(anchorMenu)}
          anchorEl={anchorMenu}
          onClose={closeMenu}
          keepMounted
        >
          <MenuItem onClick={() => handleChecked(sendEmail, setSendEmail)}>
            <Box mr={1} display="flex" alignItems="center">
              <Checkbox
                checked={sendEmail}
                onChange={() => handleChecked(sendEmail, setSendEmail)}
                color="primary"
              />
            </Box>
            <Typography>
              Enviar e-mail a cada resposta
            </Typography>
          </MenuItem>
        </Menu>
        <BoxAnswers
          updatedAnswers={answers}
          latestAnswer={latestAnswer}
          clearLatestAnswer={catchLatestAnswer}
          ticket={ticket}
          hasError={hasError}
          clearCurrentError={clearError}
        />
        <BoxAnswer
          emitAnswers={catchUpdatedAnswers}
          ticketId={ticket._id}
          sendEmail={sendEmail}
          sendedAnswer={catchLatestAnswer}
          emitError={setError}
        />
      </Box>
    </Drawer>
  );
}

export default TicketAnswers;
