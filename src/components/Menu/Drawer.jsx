import React from 'react';

import PropTypes from 'prop-types';
import { userType } from '@/types';

import { connect } from 'react-redux';

import {
  List,
  Divider,
  Box,
  Typography,
  Icon,
} from '@material-ui/core';

import CoderMindLogo from '@/assets/coder-mind-painelv1-preto.png';

import {
  DrawerList,
  CustomLink,
  CustomListItem,
  CustomDrawer,
} from './styles';

function DrawerMenu(props) {
  const {
    user,
    logout,
  } = props;

  return (
    <CustomDrawer
      open
      variant="permanent"
    >
      <CustomLink to="/">
        <Box display="flex" alignItems="flex-start" justifyContent="center" mt={2} mb={1}>
          <Icon color="primary" fontSize="large">code</Icon>
          <img id="coder-mind-logo" src={CoderMindLogo} alt="Coder Mind" />
        </Box>
      </CustomLink>
      <Divider />
      <DrawerList>
        <List>
          <CustomLink
            to="/articles"
          >
            <CustomListItem
              button
            >
              <Box display="flex" alignItems="center">
                <Icon color="action">
                  library_books
                </Icon>
                <Typography component="span" variant="body2">
                  Artigos
                </Typography>
              </Box>
            </CustomListItem>
          </CustomLink>
          <CustomLink
            to="/stats"
          >
            <CustomListItem
              button
            >
              <Box display="flex" alignItems="center">
                <Icon color="action">
                  assessment
                </Icon>
                <Typography component="span" variant="body2">
                  Estatísticas
                </Typography>
              </Box>
            </CustomListItem>
          </CustomLink>
          <CustomLink
            to="/comments"
          >
            <CustomListItem
              button
            >
              <Box display="flex" alignItems="center">
                <Icon color="action">
                  question_answer
                </Icon>
                <Typography component="span" variant="body2">
                  Comentários
                </Typography>
              </Box>
            </CustomListItem>
          </CustomLink>
          { user.tagAuthor && (
            <CustomLink
              to="/themes"
            >
              <CustomListItem
                button
              >
                <Box display="flex" alignItems="center">
                  <Icon color="action">
                    bookmark
                  </Icon>
                  <Typography component="span" variant="body2">
                    Temas
                  </Typography>
                </Box>
              </CustomListItem>
            </CustomLink>
          )}
          {user.tagAuthor && (
            <CustomLink
              to="/categories"
            >
              <CustomListItem
                button
              >
                <Box display="flex" alignItems="center">
                  <Icon color="action">
                    category
                  </Icon>
                  <Typography component="span" variant="body2">
                    Categorias
                  </Typography>
                </Box>
              </CustomListItem>
            </CustomLink>
          )}
          <CustomLink
            to="/my-account"
          >
            <CustomListItem
              button
            >
              <Box display="flex" alignItems="center">
                <Icon color="action">
                  person_outline
                </Icon>
                <Typography component="span" variant="body2">
                  Meus dados
                </Typography>
              </Box>
            </CustomListItem>
          </CustomLink>
          { user.tagAdmin && (
            <CustomLink
              to="/management"
            >
              <CustomListItem
                button
              >
                <Box display="flex" alignItems="center">
                  <Icon color="action">
                    settings
                  </Icon>
                  <Typography component="span" variant="body2">
                    Configurações
                  </Typography>
                </Box>
              </CustomListItem>
            </CustomLink>
          )}
        </List>
        <List>
          <CustomListItem
            onClick={logout}
            button
            id="logout-button"
          >
            <Box display="flex" alignItems="center">
              <Icon color="action">
                exit_to_app
              </Icon>
              <Typography component="span" variant="body2">
                Sair
              </Typography>
            </Box>
          </CustomListItem>
        </List>
      </DrawerList>
    </CustomDrawer>
  );
}

DrawerMenu.propTypes = {
  user: userType.isRequired,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({ user: state.user });

export default connect(mapStateToProps)(DrawerMenu);
