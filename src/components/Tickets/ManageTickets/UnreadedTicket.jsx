import React from 'react';
import {
  Box,
  Divider,
  Typography,
} from '@material-ui/core';
import { ticketNotificationType } from '@/types';

import { displayFullDate } from '@/config/masks';

import { CustomGridMenu, BoxMessage } from './styles';

const UnreadedTickets = (props) => {
  const {
    notification,
  } = props;

  const defineType = (type) => {
    switch (type) {
      case 'account-changed': {
        return 'Conta alterada - Perfil 2';
      }
      case 'simple-account-problem': {
        return 'Conta alterada - Perfil 1';
      }
      case 'bug-report': {
        return 'Reporte de Bug';
      }
      case 'improvement-suggestion': {
        return 'Sugestão de melhoria';
      }
      default: {
        return 'N/D';
      }
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <CustomGridMenu item xs={12}>
        <Typography component="p" variant="button">
          {defineType(notification.type)}
        </Typography>
        <Typography component="span" variant="body2">
          Enviado em:
          {' '}
          { displayFullDate(notification.createdAt)}
        </Typography>
        <BoxMessage>
          <Typography component="p" variant="body2">
            Mensagem:
            {' '}
            { notification.msg.length > 40 ? `${notification.msg.slice(0, 37)} ...` : notification.msg}
          </Typography>
        </BoxMessage>
        <Box mt={2}>
          <Divider />
        </Box>
      </CustomGridMenu>
    </Box>
  );
};

UnreadedTickets.propTypes = {
  notification: ticketNotificationType.isRequired,
};

export default UnreadedTickets;
