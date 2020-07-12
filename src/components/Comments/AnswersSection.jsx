import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { commentSettingsType } from '@/types';

import {
  DialogContent,
  Box,
  IconButton,
  Icon,
  Divider,
  LinearProgress,
  Button,
  InputLabel,
  Switch,
  TextField,
  Typography,
  Menu,
  MenuItem,
  CircularProgress,
  Tooltip,
  useMediaQuery,
} from '@material-ui/core';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { callToast as toastEmitter } from '@/redux/toast/toastActions';
import { error as toastError } from '@/config/toasts';

import axios from 'axios';
import { defineErrorMsg } from '@/config/backend';

import { devices } from '@/config/devices';

import InfiniteScroll from 'react-infinite-scroller';
import CustomButton from '@/components/Buttons/Button.jsx';

import AnswerItem from './AnswerItem';

import {
  DialogSettingsTitle,
  CustomDialog,
  SettingsTitleContent,
  AnswersHudItem,
} from './styles';

function AnswersSection(props) {
  const {
    open,
    closeDialog,
    comment,
    callToast,
    readComment,
  } = props;

  /**
   * @description Controller states
   */
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(true);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [showActionButtons, setShowActionButtons] = useState(false);
  const [anchorMenuOrder, setAnchorMenuOrder] = useState(null);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [anchorMenuType, setAnchorMenuType] = useState(null);

  /**
   * @description Data states
   */
  const [answers, setAnswers] = useState([]);
  const [answer, setAnswer] = useState('');
  const [notify, setNotify] = useState('no');
  const [latestAnswer, setLatestAnswer] = useState(null);
  const [order, setOrder] = useState('desc');
  const [type, setType] = useState('');

  const matches = useMediaQuery(devices.mobileLarge);

  function close(event) {
    closeDialog(event);
  }

  function handleChange(evt) {
    const { value } = evt.target;

    setAnswer(value);
  }

  function handleChecked(evt) {
    const { checked } = evt.target;
    setNotify(checked ? 'yes' : 'no');
  }

  function clearAnswerField() {
    const element = document.querySelector('#cm-answer-comment');
    if (element) {
      element.blur();
    }

    setShowActionButtons(false);
    setAnswer('');
  }

  function reloadAnswers() {
    setPage(1);
    setReload(true);
  }

  async function saveAnswer() {
    if (saving) return;

    setSaving(true);
    const { _id } = comment;
    const url = `/comments/${_id}?notify=${notify}`;

    const data = { answer };
    await axios.post(url, data).then((response) => {
      reloadAnswers();
      if (order === 'asc' && type !== 'disabled') setLatestAnswer(response.data);
      clearAnswerField();
    }).catch((err) => {
      const msg = defineErrorMsg(err);
      callToast(toastError(msg));
    });

    setSaving(false);
  }

  function openMenuOrder(evt) {
    const { currentTarget } = evt;
    setAnchorMenuOrder(currentTarget);
  }

  function closeMenuOrder() {
    setAnchorMenuOrder(null);
  }

  function changeOrder(o) {
    if (latestAnswer && o === 'desc') {
      setLatestAnswer(null);
    }
    setOrder(o);
    setAnswers([]);
    setPage(1);
    setReload(true);
    closeMenuOrder();
  }

  function openMenuType(evt) {
    const { currentTarget } = evt;
    setAnchorMenuType(currentTarget);
  }

  function closeMenuType() {
    setAnchorMenuType(null);
  }

  function changeType(t) {
    if (latestAnswer) setLatestAnswer(null);
    setType(t);
    setAnswers([]);
    setPage(1);
    setReload(true);
    closeMenuType();
  }

  function getMoreAnswers() {
    if (!loading) {
      setPage(page + 1);
      setReload(true);
    }
  }

  function defineType() {
    switch (type) {
      case 'enabled': {
        return 'Somente habilitados';
      }
      case 'disabled': {
        return 'Somente desabilitados';
      }
      default: {
        return 'Todos';
      }
    }
  }

  function updateAnswerState(currentAnswer) {
    const updatedAnswers = answers.map((elem) => {
      let ans = elem;
      if (ans._id === currentAnswer._id) {
        ans = currentAnswer;
      }

      return ans;
    });

    setAnswers(updatedAnswers);
  }

  useEffect(() => {
    function getSettings() {
      try {
        const currentSettings = JSON.parse(localStorage.getItem('cm-comments-settings'));
        if (currentSettings) {
          const willNotify = currentSettings.notify ? 'yes' : 'no';
          const { answersOrder, answersType } = currentSettings;

          setNotify(willNotify);
          setType(answersType);
          setOrder(answersOrder);
          return { notify: willNotify, type: answersType, order: answersOrder };
        }

        throw new Error('Settings is not defined');
      } catch (error) {
        return null;
      }
    }

    async function getAnswers() {
      setLoading(true);

      let initialSettings = null;

      if (!settingsLoaded) {
        setSettingsLoaded(true);
        initialSettings = getSettings();
      }

      const { _id } = comment;
      const url = initialSettings
        ? `/comments/history/${_id}?page=${page}&limit=${limit}&order=${initialSettings.order}&state=${initialSettings.type}`
        : `/comments/history/${_id}?page=${page}&limit=${limit}&order=${order}&state=${type}`;

      await axios(url).then((response) => {
        let currentAnswers = answers;
        const newAnswers = response.data.answers;

        // Reloading verification (when a new answer is added)
        if (currentAnswers.length && page === 1) {
          currentAnswers = newAnswers;
        } else {
          currentAnswers.push(...newAnswers);
        }

        setAnswers(currentAnswers);
        setLimit(response.data.limit);
        setCount(response.data.count);
      });

      setLoading(false);
    }

    if (reload) {
      setReload(false);
      getAnswers();
    }
  },
  [
    comment,
    reload,
    loading,
    answers,
    limit,
    page,
    count,
    open,
    notify,
    order,
    latestAnswer,
    settingsLoaded,
    type,
  ]);

  useEffect(() => {
    if (open && !comment.readedAt && typeof readComment === 'function') {
      readComment();
    }
  }, [comment, open, readComment]);

  return (
    <CustomDialog
      open={open}
      onClose={close}
      disableBackdropClick={saving}
      disableEscapeKeyDown={saving}
      maxWidth="md"
    >
      {/* saving a new answers or reloading answers after save the new answer */}
      { (saving || (loading && Boolean(answers.length) && page === 1))
        && (
          <LinearProgress color="primary" />
        )}
      <DialogSettingsTitle id="title" disableTypography>
        <SettingsTitleContent>
          <Box display="flex" alignItems="center">
            <Box mr={1} display="flex" alignItems="center">
              <Icon color="action" fontSize="small">
                forum
              </Icon>
            </Box>
            <Typography
              component="span"
              variant="body1"
            >
              {`Respostas do comentário de ${comment.userName} - ${comment.article ? comment.article.title : ''}`}
            </Typography>
          </Box>
          <IconButton onClick={close} size="small">
            <Icon>
              clear
            </Icon>
          </IconButton>
        </SettingsTitleContent>
        <Divider />
      </DialogSettingsTitle>
      <DialogContent id="answers-content">
        <Box display="flex" alignItems="center">
          <Switch
            size="small"
            color="primary"
            onChange={handleChecked}
            checked={notify === 'yes'}
            value={notify}
            inputProps={{ id: 'comment-notify-reader' }}
          />
          <InputLabel htmlFor="comment-notify-reader">Notificar o leitor?</InputLabel>
        </Box>
        <Box mt={2} mb={3}>
          <Box mb={2}>
            <TextField
              id="cm-answer-comment"
              placeholder="Adicionar uma resposta..."
              onFocus={() => setShowActionButtons(true)}
              multiline
              rowsMax={10}
              value={answer}
              onChange={handleChange}
              fullWidth
            />
          </Box>
          { showActionButtons
            && (
              <Box display="flex" justifyContent="flex-end">
                <Box mr={1}>
                  <Button
                    variant="text"
                    size="small"
                    onClick={clearAnswerField}
                  >
                    Cancelar
                  </Button>
                </Box>
                <Box>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={saveAnswer}
                    disabled={!answer}
                  >
                    Enviar
                  </Button>
                </Box>
              </Box>
            )
          }
        </Box>
        <Box>
          <Box display="flex" justifyContent="space-between" width="100%" mb={2}>
            <Box display="flex" alignItems="center" flexWrap="wrap">
              { Boolean(count)
                && (
                  <AnswersHudItem>
                    <Typography component="h2" variant={matches ? 'body2' : 'subtitle1'}>
                      {`${count} resposta${count > 1 ? 's' : ''}`}
                    </Typography>
                  </AnswersHudItem>
                )}
              { Boolean(count)
                && (
                  <AnswersHudItem>
                    <Box ml={1}>
                      { matches
                      && (
                        <IconButton onClick={openMenuOrder}>
                          <Icon fontSize="small">
                            sort
                          </Icon>
                        </IconButton>
                      )
                    }
                      {!matches
                      && (
                      <CustomButton
                        variant="text"
                        color="default"
                        onClick={openMenuOrder}
                        icon="sort"
                        text="Ordenar por"
                        size="small"
                      />
                      )}
                    </Box>
                    <Menu
                      anchorEl={anchorMenuOrder}
                      keepMounted
                      open={Boolean(anchorMenuOrder)}
                      onClose={closeMenuOrder}
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
                      <MenuItem
                        onClick={() => changeOrder('desc')}
                        selected={order === 'desc'}
                      >
                        Mais recente
                      </MenuItem>
                      <MenuItem
                        onClick={() => changeOrder('asc')}
                        selected={order === 'asc'}
                      >
                        Mais antigo
                      </MenuItem>
                    </Menu>
                  </AnswersHudItem>
                )}
            </Box>
            <Box>
              <Tooltip title={<Typography component="span" variant="body2">Tipos de respostas</Typography>}>
                <IconButton
                  onClick={openMenuType}
                >
                  <Icon fontSize="small" color="inherit">
                    filter_list
                  </Icon>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorMenuType}
                keepMounted
                open={Boolean(anchorMenuType)}
                onClose={closeMenuType}
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
                <MenuItem
                  onClick={() => changeType('')}
                  selected={!type || type === 'all'}
                >
                  Todos
                </MenuItem>
                <MenuItem
                  onClick={() => changeType('enabled')}
                  selected={type === 'enabled'}
                >
                  Somente habilitados
                </MenuItem>
                <MenuItem
                  onClick={() => changeType('disabled')}
                  selected={type === 'disabled'}
                >
                  Somente desabilitados
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Box>
        { Boolean(!count) && loading
          && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="100%"
              minHeight="200px"
              mt={2}
              mb={2}
              key={0}
            >
              <CircularProgress color="primary" size={40} />
            </Box>
          )
        }
        { latestAnswer
          && (
            <Box width="100%">
              <AnswerItem answer={latestAnswer} />
            </Box>
          )}
        <InfiniteScroll
          pageStart={page}
          loadMore={getMoreAnswers}
          hasMore={count > answers.length}
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
              {/* not displayed when answers are reloaded after saving the new answer */}
              { !(loading && answers.length && page === 1)
                && (
                  <CircularProgress color="primary" size={40} />
                )}
            </Box>
          )}
          useWindow={false}
        >
          { answers
            && answers.map((elem) =>
              (
                <AnswerItem
                  answer={elem}
                  key={elem._id}
                  changeAnswerState={updateAnswerState}
                />
              ))
          }
          { !count && !loading
            && (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                width="100%"
              >
                <Typography component="p" variant="body1" align="center">
                  {!type || type === 'all' ? 'Este comentário não possui respostas' : `Este comentário não possui respostas do tipo "${defineType()}"`}
                </Typography>
              </Box>
            )}
        </InfiniteScroll>
      </DialogContent>
    </CustomDialog>
  );
}

AnswersSection.propTypes = {
  open: PropTypes.bool,
  closeDialog: PropTypes.func.isRequired,
  comment: commentSettingsType.isRequired,
  callToast: PropTypes.func.isRequired,
  readComment: PropTypes.func,
};

AnswersSection.defaultProps = {
  open: false,
  readComment: null,
};

const mapStateToProps = (state) => ({ toast: state.config });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AnswersSection);
