import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { userType } from '@/types';

import { connect } from 'react-redux';

import {
  Drawer,
  List,
  Divider,
  Box,
} from '@material-ui/core';

import LogoBlack from '../../assets/coder-mind-painelv1-preto.png';

import {
  DrawerList,
  CustomLink,
  CustomListItem,
  IconMenuItem,
} from './styles';

function DrawerMenu(props) {
  const {
    isOpen,
    close,
    user,
    logout,
  } = props;

  const [display, setDisplay] = useState(false);

  function hideDrawer() {
    setDisplay(false);
    close();
  }

  useEffect(() => {
    if (isOpen !== display) {
      setDisplay(isOpen);
    }
  }, [isOpen, display]);

  return (
    <Drawer
      open={display}
      onClose={hideDrawer}
    >
      <Link to="/" onClick={hideDrawer}>
        <img
          src={LogoBlack}
          width="180"
          alt="Painel Coder Mind"
        />
      </Link>
      <Divider />
      <DrawerList>
        <List>
          <CustomLink
            to="/articles"
            onClick={hideDrawer}
          >
            <CustomListItem
              button
            >
              <Box display="flex" alignItems="center">
                <IconMenuItem>
                  library_books
                </IconMenuItem>
                Artigos
              </Box>
            </CustomListItem>
          </CustomLink>
          <CustomLink
            to="/stats"
            onClick={hideDrawer}
          >
            <CustomListItem
              button
            >
              <Box display="flex" alignItems="center">
                <IconMenuItem>
                  assessment
                </IconMenuItem>
                Estatísticas
              </Box>
            </CustomListItem>
          </CustomLink>
          <CustomLink
            to="/comments"
            onClick={hideDrawer}
          >
            <CustomListItem
              button
            >
              <Box display="flex" alignItems="center">
                <IconMenuItem>
                  question_answer
                </IconMenuItem>
                Comentários
              </Box>
            </CustomListItem>
          </CustomLink>
          { user.tagAuthor && (
          <CustomLink
            to="/themes"
            onClick={hideDrawer}
          >
            <CustomListItem
              button
            >
              <Box display="flex" alignItems="center">
                <IconMenuItem>
                  bookmark
                </IconMenuItem>
                Temas
              </Box>
            </CustomListItem>
          </CustomLink>
          )}
          {user.tagAuthor && (
          <CustomLink
            to="/categories"
            onClick={hideDrawer}
          >
            <CustomListItem
              button
            >
              <Box display="flex" alignItems="center">
                <IconMenuItem>
                  category
                </IconMenuItem>
                Categorias
              </Box>
            </CustomListItem>
          </CustomLink>
          )}
          <CustomLink
            to="/my-account"
            onClick={hideDrawer}
          >
            <CustomListItem
              button
            >
              <Box display="flex" alignItems="center">
                <IconMenuItem>
                  person_outline
                </IconMenuItem>
                Meus dados
              </Box>
            </CustomListItem>
          </CustomLink>
          { user.tagAdmin && (
          <CustomLink
            to="/management"
            onClick={hideDrawer}
          >
            <CustomListItem
              button
            >
              <Box display="flex" alignItems="center">
                <IconMenuItem>
                  settings
                </IconMenuItem>
                Configurações
              </Box>
            </CustomListItem>
          </CustomLink>
          )}
        </List>
        <List>
          <CustomListItem
            onClick={logout}
          >
            <Box display="flex" alignItems="center">
              <IconMenuItem>
                exit_to_app
              </IconMenuItem>
              Sair
            </Box>
          </CustomListItem>
        </List>
      </DrawerList>
    </Drawer>
  );
}

DrawerMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  user: userType.isRequired,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({ user: state.user });

export default connect(mapStateToProps)(DrawerMenu);
