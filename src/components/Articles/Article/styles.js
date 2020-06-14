import {
  styled,
  TextField,
  Divider,
  Icon,
  Box,
  Paper,
  ExpansionPanelSummary,
} from '@material-ui/core';

import { devices, sizes } from '@/config/devices';

import { Link } from 'react-router-dom';

export const ArticleTitleTextField = styled(TextField)({
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

export const ArticleDescriptionTextField = styled(TextField)({
  width: sizes.tablet,
  [devices.laptop]: {
    width: sizes.mobileLarge,
  },
  [devices.mobileExtraLarge]: {
    width: sizes.mobileMedium,
  },
  [devices.mobileLarge]: {
    width: sizes.mobileSmall,
  },
  [devices.mobileMedium]: {
    width: 'auto',
  },
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

export const CustomLink = styled(Link)({
  color: (props) => (props.theme === 'dark' ? '#fff' : null),
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
  '& img': {
    cursor: 'pointer',
  },
  [devices.mobileExtraLarge]: {
    display: 'none',
  },
});

export const ArticleIcon = styled(Icon)({
  fontSize: '3rem',
  cursor: 'pointer',
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
    '& p, h1, h2, h3, h4, h5, h6, span, strong, code, blockquote, div, section': {
      wordWrap: 'break-word',
    },
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

export const ArticleSettingsContent = styled(Box)({
  height: '100%',
  overflowX: 'hidden',
});

export const CustomExpansionPanelSummary = styled(ExpansionPanelSummary)({
  '& .MuiExpansionPanelSummary-content': {
    margin: '20px 0',
  },
});

export const ArticleLogoArea = styled(Box)({
  width: '100%',
  marginBottom: '20px',
  '& .article-logo-img': {
    borderRadius: '5px',
    objectFit: 'cover',
    width: '150px',
  },
});

export const ArticleSecondaryImageArea = styled(Box)({
  width: '100%',
  marginBottom: '20px',
  '& .article-secondary-img': {
    borderRadius: '5px',
    objectFit: 'cover',
    width: '180px',
  },
});

export const ArticleHeaderImageArea = styled(Box)({
  width: '100%',
  marginBottom: '20px',
  '& .article-header-img': {
    borderRadius: '5px',
    objectFit: 'cover',
    width: '225px',
  },
});

export const BoxSocialMedia = styled(Box)({
  display: 'flex',
  alignItems: 'baseline',
  width: '100%',
  '& .social-media-type': {
    marginLeft: '30px',
  },
});
