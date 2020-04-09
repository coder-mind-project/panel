import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
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
import { connect } from 'react-redux';
import { backendUrl } from '../../config/backend';


import NotificationItem from './UnreadComment';

import { CustomMenu, CustomLink } from './styles';

function UnreadComments() {
  const menuRef = useRef(null);

  const [comments, setComments] = useState([]);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [load, setLoad] = useState(false);
  const [loading, setLoading] = useState(true);

  function openMenuNotifications() {
    setOpen(true);
  }

  function closeMenuNotifications() {
    setOpen(false);
  }

  async function markAllAsRead() {
    const url = `${backendUrl}/comments`;
    axios.patch(url);
    setComments([]);
    setCount(0);
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
            ref={menuRef}
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
          anchorEl={menuRef.current}
          variant="menu"
          keepMounted
          open={open}
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
            <Box width="100%" display="flex" justifyContent="space-between">
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
              <IconButton
                size="small"
                color="primary"
                disabled={!count}
                onClick={markAllAsRead}
              >
                <Icon>
                  done_all
                </Icon>
              </IconButton>
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
                <Box>
                  {comments.map((notification) => (
                    <NotificationItem
                      key={notification._id}
                      notification={notification}
                      close={closeMenuNotifications}
                    />
                  ))}
                </Box>
              )
            }
          </Box>
        </CustomMenu>
      </Box>
    </Box>
  );
}

const mapStateToProps = (state) => ({ user: state.user });
export default connect(mapStateToProps)(UnreadComments);
