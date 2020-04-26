import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { appTheme } from '@/types';

import {
  Box,
  IconButton,
  Icon,
  CircularProgress,
  Grow,
  Divider,
  Tooltip,
  Typography,
  Badge,
  Button,
} from '@material-ui/core';

import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { backendUrl } from '@/config/backend';

import { callToast as toastEmitter } from '@/redux/toast/toastActions';
import { error as toastError } from '@/config/toasts';

import Scrollbars from 'react-custom-scrollbars';
import NotificationItem from './UnreadComment';
import CommentDetailsDialog from './CommentDetailsDialog';

import { CustomMenu, CustomLink } from './styles';

function UnreadComments(props) {
  const {
    callToast,
    theme,
  } = props;

  const [comments, setComments] = useState([]);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(null);
  const [load, setLoad] = useState(false);
  const [loading, setLoading] = useState(true);
  const [commentSelected, setCommentSelected] = useState(null);
  const [showCommentDetails, setShowCommentDetails] = useState(false);

  function openMenuNotifications(evt) {
    const { currentTarget } = evt;
    setOpen(currentTarget);
  }

  function closeMenuNotifications() {
    setOpen(null);
  }

  async function markAllAsRead() {
    try {
      if (!count) return;

      const url = `${backendUrl}/comments`;
      axios.patch(url);
      setComments([]);
      setCount(0);
    } catch (error) {
      callToast(toastError('Ocorreu um erro desconhecido, se persistir reporte'));
    }
  }

  function openCommentDetails(comment) {
    setCommentSelected(comment);
    setShowCommentDetails(true);
  }

  function closeCommentDetails() {
    setCommentSelected(null);
    setShowCommentDetails(false);
  }

  useEffect(() => {
    async function getNotifications() {
      setLoading(true);
      const url = `${backendUrl}/comments?type=not-readed&limit=10`;

      await axios(url).then((res) => {
        const newComments = res.data.comments || [];
        const newCount = res.data.count || 0;
        setComments(newComments);
        setCount(newCount);
      });

      setLoading(false);
    }

    if (!load) {
      setLoad(true);
      getNotifications();
    }
  }, [loading, load, comments]);

  return (
    <Box mr={3}>
      { Boolean(commentSelected && showCommentDetails)
        && (
          <CommentDetailsDialog
            open={showCommentDetails}
            closeDialog={closeCommentDetails}
            comment={commentSelected}
          />
        )}
      <Box>
        <Tooltip
          title={(
            <Typography component="p" variant="body2">
              Comentários não lidos
            </Typography>
              )}
        >
          <IconButton
            color="inherit"
            onClick={openMenuNotifications}
            ref={open}
          >
            <Badge
              invisible={!count}
              badgeContent={count}
              color={open ? 'default' : 'primary'}
              variant="dot"
            >
              <Icon color={open ? 'primary' : 'action'}>
                mode_comment
              </Icon>
            </Badge>
          </IconButton>
        </Tooltip>
        <CustomMenu
          anchorEl={open}
          variant="menu"
          keepMounted
          open={Boolean(open)}
          onClose={closeMenuNotifications}
          transitionDuration={{
            enter: 400,
            exit: 400,
          }}
          TransitionComponent={Grow}
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
          <Box pl={1.3} pr={1.3}>
            <Box
              width="100%"
              display="flex"
              justifyContent="space-between"
              mb={0.5}
            >
              <Box display="flex" alignItems="center">
                <Box mr={1} display="flex" alignItems="center">
                  <Icon fontSize="small" color="action">
                    mode_comment
                  </Icon>
                </Box>
                <Box display="flex" alignItems="center">
                  <Typography component="h3" variant="body2">
                    Comentários não lidos
                  </Typography>
                </Box>
              </Box>
              { Boolean(count)
                && (
                  <Box mr={1}>
                    <IconButton
                      size="small"
                      color={theme === 'dark' ? 'inherit' : 'primary'}
                      onClick={markAllAsRead}
                    >
                      <Icon>
                        done_all
                      </Icon>
                    </IconButton>
                  </Box>
                )}
            </Box>
            <Divider />
            { count === 0 && !loading
              && (
                <Box
                  p={1}
                  mb={count ? 2 : 0}
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Typography component="h3" variant="body2">
                    Parabéns!! Você está em dia com seus leitores.
                  </Typography>
                  <CustomLink to="/comments">
                    <Button
                      variant="text"
                      color="primary"
                      size="small"
                      onClick={closeMenuNotifications}
                    >
                      Ir para comentários
                    </Button>
                  </CustomLink>
                </Box>
              )
            }
            { loading
              && (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                minWidth="260px"
                p={2}
              >
                <CircularProgress color="primary" size={20} />
              </Box>
              )
            }
            { count > 0 && !loading
              && (
                <Scrollbars autoHeight>
                  <Box>
                    {comments.map((notification) => (
                      <NotificationItem
                        key={notification._id}
                        notification={notification}
                        selectComment={openCommentDetails}
                      />
                    ))}
                  </Box>
                </Scrollbars>
              )
            }
          </Box>
        </CustomMenu>
      </Box>
    </Box>
  );
}

UnreadComments.propTypes = {
  callToast: PropTypes.func.isRequired,
  theme: appTheme.isRequired,
};

const mapStateToProps = (state) => ({ theme: state.theme, toast: state.config });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UnreadComments);
