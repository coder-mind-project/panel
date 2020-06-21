import {
  styled,
  Icon,
  Box,
  Container,
} from '@material-ui/core';

import { COLOR_APP, COLOR_APP_ULTRA_LIGHT } from '@/config/dataProperties';

export const TableWrapper = styled(Container)({
  '& .MuiCheckbox-colorSecondary.Mui-checked': {
    color: COLOR_APP,
  },
  '& .MuiIconButton-colorSecondary:hover': {
    backgroundColor: COLOR_APP_ULTRA_LIGHT,
  },
});

export const FakeHeaderCell = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  color: (props) => (props.theme === 'dark' ? '#FFF' : 'rgb(0,0,0, .54)'),
  fontWeight: 500,
});

export const CustomIcon = styled(Icon)({
  marginRight: '5px',
});
