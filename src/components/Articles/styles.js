import {
  styled,
  Icon,
  Box,
} from '@material-ui/core';

export const FakeHeaderCell = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  color: (props) => (props.theme === 'dark' ? '#FFF' : 'rgb(0,0,0, .54)'),
  fontWeight: 500,
});

export const CustomIcon = styled(Icon)({
  marginRight: '5px',
});
