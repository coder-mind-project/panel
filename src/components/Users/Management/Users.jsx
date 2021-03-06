import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { userType, appTheme } from '@/types';

import {
  Container,
  TableHead,
  TableRow,
  TableCell,
  Table,
  TableBody,
  TableFooter,
  TablePagination,
  Paper,
  Box,
  LinearProgress,
  Typography,
  IconButton,
  Icon,
} from '@material-ui/core';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import axios from 'axios';

import {
  OPTIONS_LIMIT,
  DEFAULT_LIMIT,
  LIMIT_LABEL,
  DISPLAYED_ROWS,
} from '@/config/dataProperties';

import { callToast as toastEmitter } from '@/redux/toast/toastActions';
import { info } from '@/config/toasts';

import { scrollToTop } from '@/shared/index';

import LoadingList from '@/components/LoadingList.jsx';
import CustomIconButton from '@/components/Buttons/IconButton.jsx';
import NotFound from '@/components/NotFound/DataNotFound.jsx';
import ErrorFromData from '@/components/Errors/ErrorFromData.jsx';
import CustomButton from '@/components/Buttons/Button.jsx';
import CustomChip from '@/components/Chip.jsx';
import Header from '@/components/Header.jsx';
import RemovedUsers from '@/components/Users/Management/RemovedUsers.jsx';
import DialogConfirmAdminPassword from './DialogConfirmAdminPassword';
import DialogConfirmRemoveUser from './DialogConfirmRemoveUser';

import {
  HudLink,
  HudSearchBar,
  HudButtons,
  TableIcon,
  TableOrder,
  TableWrapper,
  CustomLink,
} from './styles';

function Users(props) {
  const {
    user,
    callToast,
    theme,
  } = props;

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [query, setQuery] = useState('');
  const [order, setOrder] = useState('desc');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userSelected, setUserSelected] = useState({});
  const [validateDialog, setValidateDialog] = useState(false);
  const [removedUsersDialog, setRemovedUsersDialog] = useState(false);
  const [confirmRemoveUserDialog, setConfirmRemoveUserDialog] = useState(false);
  const [reload, setReload] = useState(true);

  async function changeQueryValue(term) {
    setQuery(term);
    setPage(1);
    setReload(true);
  }

  function changePage(event, newPage) {
    const p = newPage + 1;
    setPage(p);
    setReload(true);
  }

  function defineLimit(event) {
    const { value } = event.target;
    setLimit(value);

    setReload(true);
  }

  function showRemovedUsersDialog() {
    setRemovedUsersDialog(true);
  }

  function hideRemovedUsersDialog(event) {
    const { needsReload } = event;

    if (needsReload) setReload(true);
    setRemovedUsersDialog(false);
  }

  function showValidadeDialog() {
    setValidateDialog(true);
  }

  function hideValidadeDialog(event) {
    setValidateDialog(false);
    const { authorized } = event;

    if (authorized) {
      showRemovedUsersDialog();
    }
  }

  function showConfirmRemoveUserDialog(userNotYetSelected) {
    if (loading) return;

    // The User logged is trying remove their own account
    if (userNotYetSelected._id === user._id) {
      callToast(info("Para remover sua conta acesse a opção 'Meus dados' e 'Configurações'"));
      return;
    }
    setUserSelected(userNotYetSelected);
    setConfirmRemoveUserDialog(true);
  }

  function hideConfirmRemoveUserDialog(event) {
    const { removed } = event;
    if (removed) {
      if (page > 1 && users.length === 1) {
        setPage(page - 1);
      }

      setReload(true);
    }
    setConfirmRemoveUserDialog(false);
  }

  function changeOrder() {
    const newOrder = order === 'asc' ? 'desc' : 'asc';
    setOrder(newOrder);
    scrollToTop();
    setReload(true);
  }

  useEffect(() => {
    async function searchUsers() {
      const url = `/users?page=${page}&query=${query}&limit=${limit}&order=${order}`;
      setLoading(true);
      await axios(url).then((res) => {
        setUsers(res.data.users);
        setCount(res.data.count);
        setLimit(res.data.limit);
      }).catch(() => {
        setError(true);
      });

      setLoading(false);
    }

    if (reload) {
      scrollToTop();
      setError(false);
      setReload(false);
      searchUsers();
    }
  }, [reload, users, count, limit, error, page, query, order]);

  return (
    <Container className="page">
      <Header
        title="Usuários"
        description="Usuários do painel"
        icon="people"
      />
      <DialogConfirmAdminPassword
        open={validateDialog}
        closeDialog={hideValidadeDialog}
      />
      <DialogConfirmRemoveUser
        open={confirmRemoveUserDialog}
        closeDialog={hideConfirmRemoveUserDialog}
        user={userSelected}
      />
      <RemovedUsers
        open={removedUsersDialog}
        closeDialog={hideRemovedUsersDialog}
      />
      <Box mb={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" width="100%">
          <HudButtons>
            <HudLink to="/user">
              <CustomButton
                color="primary"
                icon="add_circle_outline"
                fullWidth
              />
            </HudLink>
            <CustomButton
              color="secondary"
              icon="restore_from_trash"
              onClick={showValidadeDialog}
            />
            <HudLink to="/management">
              <CustomButton
                color="default"
                icon="settings"
                fullWidth
              />
            </HudLink>
          </HudButtons>
          <HudSearchBar
            id="search_field"
            fullWidth
            placeholder="Pesquisar"
            value={query}
            onChange={(q) => changeQueryValue(q)}
            onCancelSearch={() => changeQueryValue('')}
          />
        </Box>
      </Box>
      {loading && users.length === 0
        && <LoadingList />
      }
      {!loading && !error && users.length === 0
        && (
          <NotFound msg="Ops, Nenhum usuário encontrado" />
        )
      }
      { error
        && (
          <ErrorFromData
            msg="Ops, ocorreu um erro ao obter os usuários"
            reload={() => setReload(true)}
          />
        )
      }
      <Paper>
        { users.length > 0 && loading && <LinearProgress />}
        { users.length > 0 && !error
            && (
            <TableWrapper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableOrder theme={theme}>
                      <Box display="flex" alignItems="center">
                        <Typography component="p" variant="body2">
                          Ordem:
                        </Typography>
                        <Box ml={1}>
                          <IconButton onClick={changeOrder} size="small">
                            <Icon color="action">
                              {order === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                            </Icon>
                          </IconButton>
                        </Box>
                      </Box>
                    </TableOrder>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <TableIcon fontSize="small" color="action">
                          person
                        </TableIcon>
                        <Typography component="span" variant="body1">
                          Nome
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <TableIcon fontSize="small" color="action">
                          alternate_email
                        </TableIcon>
                        <Typography component="span" variant="body1">
                          E-mail
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <TableIcon fontSize="small" color="action">
                          bookmarks
                        </TableIcon>
                        <Typography component="span" variant="body1">
                          Perfil
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <TableIcon fontSize="small" color="action">
                          build
                        </TableIcon>
                        <Typography component="span" variant="body1">
                          Ações
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((elem) => (
                    <TableRow key={elem._id} hover>
                      <TableCell scope="name">
                        {elem.name}
                      </TableCell>
                      <TableCell scope="email">
                        {elem.email}
                      </TableCell>
                      <TableCell scope="tagAdmin">
                        <CustomChip
                          size="small"
                          color={elem.tagAdmin ? 'primary' : 'default'}
                          sizeIcon="small"
                          icon={elem.tagAdmin ? 'supervisor_account' : 'person'}
                          text={elem.tagAdmin ? 'Administrador' : 'Autor'}
                        />
                      </TableCell>
                      <TableCell scope="_id">
                        <CustomLink to={`/user/${elem._id}`}>
                          <CustomIconButton
                            icon="edit"
                            color={theme === 'dark' ? 'inherit' : 'primary'}
                            tooltip={<Typography component="span" variant="body2">Editar</Typography>}
                          />
                        </CustomLink>
                        <CustomIconButton
                          icon="delete_forever"
                          tooltip={<Typography component="span" variant="body2">Remover</Typography>}
                          onClick={() => showConfirmRemoveUserDialog(elem)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={OPTIONS_LIMIT}
                      colSpan={4}
                      count={count}
                      rowsPerPage={limit}
                      labelRowsPerPage={LIMIT_LABEL}
                      labelDisplayedRows={DISPLAYED_ROWS}
                      page={page - 1}
                      onChangePage={changePage}

                      onChangeRowsPerPage={defineLimit}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableWrapper>
            )
        }
      </Paper>
    </Container>
  );
}

Users.propTypes = {
  user: userType.isRequired,
  callToast: PropTypes.func.isRequired,
  theme: appTheme.isRequired,
};

const mapStateToProps = (state) => ({ user: state.user, toast: state.config, theme: state.theme });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Users);
