import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '@/config/backend';
import { userType, appTheme } from '@/types';

import {
  Box,
  IconButton,
  CircularProgress,
  Badge,
  Fade,
  Divider,
  Tooltip,
  Typography,
  Button,
  Icon,
} from '@material-ui/core';

import { connect } from 'react-redux';
import NotificationItem from './UnreadedTicket';

import { CustomMenu, CustomLink } from './styles';

function UnreadedTickets(props) {
  const {
    user,
    theme,
  } = props;

  const menuRef = useRef(null);

  const [tickets, setTickets] = useState([]);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  function openMenu() {
    setOpen(true);
  }

  function closeMenu() {
    setOpen(false);
  }

  useEffect(() => {
    async function getNotifications() {
      setLoading(true);
      const url = `${backendUrl}/tickets/notifications`;

      await axios(url).then((res) => {
        const newTickets = res.data.tickets || [];
        const newCount = res.data.count || 0;

        setTickets(newTickets);
        setCount(newCount);
      });

      setLoading(false);
    }

    if (!user.tagAdmin && loaded) {
      setLoaded(true);
      setOpen(false);
    }

    if (!loaded) {
      getNotifications();
      setLoaded(true);
    }
  }, [loading, tickets, count, loaded, user]);


  return (
    <Box mr={3}>
      <Box>
        <Tooltip
          title={(
            <Typography component="p" variant="body2">
              Tickets não visualizados
            </Typography>
          )}
        >
          <IconButton
            color="inherit"
            onClick={openMenu}
            ref={menuRef}
          >
            <Badge
              invisible={!count}
              badgeContent={count}
              color={open ? 'default' : 'primary'}
              variant="dot"
            >
              <Icon color={open ? 'primary' : 'action'}>
                {open ? 'drafts' : 'mail'}
              </Icon>
            </Badge>
          </IconButton>
        </Tooltip>
        <CustomMenu
          anchorEl={menuRef.current}
          keepMounted
          open={open}
          onClose={closeMenu}
          TransitionComponent={Fade}
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
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Box mr={1}>
                <Icon fontSize="small" color="action">
                  email
                </Icon>
              </Box>
              <Box>
                <Typography component="h3" variant="body1">
                  Tickets não visualizados
                </Typography>
              </Box>
            </Box>
            <Box
              width="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Box mt={1} mb={1}>
                <CustomLink to="/tickets">
                  <Button onClick={closeMenu} color="primary" size="small" variant={theme === 'dark' ? 'contained' : 'text'}>
                    Visualizar tickets
                  </Button>
                </CustomLink>
              </Box>
            </Box>
            <Box mb={1} mt={1}>
              <Divider />
            </Box>
            { count === 0 && !loading
              && (
              <Box
                p={1}
                mb={2}
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
              >
                <Typography component="h3" variant="body2">
                  Ops,parece que não há nenhum ticket novo recebido.
                </Typography>
              </Box>
              )
            }
            {loading
              && (
                <Box display="flex" justifyContent="center" alignItems="center" p={2}>
                  <CircularProgress color={theme === 'dark' ? 'inherit' : 'primary'} size={20} />
                </Box>
              )
            }
            { tickets.length > 0 && !loading
                && (
                  <Box>
                    {tickets.map((notification) => (
                      <NotificationItem
                        key={notification._id}
                        notification={notification.content}
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

UnreadedTickets.propTypes = {
  user: userType.isRequired,
  theme: appTheme.isRequired,
};

const mapStateToProps = (state) => ({ user: state.user, theme: state.theme });
export default connect(mapStateToProps)(UnreadedTickets);
