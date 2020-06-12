import {
  styled,
  TextField,
  Divider,
  Icon,
  Box,
  Paper,
} from '@material-ui/core';

import { devices } from '@/config/devices';

export const ArticleTitleTextField = styled(TextField)({
  maxWidth: '300px',
  '& input': {
    fontSize: (props) => (props.fontSize ? `${props.fontSize}rem` : '1.15rem'),
    padding: '10px',
  },
  '& .MuiInput-underline': {
    borderRadius: '5px',
    '&:hover': {
      border: '0.5px solid #ccc',
    },
    '&:after': {
      borderBottom: '0px',
    },
    '&:before': {
      borderBottom: '0px',
      content: 'none',
    },
  },
});

export const CustomDivider = styled(Divider)({
  marginTop: '5px',
  marginBottom: '10px',
});

export const ArticleLogo = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '0 10px',
});

export const ArticleIcon = styled(Icon)({
  fontSize: '2.5rem',
});

export const ArticleContent = styled(TextField)({
  '& textarea': {
    padding: '10px',
  },
  '& .MuiInput-underline': {
    '&:after': {
      borderBottom: '0px',
    },
    '&:before': {
      borderBottom: '0px',
      content: 'none',
    },
  },
});

export const CustomPaper = styled(Paper)({
  display: 'flex',
  alignItems: 'flex-start',
  height: '100%',
});

const markdownPreview = {
  '& .cm-preview': {
    width: '95%',
    padding: '10px',
    overflow: 'hidden',
  },
};

export const ArticleEditArea = styled(Box)({
  width: (props) => (props.sizewidth === 'withoutPreview' ? '100%' : '50%'),
  height: '100%',
  margin: 8,
  ...markdownPreview,
  [devices.mobileExtraLarge]: {
    '& .cm-preview': {
      display: 'none',
    },
  },
});

export const HudButtons = styled(Box)({
  display: 'flex',
  flexDirection: (props) => (props.smalldevices === 'true' ? 'column' : 'row'),
  [devices.mobileExtraLarge]: {
    alignItems: 'center',
  },
});
