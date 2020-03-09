import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { userType } from '@/types';

import { connect } from 'react-redux';

import {
  Toolbar,
  MenuItem,
  Box,
  Typography,
  Icon,
} from '@material-ui/core';

import HideOnScroll from '@/components/HideOnScroll.jsx';
import AboutSystem from '@/components/AboutSystem.jsx';
import CommentsNotifications from '@/components/Comments/UnreadComments.jsx';
import TicketsNotifications from '@/components/Tickets/ManageTickets/UnreadedTickets.jsx';

import Logo from '../../assets/coder-mind-painelv1-branco.png';

import {
  CustomAppBar,
  CustomAvatar,
  AppBarItems,
  CustomMenu,
  CustomLink,
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
          <CustomLink to="/">
            <img
              src={Logo}
              width="130"
              alt="Coder Mind"
            />
          </CustomLink>
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
          <CustomMenu
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
            <CustomLink to="/my-account" onClick={closeMenu}>
              <MenuItem>
                <Box display="flex" alignItems="center">
                  <Icon color="action">
                    person_outline
                  </Icon>
                  <Typography component="span" variant="body2">
                    Meus dados
                  </Typography>
                </Box>
              </MenuItem>
            </CustomLink>
            <CustomLink to="/ticket" onClick={closeMenu}>
              <MenuItem>
                <Box display="flex" alignItems="center">
                  <Icon color="action">
                    feedback
                  </Icon>
                  <Typography component="span" variant="body2">
                    Fale conosco
                  </Typography>
                </Box>
              </MenuItem>
            </CustomLink>
            { user && user.tagAdmin
                && (
                  <CustomLink to="/management" onClick={closeMenu}>
                    <MenuItem>
                      <Box display="flex" alignItems="center">
                        <Icon color="action">
                          settings
                        </Icon>
                        <Typography component="span" variant="body2">
                          Configurações
                        </Typography>
                      </Box>
                    </MenuItem>
                  </CustomLink>
                )
              }
            <MenuItem onClick={logout}>
              <Box display="flex" alignItems="center">
                <Icon color="action">
                  exit_to_app
                </Icon>
                <Typography component="span" variant="body2">
                  Sair
                </Typography>
              </Box>
            </MenuItem>
          </CustomMenu>
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
