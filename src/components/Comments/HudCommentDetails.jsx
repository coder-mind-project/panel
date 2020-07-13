import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { commentType } from '@/types';

import {
  Box,
  Icon,
  IconButton,
  Menu,
  MenuItem,
} from '@material-ui/core';

import {
  HudCommentDetailsContainer,
  CustomLink,
} from './styles';

function HudCommentDetails(props) {
  const {
    answerComment,
    changeCommentState,
    comment,
  } = props;

  const [anchorMenu, setAnchorMenu] = useState(null);

  function openMenu(evt) {
    const { currentTarget } = evt;
    setAnchorMenu(currentTarget);
  }

  function closeMenu() {
    setAnchorMenu(null);
  }

  function performAction(action) {
    switch (action) {
      case 'answer': {
        answerComment();
        break;
      }
      default: {
        changeCommentState();
      }
    }
    closeMenu();
  }

  return (
    <HudCommentDetailsContainer>
      <Box
        display="flex"
        justifyContent="flex-end"
      >
        <IconButton size="small" onClick={openMenu}>
          <Icon>
            more_vert
          </Icon>
        </IconButton>
        <Menu
          anchorEl={anchorMenu}
          keepMounted
          open={Boolean(anchorMenu)}
          onClose={closeMenu}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={() => performAction('answer')}>Responder</MenuItem>
          <MenuItem onClick={() => performAction('state')}>{comment.state === 'enabled' ? 'Desabilitar' : 'Habilitar'}</MenuItem>
          <CustomLink to={`/articles/${comment.article.customUri}`}>
            <MenuItem>Abrir artigo</MenuItem>
          </CustomLink>
        </Menu>
      </Box>
    </HudCommentDetailsContainer>
  );
}

HudCommentDetails.propTypes = {
  answerComment: PropTypes.func.isRequired,
  changeCommentState: PropTypes.func.isRequired,
  comment: commentType.isRequired,
};

export default HudCommentDetails;
