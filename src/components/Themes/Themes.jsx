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
  Icon,
  Box,
  LinearProgress,
  CircularProgress,
} from '@material-ui/core';


import { Link } from 'react-router-dom';
import SearchBar from 'material-ui-search-bar';

import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { scrollToTop } from '../../config/ScrollToTop';
import CustomButton from '../Button';
import CustomIconButton from '../IconButton';
import Header from '../Header';
import Form from './Form';
import RemoveConfirmation from './RemoveConfirmation';

import { backendUrl } from '../../config/backend';
import {
  OPTIONS_LIMIT,
  DEFAULT_LIMIT,
  LIMIT_LABEL,
  DISPLAYED_ROWS,
} from '../../config/dataProperties';

import { callToast as toastEmitter } from '../../redux/toastActions';

function Themes(props) {
  const { user } = { ...props };

  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [error, setError] = useState(false);
  const [themeSelected, setThemeSelected] = useState(null);
  const [reload, setReload] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [openRemoveConfirm, setOpenRemoveConfirm] = useState(false);

  function changeQueryValue(term) {
    setQuery(term);
    setPage(1);
    setReload(true);
  }

  async function changePage(event, p) {
    setPage(p + 1);
    setReload(true);
    scrollToTop();
  }

  function handleOpenForm(isOpen = false, succeeded = false) {
    if (loading) return;

    if (!isOpen) {
      setThemeSelected(null);
      setReload(succeeded);
    }

    setOpenForm(isOpen);
  }

  function handleOpenRemoveConfirm(isOpen = false, newPage = false) {
    if (loading) return;

    if (!isOpen) {
      setThemeSelected(null);

      if (newPage) {
        setPage(newPage);
      }

      setReload(true);
    }
    setOpenRemoveConfirm(isOpen);
  }

  function selectTheme(theme, reason) {
    return () => {
      switch (reason) {
        case 'remove': {
          handleOpenRemoveConfirm(true);
          break;
        }
        default: {
          handleOpenForm(true);
        }
      }
      setThemeSelected(theme);
    };
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
      await axios(url)
        .then(async (res) => {
          setThemes(res.data.themes);
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
    <Box id="component">
      <Header title="Temas" description="Temas para artigos" icon="bookmark" />
      <Form
        open={openForm}
        onClose={(succeeded) => handleOpenForm(false, succeeded)}
        propTheme={themeSelected}
      />
      <RemoveConfirmation
        open={openRemoveConfirm}
        onClose={(newPage) => handleOpenRemoveConfirm(false, newPage)}
        propTheme={themeSelected}
        page={page}
      />
      <Container className="hudBar">
        <Grid item className="hudBarChild">
          {user.tagAdmin && (
          <Box mr={1} className="linkButton">
            <Link to="/management" className="linkRouter linkButton">
              <CustomButton color="gray" text="Configurações" icon="settings" />
            </Link>
          </Box>
          )}
          {user.tagAdmin && (
            <Box mr={1} className="linkButton">
              <CustomButton color="default" text="Novo Tema" icon="add_circle_outline" onClick={() => handleOpenForm(true)} />
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
      {loading && themes.length === 0 && (
        <Container className="center spinnerContainer">
          <CircularProgress color="secondary" size={80} />
        </Container>
      )}
      {!loading && themes.length === 0 && (
        <Container className="center">
          <p className="defaultFontColor">Ops, Nenhum resultado encontrado</p>
        </Container>
      )}
      <Paper>
        {loading && themes.length > 0 && <LinearProgress color="secondary" />}
        {themes.length > 0 && (
        <Container className="wrapper">
          <Table className="defaultTable">
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
              {themes.map((theme) => (
                <TableRow key={theme._id}>
                  <TableCell scope="name">{theme.name}</TableCell>
                  <TableCell scope="alias">{theme.alias}</TableCell>
                  {user.tagAdmin && (
                  <TableCell scope="_id">
                    <CustomIconButton icon="edit" color="default" aria-label="Editar" tooltip="Editar" onClick={selectTheme(theme, 'edit')} />
                    <CustomIconButton icon="delete_forever" color="danger" aria-label="Delete" tooltip="Remover" onClick={selectTheme(theme, 'remove')} />
                  </TableCell>
                  )}
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
        </Container>
        )}
      </Paper>
    </Box>
  );
}

const mapStateToProps = (state) => ({ user: state.user, toast: state.config });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Themes);
