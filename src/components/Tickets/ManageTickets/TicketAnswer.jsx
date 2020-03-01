import React from 'react';

import {
  Box,
  Typography,
} from '@material-ui/core';

import { displayFullDate } from '../../../config/masks';

import { BoxMessageAdmin, BoxMessageIcon } from './styles';


function TicketAnswer(props) {
  const { answer } = { ...props };

  return (
    <BoxMessageAdmin fromadmin={answer.adminId || answer.pending}>
      <Box width="100%">
        <Typography component="p" variant="body1" align={answer.adminId || answer.pending ? 'right' : 'left'}>
          {answer.msg}
        </Typography>
      </Box>
      <Box width="100%" display="flex" justifyContent="flex-end" alignItems="center">
        { Boolean(answer.error)
          && (
            <Box display="flex" alignItems="center">
              <Typography component="p" variant="body2">
                Mensagem não enviada
              </Typography>
              <BoxMessageIcon>
                warning
              </BoxMessageIcon>
            </Box>
          )
        }
        { Boolean(answer.adminId || answer.pending) && !answer.error
          && (
            <Box display="flex" alignItems="center">
              <Typography component="span" variant="body2">
                {answer.createdAt ? displayFullDate(answer.createdAt) : ''}
              </Typography>
              <BoxMessageIcon>
                {answer.pending ? 'restore' : 'done'}
              </BoxMessageIcon>
            </Box>
          )
        }
      </Box>
    </BoxMessageAdmin>
  );
}


export default TicketAnswer;
