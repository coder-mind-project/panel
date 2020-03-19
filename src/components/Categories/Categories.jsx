import React, { useState, useEffect } from 'react';
import { userType } from '@/types';
import {
  Container,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
  TablePagination,
  Paper,
  Box,
  LinearProgress,
  CircularProgress,
  Typography,
} from '@material-ui/core';

import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { scrollToTop } from '@/config/ScrollToTop';

import CustomButton from '@/components/Buttons/Button.jsx';
import CustomIconButton from '@/components/Buttons/IconButton.jsx';
import Header from '@/components/Header.jsx';
import DataNotFound from '@/components/NotFound/DataNotFound.jsx';


import { backendUrl } from '@/config/backend';
import {
  OPTIONS_LIMIT,
  DEFAULT_LIMIT,
  LIMIT_LABEL,
  DISPLAYED_ROWS,
} from '@/config/dataProperties';

import { callToast as toastEmitter } from '@/redux/toast/toastActions';
import Form from './Form';
import RemoveConfirmation from './RemoveConfirmation';

import {
  HudButtons,
  HudSearchBar,
  HudLink,
  TableIcon,
  TableWrapper,
} from './styles';

function Categories(props) {
  const {
    user,
  } = props;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [error, setError] = useState(false);
  const [categorySelected, setCategorySelected] = useState({});
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
      setCategorySelected({});
      setReload(succeeded);
    }

    setOpenForm(isOpen);
  }

  function handleOpenRemoveConfirm(isOpen = false, stack = null) {
    if (loading) return;

    if (!isOpen) {
      setCategorySelected({});

      if (stack && stack.removed) {
        if (stack.newPage) {
          setPage(stack.newPage);
        }
        setReload(true);
      }
    }
    setOpenRemoveConfirm(isOpen);
  }

  function selectCategory(newCategory, reason) {
    switch (reason) {
      case 'remove': {
        handleOpenRemoveConfirm(true);
        break;
      }
      default: {
        handleOpenForm(true);
      }
    }
    setCategorySelected(newCategory);
  }

  async function defineLimit(event) {
    const newLimit = parseInt(event.target.value, 10);

    setLimit(newLimit);
    setReload(true);
  }


  useEffect(() => {
    async function searchCategories() {
      const url = `${backendUrl}/categories?page=${page}&query=${query}&limit=${limit}`;
      setLoading(true);
      await axios(url)
        .then(async (res) => {
          setCategories(res.data.categories);
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
      searchCategories();
    }
  }, [page, query, limit, loading, error, categories, reload]);

  return (
    <Container id="component">
      <Header title="Categorias" description="Categorias para artigos" icon="category" />
      <Form
        open={openForm}
        onClose={(succeeded) => handleOpenForm(false, succeeded)}
        propCategory={categorySelected}
      />
      <RemoveConfirmation
        open={openRemoveConfirm}
        propCategory={categorySelected}
        categoriesQuantity={categories.length}
        onClose={(stack) => handleOpenRemoveConfirm(false, stack)}
        page={page}
      />
      <Box mb={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" width="100%">
          <HudButtons>
            { user.tagAdmin
              && (
              <CustomButton
                color="primary"
                icon="add_circle_outline"
                onClick={() => handleOpenForm(true)}
              />
              )
            }
            { user.tagAdmin
              && (
                <HudLink to="/management">
                  <CustomButton
                    color="default"
                    icon="settings"
                    fullWidth
                  />
                </HudLink>
              )
            }
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
      {loading && categories.length === 0 && (
        <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="300px">
          <CircularProgress color="primary" size={80} />
        </Box>
      )}
      {!loading && categories.length === 0 && (
        <DataNotFound msg="Nenhuma categoria encontrada" />
      )}
      <Paper>
        {loading && categories.length > 0 && <LinearProgress color="primary" />}
        {categories.length > 0 && (
        <TableWrapper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <TableIcon fontSize="small" color="action">
                      category
                    </TableIcon>
                    <Typography component="span" variant="body1">
                      Categoria
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <TableIcon fontSize="small" color="action">
                      bookmark_border
                    </TableIcon>
                    <Typography component="span" variant="body1">
                      Alias
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <TableIcon fontSize="small" color="action">
                      bookmark
                    </TableIcon>
                    <Typography component="span" variant="body1">
                      Tema
                    </Typography>
                  </Box>
                </TableCell>
                {user.tagAdmin && (
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
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((elem) => (
                <TableRow key={elem._id}>
                  <TableCell scope="name">
                    {elem.name}
                  </TableCell>
                  <TableCell scope="alias">
                    {elem.alias}
                  </TableCell>
                  <TableCell scope="theme">
                    {elem.theme ? elem.theme.name : ''}
                  </TableCell>
                  {user.tagAdmin && (
                  <TableCell scope="_id">
                    <CustomIconButton
                      icon="edit"
                      color="primary"
                      tooltip={<Typography component="span" variant="body2">Editar</Typography>}
                      onClick={() => selectCategory(elem, 'edit')}
                    />
                    <CustomIconButton
                      icon="delete_forever"
                      color="secondary"
                      tooltip={<Typography component="span" variant="body2">Remover</Typography>}
                      onClick={() => selectCategory(elem, 'remove')}
                    />
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
                  onChangePage={changePage}
                  onChangeRowsPerPage={defineLimit}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableWrapper>
        )}
      </Paper>
    </Container>
  );
}

Categories.propTypes = {
  user: userType.isRequired,
};

const mapStateToProps = (state) => ({ user: state.user, toast: state.config });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Categories);
