import React, { useState, useEffect } from 'react';

import {
  Container,
  Box,
  CircularProgress,
} from '@material-ui/core';

import InfiniteScroll from 'react-infinite-scroller';

import Header from '@/components/Header.jsx';
import DataNotFound from '@/components/NotFound/DataNotFound.jsx';

import axios from 'axios';
import { backendUrl } from '@/config/backend';

import HudCommentList from './HudCommentList';
import LoadingList from '../LoadingList';
import CommentCard from './CommentCard';
import CommentSettingsDialog from './CommentSettingsDialog';


function CommentList() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [count, setCount] = useState(0);
  const [type, setType] = useState('all');
  const [order, setOrder] = useState('desc');
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  function clearComments() {
    setComments([]);
    setCount(0);
    setPage(1);
  }

  function changeOrder(newOrder) {
    if (newOrder !== 'desc' && newOrder !== 'asc') return;
    clearComments();
    setOrder(newOrder);
    setReload(true);
  }

  function changeType(newType) {
    clearComments();
    setType(newType);
    setReload(true);
  }

  function reloadComments() {
    clearComments();
    setReload(true);
  }

  function updateReadComment(reason, comment = {}) {
    let updatedComments = comments;
    switch (type) {
      case 'not-readed': {
        updatedComments = comments.filter((elem) => (reason === 'all-readed' ? false : elem._id !== comment._id && reason === 'readed'));
        break;
      }
      default: {
        updatedComments = comments.map((elem) => {
          const commentReaded = {
            ...elem,
            readedAt: reason === 'readed' || reason === 'all-readed' ? new Date().toJSON() : null,
          };

          return (elem._id === comment._id || (reason === 'all-readed' && !elem.readedAt) ? commentReaded : elem);
        });
      }
    }

    setComments(updatedComments);
    if (updatedComments.length < comments.length) {
      setCount(count > 1 ? count - 1 : 0);
    }
  }

  function updateCommentInList(newComment = {}) {
    const updatedComments = comments.map((elem) => {
      const commentUpdated = newComment._id === elem._id ? newComment : elem;
      return commentUpdated;
    });

    setComments(updatedComments);
  }

  function searchComments(q) {
    clearComments();
    setQuery(q);
    setReload(true);
  }

  function openSettingsDialog() {
    setShowSettingsDialog(true);
  }

  function closeSettingsDialog() {
    setShowSettingsDialog(false);
  }

  function getMoreComments() {
    if (!loading) {
      setPage(page + 1);
      setReload(true);
    }
  }

  useEffect(() => {
    function getSettings() {
      if (settingsLoaded) return null;

      const currentSettings = JSON.parse(localStorage.getItem('cm-comments-settings'));
      if (currentSettings) {
        setType(currentSettings.type);
        setOrder(currentSettings.order);
        setLimit(currentSettings.limit);
      }

      setSettingsLoaded(true);
      return currentSettings;
    }

    const source = axios.CancelToken.source();

    async function getComments() {
      try {
        setLoading(true);

        const params = getSettings();

        const url = params
          ? `${backendUrl}/comments?type=${params.type}&order=${params.order}&query=${query}&page=${page}&limit=${params.limit}`
          : `${backendUrl}/comments?type=${type}&order=${order}&query=${query}&page=${page}&limit=${limit}`;

        await axios(url, { cancelToken: source.token }).then((res) => {
          setReload(false);

          const currentComments = comments;
          currentComments.push(...res.data.comments);
          setComments(currentComments);
          setCount(res.data.count);
          setLimit(res.data.limit);
          setError(false);
        });

        setLoading(false);
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError(true);
        }
      }
    }

    if (reload) {
      getComments();
    }

    return () => source.cancel();
  },
  [
    comments,
    reload,
    type,
    order,
    query,
    page,
    count,
    limit,
    error,
    settingsLoaded,
  ]);

  return (
    <Container>
      <Header title="Comentários" icon="forum" description="Interaja com seus leitores, responda comentários e engaje seus leitores cada vez mais" />
      <HudCommentList
        reload={reloadComments}
        markAllAsRead={updateReadComment}
        changeOrder={changeOrder}
        changeType={changeType}
        searchComments={searchComments}
        showSettings={openSettingsDialog}
      />
      <CommentSettingsDialog open={showSettingsDialog} closeDialog={closeSettingsDialog} />
      {
        !count && loading
          && <LoadingList />
      }
      { !count && !loading
        && (
          <DataNotFound msg={type === 'not-readed' && !query ? 'Ops, atualmente você não possui comentários não lidos' : 'Ops, nenhum comentário encontrado'} />
        )
      }
      { count > 0
        && (
          <InfiniteScroll
            pageStart={page}
            loadMore={getMoreComments}
            hasMore={count > comments.length}
            initialLoad={false}
            loader={(
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                width="100%"
                mt={2}
                mb={2}
                key={0}
              >
                <CircularProgress color="primary" size={40} />
              </Box>
            )}
          >
            <Box
              display="flex"
              alignItems="center"
              flexWrap="wrap"
              width="100%"
            >
              {comments.map((elem) =>
                (
                  <CommentCard
                    comment={elem}
                    key={elem._id}
                    emitAsRead={updateReadComment}
                    updateCard={updateCommentInList}
                  />
                ))
                }
            </Box>
          </InfiniteScroll>
        )}
    </Container>
  );
}


export default CommentList;
