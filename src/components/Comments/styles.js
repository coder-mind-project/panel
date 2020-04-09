import { styled, Menu, Icon } from '@material-ui/core';

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
