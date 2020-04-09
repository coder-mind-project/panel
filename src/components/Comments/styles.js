import {
  styled,
  Menu,
  Icon,
  Box,
  Grid,
} from '@material-ui/core';

import { Link } from 'react-router-dom';

export const CustomLink = styled(Link)({
  textDecoration: 'none',
  color: (props) => (props.theme === 'dark' ? '#fff' : '#444'),
});

export const CustomIcon = styled(Icon)({
  color: '#666',
});

export const CustomMenu = styled(Menu)({
  marginTop: '.5rem',
});

export const CommentContainer = styled(Grid)({
  margin: '0 5px',
  maxWidth: '350px',
});

export const ArticleSmallImgContainer = styled(Box)({
  '& .article-small-img': {
    height: '48px',
    width: '48px',
    borderRadius: '24px',
    marginRight: '8px',
  },
});
