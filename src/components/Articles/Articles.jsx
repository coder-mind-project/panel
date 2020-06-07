import React, { useState, useEffect } from 'react';
import { userType } from '@/types';
import { useDebounce } from '@/hooks';

import { Container } from '@material-ui/core';

import { OPTIONS_LIMIT, DEFAULT_LIMIT } from '@/config/dataProperties';
import { scrollToTop } from '@/shared/index';

import axios from 'axios';
import { connect } from 'react-redux';

import MaterialTable from 'material-table';

import Header from '@/components/Header.jsx';
import NotFound from '@/components/NotFound/DataNotFound.jsx';
import Chip from '@/components/Chip.jsx';
import ArticleHeaderTableCell from './ArticleHeaderTableCell';

function Articles(props) {
  const { user } = props;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [articles, setArticles] = useState([]);
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(true);

  const debouncedQuery = useDebounce(query, 300);

  function getArticleState(article) {
    let state;
    let icon;
    let color;

    switch (article.state) {
      case 'published': {
        state = 'Publicado';
        icon = 'public';
        color = 'primary';
        break;
      }
      case 'inactivated': {
        state = 'Inativo';
        icon = 'public_off';
        color = 'default';
        break;
      }
      case 'boosted': {
        state = 'Impulsionado';
        icon = 'star_rate';
        color = 'primary';
        break;
      }
      case 'Removed': {
        state = 'Removido';
        icon = 'delete';
        color = 'secondary';
        break;
      }
      default: {
        state = 'Rascunho';
        icon = 'drafts';
        color = 'default';
      }
    }

    return { state, icon, color };
  }

  function getArticleListColumns() {
    const authorColumns = [
      {
        title: <ArticleHeaderTableCell icon="article" label="Artigo" />,
        field: 'title',
      },
      {
        title: <ArticleHeaderTableCell icon="label" label="Status" />,
        field: 'state',
      },
      {
        title: <ArticleHeaderTableCell icon="bookmark" label="Tema" />,
        field: 'theme.name',
      },
      {
        title: <ArticleHeaderTableCell icon="category" label="Categoria" />,
        field: 'category.name',
      },
    ];
    const adminColumns = [
      {
        title: <ArticleHeaderTableCell icon="article" label="Artigo" />,
        field: 'title',
      },
      {
        title: <ArticleHeaderTableCell icon="person" label="Autor" />,
        field: 'author.name',
      },
      {
        title: <ArticleHeaderTableCell icon="label" label="Status" />,
        field: 'state',
        render: (rowData) => {
          const { state, color, icon } = getArticleState(rowData);
          return (<Chip className="cm-chip" text={state} icon={icon} color={color} size="small" sizeIcon="small" />);
        },
      },
      {
        title: <ArticleHeaderTableCell icon="bookmark" label="Tema" />,
        field: 'theme.name',
      },
      {
        title: <ArticleHeaderTableCell icon="category" label="Categoria" />,
        field: 'category.name',
      },
    ];

    return user.tagAdmin ? adminColumns : authorColumns;
  }

  function createArticle() {
    console.log('creating article');
  }

  function changePage(futurePage) {
    setPage(futurePage + 1);
    setReload(true);
  }

  function getBySearch(q) {
    setQuery(q);
    if (debouncedQuery) {
      setPage(1);
      setReload(true);
    }
  }

  function removeArticles(articlesToRemove) {
    console.log(articlesToRemove);
  }

  function openArticle(article) {
    console.log(article);
  }

  useEffect(() => {
    const source = axios.CancelToken.source();

    async function getArticles() {
      try {
        const url = `/articles?query=${query}&page=${page}&limit=${limit}&op=all`;
        setLoading(true);

        await axios(url, { cancelToken: source.token }).then((res) => {
          setReload(false);

          setArticles(res.data.articles);
          setError(res.data.error);
          setCount(res.data.count);
          setLimit(res.data.limit);
        });

        setLoading(false);
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError(true);
        }
      }
    }

    if (reload) {
      scrollToTop();
      getArticles();
    }
    return () => source.cancel();
  }, [articles, loading, count, page, limit, reload, error, query]);

  return (
    <Container id="component">
      <Header
        title="Artigos"
        description="Consulte, altere e crie novos artigos"
        icon="article"
      />
      <Container>
        <MaterialTable
          columns={getArticleListColumns()}
          data={articles}
          totalCount={count}
          isLoading={loading}
          page={page - 1}
          onChangeRowsPerPage={changePage}
          onChangePage={changePage}
          onSearchChange={getBySearch}
          showFirstLastPageButtons={false}
          too
          options={{
            selection: true,
            showTitle: false,
            showTextRowsSelected: false,
            pageSize: DEFAULT_LIMIT,
            pageSizeOptions: OPTIONS_LIMIT,
            toolbarButtonAlignment: 'left',
            selectionProps: {
              color: 'primary',
            },
            headerStyle: {
              zIndex: 1,
            },
          }}
          localization={{
            body: {
              emptyDataSourceMessage: (<NotFound msg="Ops! Nenhum artigo encontrado" disableboxshadow />),
            },
            toolbar: {
              searchPlaceholder: 'Titulo ou descrição',
            },
            pagination: {
              lastTooltip: 'Última página',
              firstTooltip: 'Primeira página',
              previousTooltip: 'Página anterior',
              nextTooltip: 'Próxima página',
              labelRowsSelect: 'Linhas',
            },
          }}
          onRowClick={((evt, selectedRow) => openArticle(selectedRow))}
          actions={[
            {
              tooltip: 'Novo artigo',
              icon: 'add_circle',
              onClick: createArticle,
              position: 'toolbar',
            },
            {
              tooltip: 'Remover artigos', icon: 'delete', onClick: (evt, data) => removeArticles(data), position: 'toolbarOnSelect',
            },
          ]}
        />
      </Container>
    </Container>
  );
}

Articles.propTypes = {
  user: userType.isRequired,
};

const mapStateToProps = (state) => ({ user: state.user });

export default connect(mapStateToProps)(Articles);
