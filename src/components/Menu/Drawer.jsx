import React from 'react';

import { Link } from 'react-router-dom';
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

import {
  DrawerList,
  CustomLink,
  CustomListItem,
  IconMenuItem,
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
      <Box display="flex" alignItems="center" justifyContent="center" mt={2} mb={1}>
        <Link to="/">
          <Icon color="primary" fontSize="large">code</Icon>
        </Link>
      </Box>
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
                <IconMenuItem>
                  library_books
                </IconMenuItem>
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
                <IconMenuItem>
                  assessment
                </IconMenuItem>
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
                <IconMenuItem>
                  question_answer
                </IconMenuItem>
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
                  <IconMenuItem>
                    bookmark
                  </IconMenuItem>
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
                  <IconMenuItem>
                    category
                  </IconMenuItem>
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
                <IconMenuItem>
                  person_outline
                </IconMenuItem>
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
                  <IconMenuItem>
                    settings
                  </IconMenuItem>
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
              <IconMenuItem>
                exit_to_app
              </IconMenuItem>
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
