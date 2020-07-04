import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { appTheme, ticketType } from '@/types';

import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Container,
  DialogActions,
  Typography,
} from '@material-ui/core';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import axios from 'axios';

import { displayFullDate } from '@/config/masks';

import { callToast as toastEmitter } from '@/redux/toast/toastActions';

import TicketAnswers from './TicketAnswers';

import { CustomTextField } from './styles';

function ViewTicket(props) {
  const {
    onClose,
    ticket,
    defineType,
    updateTicket,
    showAnswers,
    theme,
  } = props;

  const [showResponseField, setShowResponseField] = useState(false);
  const [readed, setReaded] = useState(false);

  function defineDevice(device) {
    switch (device) {
      case 'computer': {
        return 'Computador';
      }
      case 'celphone - webapp': {
        return 'Celular - webapp';
      }
      default: {
        return 'N/D';
      }
    }
  }

  function defineSoftware(software) {
    switch (software) {
      case 'site': {
        return 'Site Coder Mind - www.codermind.com.br';
      }
      case 'panel': {
        return 'Painel Coder Mind - panel.codermind.com.br';
      }
      default: {
        return 'N/D';
      }
    }
  }

  function defineBrowser(browser) {
    switch (browser) {
      case 'google-chrome': {
        return 'Google Chrome';
      }
      case 'mozilla-firefox': {
        return 'Mozilla Firefox';
      }
      case 'microsoft-edge': {
        return 'Microsoft Edge';
      }
      case 'vivaldi': {
        return 'Vivaldi';
      }
      case 'opera': {
        return 'Opera Browser';
      }
      default: {
        return 'Outro';
      }
    }
  }

  function toogleResponse() {
    setShowResponseField(!showResponseField);
  }

  function close() {
    if (showResponseField) return;
    onClose();
  }

  useEffect(() => {
    function readTicket() {
      setReaded(true);
      if (ticket.content.readed) return;

      const url = `/tickets/${ticket._id}`;
      axios.patch(url).then((response) => {
        const updatedTicket = response.data;

        updateTicket(updatedTicket);
      });
    }

    if (!readed) readTicket();
  }, [ticket, updateTicket, readed]);

  useEffect(() => {
    function displayAnswers() {
      setShowResponseField(showAnswers);
    }

    displayAnswers();
  }, [showAnswers]);

  return (
    <Dialog
      open
      onClose={close}
      maxWidth="lg"
      disableBackdropClick={showResponseField}
      disableEscapeKeyDown={showResponseField}
      id="drawer-container"
      PaperProps={{
        style: {
          overflowX: 'hidden',
        },
      }}
    >
      <TicketAnswers ticket={ticket} open={showResponseField} close={toogleResponse} />
      <DialogTitle id="title">
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
          <Typography component="h1" variant="h6">
            Detalhes do ticket
            {' '}
            {ticket._id}
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="center">
            <Button variant={theme === 'dark' ? 'contained' : 'text'} color="primary" size="small" onClick={toogleResponse}>
              Responder
            </Button>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Container>
          <Box width="100%" display="flex" alignItems="center" flexWrap="wrap">
            <CustomTextField
              label="Ticket"
              value={ticket._id}
              disabled
              theme={theme}
              inputProps={{
                className: 'disabled-text-field',
              }}
              InputLabelProps={{
                className: 'disabled-text-field',
              }}
            />
            <CustomTextField
              label="Tipo de ticket"
              value={defineType(ticket.content.type)}
              disabled
              theme={theme}
              inputProps={{
                className: 'disabled-text-field',
              }}
              InputLabelProps={{
                className: 'disabled-text-field',
              }}
            />
            <CustomTextField
              label="E-mail de solicitação"
              value={ticket.content.email}
              disabled
              theme={theme}
              inputProps={{
                className: 'disabled-text-field',
              }}
              InputLabelProps={{
                className: 'disabled-text-field',
              }}
              margin="dense"
            />
            { ticket.content.type !== 'account-changed' && ticket.content.type !== 'simple-account-problem'
                  && (
                  <CustomTextField
                    label="Nome do usuário"
                    value={ticket.user.name}
                    disabled
                    theme={theme}
                    inputProps={{
                      className: 'disabled-text-field',
                    }}
                    InputLabelProps={{
                      className: 'disabled-text-field',
                    }}
                  />
                  )
              }
            { Boolean(ticket.content.type === 'account-changed' || ticket.content.type === 'simple-account-problem')
                  && (
                  <CustomTextField
                    label="Código do usuário"
                    value={ticket.user._id}
                    disabled
                    theme={theme}
                    inputProps={{
                      className: 'disabled-text-field',
                    }}
                    InputLabelProps={{
                      className: 'disabled-text-field',
                    }}
                  />
                  )
              }
            { Boolean(ticket.content.type === 'account-changed' || ticket.content.type === 'simple-account-problem')
                  && (
                  <CustomTextField
                    label="Código do administrador"
                    value={ticket.admin ? ticket.admin._id : 'Administrador não localizado'}
                    disabled
                    theme={theme}
                    inputProps={{
                      className: 'disabled-text-field',
                    }}
                    InputLabelProps={{
                      className: 'disabled-text-field',
                    }}
                  />
                  )
              }
            {ticket.content.dateOccurrence
                  && (
                  <CustomTextField
                    label="Data de ocorrência"
                    value={ticket.content.dateOccurrence ? displayFullDate(ticket.content.dateOccurrence) : ''}
                    disabled
                    theme={theme}
                    inputProps={{
                      className: 'disabled-text-field',
                    }}
                    InputLabelProps={{
                      className: 'disabled-text-field',
                    }}
                    FormHelperTextProps={{
                      className: 'disabled-text-field',
                    }}
                    helperText="Referente ao momento do acontecimento"
                  />
                  )
              }
            <CustomTextField
              label="Data de envio"
              value={ticket.content.createdAt ? displayFullDate(ticket.content.createdAt) : ''}
              disabled
              theme={theme}
              inputProps={{
                className: 'disabled-text-field',
              }}
              InputLabelProps={{
                className: 'disabled-text-field',
              }}
              FormHelperTextProps={{
                className: 'disabled-text-field',
              }}
              helperText="Momento que o ticket foi enviado"
            />
          </Box>
          { ticket.content.type === 'bug-report'
                && (
                <Box width="100%">
                  <Box width="100%">
                    <CustomTextField
                      label="Software"
                      value={defineSoftware(ticket.content.software)}
                      disabled
                      theme={theme}
                      inputProps={{
                        className: 'disabled-text-field',
                      }}
                      InputLabelProps={{
                        className: 'disabled-text-field',
                      }}
                      fullWidth
                    />
                  </Box>
                  <CustomTextField
                    label="Dispositivo"
                    value={defineDevice(ticket.content.device)}
                    disabled
                    theme={theme}
                    inputProps={{
                      className: 'disabled-text-field',
                    }}
                    InputLabelProps={{
                      className: 'disabled-text-field',
                    }}
                  />
                  { Boolean(ticket.content.device === 'computer' || ticket.content.device === 'celphone - webapp')
                        && (
                        <CustomTextField
                          label="Navegador"
                          value={defineBrowser(ticket.content.browser)}
                          disabled
                          theme={theme}
                          inputProps={{
                            className: 'disabled-text-field',
                          }}
                          InputLabelProps={{
                            className: 'disabled-text-field',
                          }}
                        />
                        )
                    }
                  { Boolean(ticket.content.device === 'computer' || ticket.content.device === 'celphone - webapp') && ticket.content.browser === 'other'
                        && (
                        <CustomTextField
                          label="Outro navegador"
                          value={ticket.content.anotherBrowser}
                          fullWidth
                          disabled
                          theme={theme}
                          inputProps={{
                            className: 'disabled-text-field',
                          }}
                          InputLabelProps={{
                            className: 'disabled-text-field',
                          }}
                        />
                        )
                    }
                </Box>
                )
            }
          <Box display="flex" alignItems="flex-start" flexWrap="wrap">
            <CustomTextField
              label="Descrição"
              value={ticket.content.msg}
              multiline
              rows="8"
              disabled
              theme={theme}
              inputProps={{
                className: 'disabled-text-field',
              }}
              InputLabelProps={{
                className: 'disabled-text-field',
              }}
              fullWidth
            />
          </Box>
        </Container>
      </DialogContent>
      <DialogActions>
        <Button
          variant={theme === 'dark' ? 'contained' : 'text'}
          color="primary"
          onClick={close}
          size="small"
        >
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ViewTicket.propTypes = {
  theme: appTheme.isRequired,
  ticket: ticketType.isRequired,
  onClose: PropTypes.func.isRequired,
  defineType: PropTypes.func.isRequired,
  updateTicket: PropTypes.func.isRequired,
  showAnswers: PropTypes.bool,
};

ViewTicket.defaultProps = {
  showAnswers: false,
};

const mapStateToProps = (state) => ({ toast: state.config, theme: state.theme });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ViewTicket);
