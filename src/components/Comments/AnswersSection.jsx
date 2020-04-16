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
} from '@material-ui/core';


import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { callToast as toastEmitter } from '@/redux/toast/toastActions';
import { error as toastError } from '@/config/toasts';

import axios from 'axios';
import { backendUrl, defineErrorMsg } from '@/config/backend';

import InfiniteScroll from 'react-infinite-scroller';
import CustomButton from '@/components/Buttons/Button.jsx';

import AnswerItem from './AnswerItem';


import {
  DialogSettingsTitle,
  CustomDialog,
  SettingsTitleContent,
} from './styles';

function AnswersSection(props) {
  const {
    open,
    closeDialog,
    comment,
    callToast,
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

  /**
   * @description Data states
   */
  const [answers, setAnswers] = useState([]);
  const [answer, setAnswer] = useState('');
  const [notify, setNotify] = useState('no');
  const [latestAnswer, setLatestAnswer] = useState(null);
  const [order, setOrder] = useState('desc');

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

  async function saveAnswer() {
    if (saving) return;

    setSaving(true);
    const { _id } = comment;
    const url = `${backendUrl}/comments/${_id}?notify=${notify}`;

    const data = { answer };
    await axios.post(url, data).then((response) => {
      if (latestAnswer) {
        const currentAnswers = answers;
        const newAnswer = latestAnswer;
        currentAnswers.push(newAnswer);

        setAnswers(currentAnswers);
      }
      setLatestAnswer(response.data);
      setCount(count + 1);
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
    setOrder(o);
    closeMenuOrder();
  }

  function getMoreAnswers() {
    if (!loading) {
      setPage(page + 1);
      setReload(true);
    }
  }

  useEffect(() => {
    function getNotifyState() {
      const settings = JSON.parse(localStorage.getItem('cm-comments-settings'));
      const willNotify = settings && settings.notify ? 'yes' : 'no';
      setNotify(willNotify);
    }

    async function getAnswers() {
      setLoading(true);

      const { _id } = comment;
      const url = `${backendUrl}/comments/history/${_id}?page=${page}&limit=${limit}&order=${order}`;
      await axios(url).then((response) => {
        const currentAnswers = answers;
        currentAnswers.push(...response.data.answers);
        setAnswers(currentAnswers);
        setLimit(response.data.limit);
        setCount(response.data.count);
      });

      setLoading(false);
    }

    if (reload) {
      setReload(false);
      if (!answers.length) getNotifyState();
      getAnswers();
    }
  }, [comment, reload, loading, answers, limit, page, count, open, notify, order]);

  return (
    <CustomDialog
      open={open}
      onClose={close}
      disableBackdropClick={saving}
      disableEscapeKeyDown={saving}
      maxWidth="md"
    >
      { saving && <LinearProgress color="primary" /> }
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
        { !count && loading
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
        { Boolean(count)
          && (
            <Box>
              <Box display="flex" width="100%" mb={2}>
                <Box>
                  <Typography component="h2" variant="subtitle1">
                    {`${count} resposta${count > 1 ? 's' : ''}`}
                  </Typography>
                </Box>
                <Box ml={2}>
                  <CustomButton
                    variant="text"
                    color="default"
                    onClick={openMenuOrder}
                    icon="sort"
                    text="Ordenar por"
                    size="small"
                  />
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
                      Mais antigo
                    </MenuItem>
                    <MenuItem
                      onClick={() => changeOrder('asc')}
                      selected={order === 'asc'}
                    >
                      Mais recente
                    </MenuItem>
                  </Menu>
                </Box>
              </Box>
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
              <CircularProgress color="primary" size={40} />
            </Box>
          )}
          useWindow={false}
        >
          { answers && answers.map((elem) => (<AnswerItem answer={elem} key={elem._id} />))}
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
};

AnswersSection.defaultProps = {
  open: false,
};

const mapStateToProps = (state) => ({ toast: state.config });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AnswersSection);
