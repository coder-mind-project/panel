import {
  styled,
  Menu,
  Icon,
  Box,
  Grid,
  Card,
  CardActionArea,
  CardActions,
  IconButton,
  DialogTitle,
  Dialog,
  InputLabel,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Tabs,
} from '@material-ui/core';

import SearchBar from 'material-ui-search-bar';

import { Link } from 'react-router-dom';

import { devices } from '@/config/devices';

export const CustomLink = styled(Link)({
  textDecoration: 'none',
  color: 'inherit',
});

export const CustomMenuItem = styled(MenuItem)({
  width: '100%',
  paddingLeft: '6px',
  paddingRight: '6px',
  '& .comment-info': {
    width: '80%',
    '& p': {
      width: '100%',
      wordBreak: 'break-word',
      whiteSpace: 'normal',
    },
  },
});

export const CustomIcon = styled(Icon)({
  color: '#666',
});

export const CustomMenu = styled(Menu)({
  marginTop: '.5rem',
});

export const CommentContainer = styled(Grid)({
  maxWidth: '350px',
});

export const ArticleLogoImgContainer = styled(Box)({
  marginRight: '8px',
  '& .article-small-img': {
    height: '48px',
    width: '48px',
    borderRadius: '24px',
    objectFit: 'cover',
  },
});

export const CustomCard = styled(Card)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  width: '345px',
  height: '320px',
  margin: '15px',
  [devices.laptop]: {
    maxWidth: '47%',
    margin: '9px',
  },
  [devices.tablet]: {
    maxWidth: '47%',
    margin: '5px',
  },
  [devices.mobileExtraLarge]: {
    maxWidth: '100%',
  },
});

export const CustomCardActionArea = styled(CardActionArea)({
  height: '272px',
  flexDirection: 'column',
  alignItems: 'flex-start',
  '& .article-logo': {
    filter: (props) => (props.comment && props.comment.readedAt ? 'grayscale(100%)' : 'none'),
  },
  '& .comment-user-name': {
    wordBreak: 'break-all',
    whiteSpace: 'normal',
  },
});

export const CustomCardActions = styled(CardActions)({
  display: 'flex',
  justifyContent: 'flex-end',
});

export const HudContainer = styled(Box)({
  margin: '5px 15px 15px 15px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  [devices.tablet]: {
    margin: '5px 5px 15px 5px',
  },
});

export const HudIconButton = styled(IconButton)({
  margin: '0px 5px',
  display: (props) => (props.searchtype === 'only-readed' ? 'none' : 'inline-flex'),
});

export const HudSearchBarContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  [devices.tablet]: {
    width: '100%',
  },
});

export const HudSearchBar = styled(SearchBar)({
  [devices.tablet]: {
    width: '100%',
  },
});

export const DialogSettingsTitle = styled(DialogTitle)({
  padding: '10px 25px 0px 25px',
});

export const SettingsTitleContent = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  marginBottom: '10px',
  '& .dialog-title': {
    '& span': {
      wordBreak: 'break-all',
      whiteSpace: 'normal',
    },
  },
});

export const SettingsIcon = styled(Icon)({
  marginRight: '5px',
});

export const SettingsContainer = styled(Box)({
  display: (props) => (props.open ? 'block' : 'none'),
  padding: '15px',
});

export const CustomInputLabel = styled(InputLabel)({
  marginRight: '10px',
});

export const CustomDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    width: '60%',
    height: '70%',
    [devices.laptop]: {
      width: '90%',
    },
    [devices.mobileLarge]: {
      width: '95%',
    },
  },
});

export const CustomDialogActions = styled(DialogActions)({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '15px',
  [devices.tablet]: {
    display: (props) => (props.responsive === 'true' ? 'none' : 'flex'),
  },
});

export const CustomTextField = styled(TextField)({
  margin: '1rem',
  minWidth: '300px',
  [devices.tablet]: {
    width: '100%',
    minWidth: '100%',
    margin: '1rem 0',
  },
});

export const AnswerOwner = styled(Box)({
  width: '100%',
  '& .answer-owner': {
    fontWeight: 700,
    marginRight: '5px',
    marginBottom: '2px',
    '& .cm-user-icon': {
      marginRight: '5px',
      verticalAlign: 'bottom',
    },
  },
  '& .cm-disable-indicator': {
    marginLeft: '5px',
    verticalAlign: 'top',
  },
});

export const AnswerMessage = styled(Box)({
  width: '100%',
  textDecoration: (props) => (props.state === 'disabled' ? 'line-through' : 'none'),
  [devices.mobileLarge]: {
    marginTop: '5px',
  },
  '& .answer-message': {
    whiteSpace: 'pre-line',
  },
});

export const HudCommentDetailsContainer = styled(Box)({
  padding: '0px 16px',
  display: 'none',
  [devices.tablet]: {
    display: 'block',
  },
});

export const CommentDetailsStateArea = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '8px',
  [devices.mobileLarge]: {
    display: 'none',
  },
});

export const CustomChip = styled(Chip)({
  marginLeft: '5px',
});

export const CustomDialogContent = styled(Box)({
  display: 'flex',
  flexDirection: (props) => (props.sm === 'true' ? 'column' : 'row'),
  height: '100%',
});

export const CommentSettingsTabs = styled(Tabs)({
  width: '250px',
  [devices.tablet]: {
    width: '100%',
  },
});

export const AnswersHudItem = styled(Box)({
  height: '100%',
  [devices.mobileLarge]: {
    height: 'auto',
  },
});
