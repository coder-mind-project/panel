import {
  styled,
  Slide,
  Grid,
  Icon,
  Chip,
  DialogContent,
} from '@material-ui/core';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

export const CustomLink = styled(Link)({
  textDecoration: 'none',
});

export const CustomToast = styled(Slide)({
  marginTop: 50,
});

export const CustomHeader = styled(Grid)({
  display: 'flex',
  flexDirection: 'column',
  marginTop: (props) => (props.withoutmargin ? 10 : '1rem'),
  paddingLeft: (props) => (props.withoutmargin ? 0 : '1rem'),
  paddingRight: (props) => (props.withoutmargin ? 0 : '1rem'),
  marginBottom: 20,
});

export const CustomIcon = styled(Icon)({
  color: (props) => (props.theme === 'dark' ? '#FFF' : '#444'),
  marginRight: '5px',
});

export const CustomFaIcon = styled(FontAwesomeIcon)({
  color: '#444',
  marginRight: '5px',
});

export const CustomChip = styled(Chip)({
  '& .MuiIcon-root': {
    marginRight: '5px',
  },
});

export const CustomDialogContent = styled(DialogContent)({
  '& .cm-link': {
    color: (props) => (props.theme === 'dark' ? '#fff' : 'auto'),
  },
});
