import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
  TablePagination,
  Paper,
  Box,
  Button,
  Tooltip,
  Typography,
  IconButton,
  Badge,
  Icon,
  CircularProgress,
  LinearProgress,
} from '@material-ui/core';

import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';

import axios from 'axios';
import { backendUrl } from '@/config/backend';
import { scrollToTop } from '@/config/ScrollToTop';

import FloatingButton from '@/components/Buttons/FloatingButton.jsx';
import CustomButton from '@/components/Buttons/Button.jsx';
import CustomIconButton from '@/components/Buttons/IconButton.jsx';
import Header from '@/components/Header.jsx';

import {
  OPTIONS_LIMIT,
  DEFAULT_LIMIT,
  LIMIT_LABEL,
  DISPLAYED_ROWS,
} from '@/config/dataProperties';
import { displayFullDate } from '@/config/masks';

import ViewTicket from './ViewTicket';
import Filter from './Filter';

import { TableIcon } from './styles';


function Tickets(props) {
  const { user } = { ...props };

  const [tickets, setTickets] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [error, setError] = useState(false);
  const [ticketDialog, setTicketDialog] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [ticketSelected, setTicketSelected] = useState({
    content: {},
    user: {},
    admin: {},
  });
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState(null);
  const [loading, setLoading] = useState(false);
  const [redirectTo, setRedirectTo] = useState('');
  const [reload, setReload] = useState(true);


  function prepareForSearchWithFilters(newFilters) {
    const filter = {
      tid: newFilters.ticket,
      type: newFilters.type !== 'n/d' ? newFilters.type : '',
      begin: newFilters.begin || '',
      end: newFilters.end || '',
      order: newFilters.order,
    };

    setPage(1);
    setFilters(filter);
    setReload(true);
  }

  function defineType(type) {
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
  }

  function toogleTicketDialog(option = false, ticket, toAnswer = false) {
    setTicketDialog(Boolean(option));
    setTicketSelected(option ? ticket : {
      content: {},
      user: {},
      admin: {},
    });

    setShowAnswers(Boolean(toAnswer));
  }

  async function changePage(event, newPage) {
    setPage(newPage + 1);
    setReload(true);
  }

  async function defineLimit(event) {
    const newLimit = event.target.value;
    setLimit(newLimit);
    setReload(true);
  }

  async function updateTicket(ticket) {
    const updatedTickets = await tickets.map((elem) => {
      const element = elem;

      if (element._id === ticket._id) {
        element.content = ticket;
      }

      return element;
    });

    setTickets(updatedTickets);
  }

  useEffect(() => {
    if (!user || !user.tagAdmin) setRedirectTo('articles');

    async function searchTickets() {
      const url = filters ? `${backendUrl}/tickets?page=${page}&limit=${limit}&tid=${filters.tid}&type=${filters.type}&begin=${filters.begin}&end=${filters.end}&order=${filters.order}` : `${backendUrl}/tickets?page=${page}&limit=${limit}`;

      setLoading(true);
      await axios(url).then((res) => {
        setTickets(res.data.tickets);
        setCount(res.data.count);
        setLimit(res.data.limit);
        setError(false);
      }).catch(() => {
        setError(true);
      });
      setLoading(false);
    }

    if (reload) {
      setReload(false);
      searchTickets();
    }
  },
  [
    reload,
    user,
    filters,
    loading,
    tickets,
    count,
    limit,
    error,
    page,
  ]);

  return (
    <Container id="component">
      {redirectTo
          && <Redirect to={`/${redirectTo}`} />
      }
      <Header
        title="Tickets"
        description="Visualize e responda tickets de atendimento aos autores da plataforma"
        icon="email"
      />
      <FloatingButton action={scrollToTop} />
      <Container className="hudBar">
        <Grid item className="hudBarChild">
          <Box mr={1} className="linkButton">
            <Link to="/management" className="linkRouter linkButton">
              <CustomButton
                color="default"
                text="Configurações"
                icon="settings"
              />
            </Link>
          </Box>
          <Box mr={1} className="linkButton">
            <CustomButton
              text="Filtros"
              icon={showFilter ? 'clear' : 'filter_list'}
              onClick={() => setShowFilter(true)}
            />
          </Box>
        </Grid>
      </Container>
      <Filter
        showFilter={showFilter}
        emitSearchByFilters={(newFilters) => prepareForSearchWithFilters(newFilters)}
        isLoading={loading}
        closeFilter={() => setShowFilter(false)}
      />
      {loading && tickets.length === 0
          && (
            <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="35vh">
              <CircularProgress size={60} color="primary" />
            </Box>
          )
      }
      {!loading && tickets.length === 0
          && (
          <Box display="flex" flexWrap="wrap" alignItems="center" justifyContent="center" width="100%">
            <Icon>
              search
            </Icon>
            <Typography component="h5" variant="body1">
              Ops, Nenhum resultado encontrado
            </Typography>
          </Box>
          )
      }
      {loading && tickets.length > 0 && <LinearProgress color="primary" />}
      {tickets.length > 0
        && (
        <Paper>
          <Container className="wrapper">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>
                    <Box display="flex" alignItems="center" justifyContent="center">
                      <TableIcon fontSize="small" color="action">
                        calendar_today
                      </TableIcon>
                      <Typography component="span" variant="body1" align="center">
                        Data
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <TableIcon fontSize="small" color="action">
                        class
                      </TableIcon>
                      <Typography component="span" variant="body1" align="center">
                        Tipo
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <TableIcon fontSize="small" color="action">
                        email
                      </TableIcon>
                      <Typography component="span" variant="body1" align="center">
                        Ticket
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <TableIcon fontSize="small" color="action">
                        alternate_email
                      </TableIcon>
                      <Typography component="span" variant="body1" align="center">
                        Solicitante
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <TableIcon fontSize="small" color="action">
                        forum
                      </TableIcon>
                      <Typography component="span" variant="body1" align="center">
                        Respostas
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket._id}>
                    <TableCell scope="_id">
                      <Box display="flex" alignItems="center" justifyContent="center" flexWrap="wrap">
                        { !ticket.content.readed
                            && (
                              <CustomIconButton
                                icon="report"
                                color="secondary"
                                tooltip={(<Typography component="span" variant="body2">Ticket não lido</Typography>)}
                              />
                            )
                        }
                        { ticket.content.readed
                          && (
                            <CustomIconButton
                              icon="check_circle_outline"
                              color="primary"
                              aria-label="Ticket lido"
                              tooltip={(<Typography component="span" variant="body2">Ticket lido</Typography>)}
                            />
                          )
                        }
                      </Box>
                    </TableCell>
                    <TableCell scope="createdAt">
                      {displayFullDate(ticket.content.createdAt)}
                    </TableCell>
                    <TableCell scope="type">
                      {defineType(ticket.content.type)}
                    </TableCell>
                    <TableCell scope="_id">
                      <Tooltip title={(<span style={{ fontSize: '0.8rem' }}>Abrir ticket</span>)}>
                        <Button
                          variant="text"
                          color="primary"
                          onClick={() => toogleTicketDialog(true, ticket)}
                        >
                          {ticket._id}
                        </Button>
                      </Tooltip>
                    </TableCell>
                    <TableCell scope="email">
                      {ticket.content.email}
                    </TableCell>
                    <TableCell scope="responses">
                      <Tooltip
                        title={
                            (
                              <Typography component="p" variant="body2">
                                Responder
                              </Typography>
                            )
                        }
                      >
                        <IconButton
                          color="inherit"
                          onClick={() => toogleTicketDialog(true, ticket, true)}
                        >
                          <Badge
                            badgeContent={ticket.responses ? ticket.responses.length : 0}
                            max={99}
                            color="primary"
                          >
                            <Icon color="action">
                              comment
                            </Icon>
                          </Badge>
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={OPTIONS_LIMIT}
                    colSpan={3}
                    count={count}
                    rowsPerPage={limit}
                    labelRowsPerPage={LIMIT_LABEL}
                    labelDisplayedRows={DISPLAYED_ROWS}
                    page={page - 1}
                    SelectProps={{
                      inputProps: { 'aria-label': 'Limite' },
                    }}
                    onChangePage={changePage}

                    onChangeRowsPerPage={defineLimit}
                  />
                </TableRow>
              </TableFooter>
            </Table>
            { ticketDialog
                && (
                <ViewTicket
                  ticket={ticketSelected}
                  onClose={toogleTicketDialog}
                  defineType={defineType}
                  updateTicket={(ticket) => updateTicket(ticket)}
                  showAnswers={showAnswers}
                />
                )
            }
          </Container>
        </Paper>
        )
    }
    </Container>
  );
}

const mapStateToProps = (state) => ({ user: state.user });
export default connect(mapStateToProps)(Tickets);
