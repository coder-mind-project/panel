import React, { useState, useEffect } from 'react';

import {
  Container,
  Box,
  CircularProgress,
} from '@material-ui/core';

import Header from '@/components/Header.jsx';
import DataNotFound from '@/components/NotFound/DataNotFound.jsx';

import axios from 'axios';
import { backendUrl } from '@/config/backend';

import HudCommentList from './HudCommentList';
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
  const [isAtBottom, setIsAtBottom] = useState(false);
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
    if (newType !== 'all' && newType !== 'not-readed' && newType !== 'only-readed') return;
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

  useEffect(() => {
    function getTolerance(width) {
      if (width > 0 && width <= 565) return 90;
      if (width > 565 && width <= 768) return 170;
      if (width > 768 && width <= 1024) return 280;
      if (width > 1024 && width <= 1366) return 400;
      if (width > 1366 && width <= 1600) return 450;
      if (width > 1600 && width <= 1920) return 600;
      if (width > 1920 && width <= 2440) return 720;
      if (width > 2400) return 850;

      return 90;
    }

    function changePage() {
      const nextPage = page + 1;
      setPage(nextPage);
      setReload(true);
    }

    function getScrollPosition() {
      const { scrollY, innerHeight, innerWidth } = window;
      const tolerance = getTolerance(innerWidth);

      setIsAtBottom(innerHeight - scrollY <= tolerance);
      if (count > comments.length) changePage();
    }

    window.addEventListener('scroll', getScrollPosition);

    return () => {
      window.removeEventListener('scroll', getScrollPosition);
    };
  }, [isAtBottom, page, reload, comments, count]);

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

    async function getComments() {
      setLoading(true);

      const params = getSettings();

      const url = params
        ? `${backendUrl}/comments?type=${params.type}&order=${params.order}&query=${query}&page=${page}&limit=${params.limit}`
        : `${backendUrl}/comments?type=${type}&order=${order}&query=${query}&page=${page}&limit=${limit}`;

      await axios(url).then((res) => {
        const currentComments = comments;
        currentComments.push(...res.data.comments);
        setComments(currentComments);
        setCount(res.data.count);
        setLimit(res.data.limit);
        setError(false);
      }).catch(() => setError(true));

      setLoading(false);
    }

    if (reload) {
      setReload(false);
      getComments();
    }
  },
  [
    comments,
    loading,
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
          && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="100%"
              height="350px"
            >
              <CircularProgress color="primary" size={80} />
            </Box>
          )
      }
      { !count && !loading
        && (
          <DataNotFound msg={type === 'not-readed' && !query ? 'Ops, atualmente você não possui comentários não lidos' : 'Ops, nenhum comentário encontrado'} />
        )
      }
      { count > 0 && !loading
        && (
          <Box id="comments-container" display="flex" flexDirection="column" alignItems="center">
            <Box display="flex" alignItems="center" flexWrap="wrap" width="100%">
              {comments.map((elem) =>
                (<CommentCard comment={elem} key={elem._id} emitAsRead={updateReadComment} />))
              }
            </Box>
            { isAtBottom
              && (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width="100%"
                  mt={2}
                  mb={2}
                >
                  <CircularProgress color="primary" size={40} />
                </Box>
              )
            }
          </Box>
        )}
    </Container>
  );
}


export default CommentList;
