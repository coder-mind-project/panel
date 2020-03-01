import {
  styled,
  Container,
  Paper,
  Box,
} from '@material-ui/core';

export const ErrorContainer = styled(Container)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export const ErrorPaper = styled(Paper)({
  display: 'flex',
  flexWrap: 'nowrap',
});

export const ErrorBox = styled(Box)({
  width: '350px',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

export const ErrorLogo = styled(Box)({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export const ErrorMsg = styled(Box)({
  textAlign: 'justify',
  margin: '1rem 0rem',
});
