import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { userType, appTheme } from '@/types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toogleTheme as changeTheme } from '@/redux/theme/themeActions';

import {
  Toolbar,
  MenuItem,
  Box,
  Typography,
  Icon,
  useMediaQuery,
} from '@material-ui/core';

import HideOnScroll from '@/components/HideOnScroll.jsx';
import AboutSystem from '@/components/AboutSystem.jsx';
import CommentsNotifications from '@/components/Comments/UnreadComments.jsx';
import TicketsNotifications from '@/components/Tickets/ManageTickets/UnreadedTickets.jsx';

import LogoBlack from '../../assets/coder-mind-painelv1-preto.png';
import LogoWhite from '../../assets/coder-mind-painelv1-branco.png';

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
    theme,
    swapTheme,
  } = props;

  const [anchorMenu, setAnchorMenu] = useState(null);

  const isLightTheme = useMediaQuery(`(prefers-color-scheme: ${theme})`);

  function openMenu(event) {
    setAnchorMenu(event.currentTarget);
  }

  function closeMenu() {
    setAnchorMenu(null);
  }

  function setTheme() {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    swapTheme(newTheme);
  }

  return (
    <HideOnScroll>
      <CustomAppBar color="inherit">
        <Toolbar>
          <CustomLink to="/">
            <img
              src={isLightTheme ? LogoBlack : LogoWhite}
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
                    color="#888"
                    name={user.name}
                    size={35}
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
            <MenuItem onClick={setTheme}>
              <Box display="flex" alignItems="center">
                <Icon color="action">
                  {theme === 'light' ? 'brightness_medium' : 'brightness_low'}
                </Icon>
                <Typography component="span" variant="body2">
                  Modo escuro:
                  {' '}
                  {theme === 'light' ? 'desativado' : 'ativado'}
                </Typography>
              </Box>
            </MenuItem>
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
  theme: appTheme.isRequired,
  swapTheme: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({ user: state.user, theme: state.theme });
const mapDispatchToProps = (dispatch) => bindActionCreators({ swapTheme: changeTheme }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AppBar);
