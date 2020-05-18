import React, { useState } from 'react';

import {
  Box,
  Typography,
  Icon,
  Menu,
  MenuItem,
} from '@material-ui/core';

import { displayFullDate } from '@/config/masks';


import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { info } from '@/config/toasts';
import { callToast as toastEmitter } from '@/redux/toast/toastActions';

import {
  BoxMessageAdmin,
  BoxMessageIcon,
  BoxAnswerIdentifier,
  BoxAnswerButton,
} from './styles';

function TicketAnswer(props) {
  const { answer, callToast } = { ...props };
  const sender = answer.adminId ? answer.admin : answer.user;

  const [anchorMenu, setAnchorMenu] = useState(null);

  function handleClick(event) {
    const ref = event.currentTarget;
    setAnchorMenu(ref);
  }

  function handleClose() {
    setAnchorMenu(null);
  }

  function goToUserDetails() {
    if (!sender || sender._id) callToast(info('Usuário não localizado'));
    window.open(`/users/${sender._id}`, '_self');
  }

  return (
    <BoxMessageAdmin fromadmin={answer.adminId || answer.pending}>
      { sender
        && (
          <Box width="100%" display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" overflow="hidden">
              { sender.name.length >= 15
                && (
                <BoxAnswerIdentifier component="span" variant="body2">
                  {sender.name || 'Usuário não autenticado'}
                </BoxAnswerIdentifier>
                )
              }
              { sender.name.length < 15
                && (
                  <Typography component="span" variant="body2">
                    {sender.name || 'Usuário não autenticado'}
                  </Typography>
                )
              }
              &nbsp;&nbsp;
              <BoxAnswerIdentifier component="span" variant="body2">
                {sender.email}
              </BoxAnswerIdentifier>
            </Box>
            <BoxAnswerButton onClick={handleClick}>
              <Icon>
                keyboard_arrow_down
              </Icon>
            </BoxAnswerButton>
          </Box>
        )
      }
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
      <Menu
        anchorEl={anchorMenu}
        open={Boolean(anchorMenu)}
        keepMounted
        onClose={handleClose}
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
        <MenuItem onClick={goToUserDetails}>
          <Typography component="span" variant="body1">
            Abrir perfil do usuário
          </Typography>
        </MenuItem>
      </Menu>
    </BoxMessageAdmin>
  );
}

const mapStateToProps = (state) => ({ toast: state.config });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(TicketAnswer);
