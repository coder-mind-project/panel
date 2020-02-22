import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Button,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Icon,
  Box,
} from '@material-ui/core';

import { Redirect, Link } from 'react-router-dom';
import SearchBar from 'material-ui-search-bar';

import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CustomButton from '../../../components/Button';
import CustomIconButton from '../../../components/IconButton';
import Header from '../../../components/Header';
import Searching from '../../../assets/loading.gif';

import { backendUrl, defineErrorMsg } from '../../../config/backend';
import {
  OPTIONS_LIMIT,
  DEFAULT_LIMIT,
  LIMIT_LABEL,
  DISPLAYED_ROWS,
} from '../../../config/dataProperties';

import { callToast as toastEmitter } from '../../../redux/toastActions';
import { success, error as toastError } from '../../../config/toasts';

function Themes(props) {
  const { callToast, user } = { ...props };

  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [error, setError] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [loadingOp, setLoadingOp] = useState(false);
  const [redirectTo, setRedirectTo] = useState('');
  const [themeSelected, setThemeSelected] = useState(null);
  const [reload, setReload] = useState(true);

  function changeQueryValue(term) {
    setQuery(term);
    setPage(1);
    setReload(true);
  }

  async function remove() {
    setLoadingOp(true);
    const id = themeSelected._id;
    const url = `${backendUrl}/themes/${id}`;

    await axios
      .delete(url)
      .then(() => {
        callToast(success('Operação realizada com sucesso'));
      })
      .catch(async (err) => {
        const msg = await defineErrorMsg(err);
        callToast(toastError(msg));
      });
    setLoadingOp(false);
    setDialog(false);
    setReload(true);
  }

  function goTo(path) {
    return () => {
      setRedirectTo(`/${path}`);
    };
  }

  function selectTheme(theme) {
    return () => {
      setDialog(true);
      setThemeSelected(theme);
    };
  }

  function toogleDialog(option) {
    setDialog(!!option);
  }

  async function changePage(event, p) {
    setPage(p + 1);
    setReload(true);
  }

  async function defineLimit(event) {
    const newLimit = parseInt(event.target.value, 10);

    setLimit(newLimit);
    setReload(true);
  }

  useEffect(() => {
    async function searchThemes() {
      const url = `${backendUrl}/themes?page=${page}&query=${query}&limit=${limit}`;
      setLoading(true);
      setThemes([]);
      await axios(url)
        .then(async (res) => {
          await setThemes(res.data.themes);
          setCount(res.data.count);
          setLimit(res.data.limit);
          setError(false);
        })
        .catch(() => {
          setError(true);
        });

      setLoading(false);
    }

    if (reload) {
      setReload(false);
      searchThemes();
    }
  }, [page, query, limit, loading, error, themes, reload]);

  return (
    <Container id="component">
      {redirectTo && <Redirect to={redirectTo} />}
      <Header title="Temas" description="Temas para artigos" icon="bookmark" />
      <Container className="hudBar">
        <Grid item className="hudBarChild">
          {user.tagAdmin && (
            <Box mr={1} className="linkButton">
              <Link to="/theme" className="linkRouter linkButton">
                <CustomButton color="default" text="Novo Tema" icon="add_circle_outline" />
              </Link>
            </Box>
          )}
          {user.tagAdmin && (
            <Box mr={1} className="linkButton">
              <Link to="/management" className="linkRouter linkButton">
                <CustomButton color="gray" text="Configurações" icon="settings" />
              </Link>
            </Box>
          )}
        </Grid>
        <Grid item className="hudBarChild">
          <SearchBar
            id="search_field"
            className="searchTextField"
            placeholder="Pesquisar"
            value={query}
            onChange={(term) => changeQueryValue(term)}
            onCancelSearch={() => changeQueryValue('')}
          />
        </Grid>
      </Container>
      {loading && (
        <Container className="center spinnerContainer">
          <img src={Searching} alt="Procurando temas" />
          <h4>Carregando, por favor aguarde...</h4>
        </Container>
      )}
      {!loading && themes.length === 0 && (
        <Container className="center">
          <p className="defaultFontColor">Ops, Nenhum resultado encontrado</p>
        </Container>
      )}
      {themes.length > 0 && !loading && (
        <Paper>
          <Container className="wrapper">
            <Table className="defaultTable">
              {/* Header da tabela */}
              <TableHead>
                <TableRow>
                  <TableCell>
                    <span className="centerVertical">
                      <Icon fontSize="small" className="marginRight">
                        bookmark
                      </Icon>
                      Tema
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="centerVertical">
                      <Icon fontSize="small" className="marginRight">
                        bookmark_border
                      </Icon>
                      Alias
                    </span>
                  </TableCell>
                  {user.tagAdmin && (
                    <TableCell>
                      <span className="centerVertical">
                        <Icon fontSize="small" className="marginRight">
                          build
                        </Icon>
                        Ações
                      </span>
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Geração dos registros na tabela  */}
                {themes.map((theme) => (
                  <TableRow key={theme._id}>
                    <TableCell scope="name">{theme.name}</TableCell>
                    <TableCell scope="alias">{theme.alias}</TableCell>
                    {user.tagAdmin && (
                      <TableCell scope="_id">
                        <CustomIconButton icon="edit" color="default" aria-label="Editar" tooltip="Editar" onClick={goTo(`theme/${theme._id}`)} />
                        <CustomIconButton icon="delete_forever" color="danger" aria-label="Delete" tooltip="Remover" onClick={selectTheme(theme)} />
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
              {/* Footer da tabela */}
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
            {/* Remover dialog */}
            <Dialog open={dialog} onClose={() => toogleDialog(false)} aria-labelledby="title" aria-describedby="are_you_sure">
              <DialogTitle id="title">{loadingOp ? 'Removendo' : 'Excluir usuário'}</DialogTitle>
              <DialogContent>
                <Container>
                  {!loadingOp && <DialogContentText id="are_you_sure">Tem certeza que deseja remover este tema?</DialogContentText>}
                  {loadingOp && <DialogContentText id="description">Removendo tema, por favor aguarde...</DialogContentText>}
                </Container>
              </DialogContent>
              <DialogActions>
                {!loadingOp && (
                  <Button color="secondary" onClick={() => toogleDialog(false)}>
                    Fechar
                  </Button>
                )}
                {!loadingOp && (
                  <Button color="secondary" onClick={() => remove(themeSelected)}>
                    Sim, pode excluir
                  </Button>
                )}
              </DialogActions>
            </Dialog>
          </Container>
        </Paper>
      )}
    </Container>
  );
}

const mapStateToProps = (state) => ({ user: state.user, toast: state.config });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Themes);
