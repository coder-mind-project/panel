import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { userType } from '@/types';

import { Link } from 'react-router-dom';

import { connect } from 'react-redux';

import {
  Toolbar,
  Menu,
  MenuItem,
  Box,
  Typography,
} from '@material-ui/core';

import HideOnScroll from '@/components/HideOnScroll.jsx';
import AboutSystem from '@/components/AboutSystem.jsx';
import CommentsNotifications from '@/components/menu-application/Comments/Notifications.jsx';
import TicketsNotifications from '@/components/menu-application/Tickets/Notifications.jsx';

import Logo from '../../assets/coder-mind-painelv1-branco.png';

import {
  CustomAppBar,
  CustomAvatar,
  AppBarItems,
  IconMenuItem,
} from './styles';

import { backendUrl } from '../../config/backend';

function AppBar(props) {
  const {
    user,
    logout,
  } = props;

  const [anchorMenu, setAnchorMenu] = useState(null);

  function openMenu(event) {
    setAnchorMenu(event.currentTarget);
  }

  function closeMenu() {
    setAnchorMenu(null);
  }

  return (
    <HideOnScroll>
      <CustomAppBar>
        <Toolbar>
          <Link to="/">
            <img
              src={Logo}
              width="130"
              alt="Coder Mind"
            />
          </Link>
        </Toolbar>
        <Box>
          { user && user.name
              && (
                <AppBarItems display="flex" alignItems="center">
                  <CommentsNotifications />
                  { user.tagAdmin
                    && <TicketsNotifications />
                  }
                  <AboutSystem />
                  <CustomAvatar
                    onClick={openMenu}
                    style={{ cursor: 'pointer' }}
                    color="#888"
                    name={user.name}
                    size="50"
                    round="30px"
                    src={`${backendUrl}/${user.profilePhoto}`}
                  />
                </AppBarItems>
              )
            }
          <Menu
            anchorEl={anchorMenu}
            getContentAnchorEl={null}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={Boolean(anchorMenu)}
            onClose={closeMenu}
          >
            <Link to="/my-account" onClick={closeMenu} className="linkRouterBlack">
              <MenuItem>
                <Box display="flex" alignItems="center">
                  <IconMenuItem>
                    person_outline
                  </IconMenuItem>
                  <Typography component="span" variant="body2">
                    Meus dados
                  </Typography>
                </Box>
              </MenuItem>
            </Link>
            <Link to="/ticket" onClick={closeMenu} className="linkRouterBlack">
              <MenuItem>
                <Box display="flex" alignItems="center">
                  <IconMenuItem>
                    feedback
                  </IconMenuItem>
                  <Typography component="span" variant="body2">
                    Fale conosco
                  </Typography>
                </Box>
              </MenuItem>
            </Link>
            { user && user.tagAdmin
                && (
                  <Link to="/management" onClick={closeMenu} className="linkRouterBlack">
                    <MenuItem>
                      <Box display="flex" alignItems="center">
                        <IconMenuItem>
                          settings
                        </IconMenuItem>
                        <Typography component="span" variant="body2">
                          Configurações
                        </Typography>
                      </Box>
                    </MenuItem>
                  </Link>
                )
              }
            <MenuItem onClick={logout}>
              <Box display="flex" alignItems="center">
                <IconMenuItem>
                  exit_to_app
                </IconMenuItem>
                <Typography component="span" variant="body2">
                  Sair
                </Typography>
              </Box>
            </MenuItem>
          </Menu>
        </Box>
      </CustomAppBar>
    </HideOnScroll>
  );
}
AppBar.propTypes = {
  user: userType.isRequired,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({ user: state.user });

export default connect(mapStateToProps)(AppBar);
