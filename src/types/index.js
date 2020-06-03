import {
  shape,
  string,
  bool,
  oneOf,
  oneOfType,
  number,
  object,
} from 'prop-types';

export const userType = shape({
  publicProfile: bool,
  platformStats: bool,
  firstLogin: bool,
  _id: string,
  name: string,
  email: string,
  gender: string,
  tagAuthor: string,
  tagAdmin: string,
  cellphone: string,
  birthDate: oneOfType([
    Date,
    string,
  ]),
  address: string,
  number,
  password: string,
  deleted: bool,
  customUrl: string,
  created_at: oneOfType([
    Date,
    string,
  ]),
  updatedAt: oneOfType([
    Date,
    string,
  ]),
  confirmEmail: string,
  confirmEmailToken: string,
  lastEmailTokenSendAt: number,
  profilePhoto: string,
});

export const themeType = shape({
  _id: string,
  name: string,
  alias: string,
  description: string,
  state: string,
});

export const categoryType = shape({
  _id: string,
  name: string,
  alias: string,
  description: string,
  theme: themeType,
  state: oneOf([
    'active',
    'removed',
  ]),
});

export const articleType = shape({
  _id: string,
});

export const ticketNotificationType = shape({
  _id: string,
  content: shape({
    readed: bool,
    type: string,
    userId: string,
    email: string,
    msg: string,
    createdAt: oneOfType([
      Date,
      string,
    ]),
    updatedAt: oneOfType([
      Date,
      string,
    ]),
  }),
});

export const ticketType = shape({
  _id: string,
});

export const commentType = shape({
  _id: string,
  userName: string,
  userEmail: string,
  message: string,
  article: articleType,
  confirmedAt: oneOfType([
    Date,
    string,
  ]),
  readedAt: oneOfType([
    Date,
    string,
  ]),
  createdAt: oneOfType([
    Date,
    string,
  ]),
  updatedAt: oneOfType([
    Date,
    string,
  ]),
});

export const commentSettingsType = shape({
  userId: string,
  type: oneOf([
    'all',
    'not-readed',
    'only-readed',
  ]),
  order: oneOf([
    'desc',
    'asc',
  ]),
  limit: number,
  notify: bool,
  answersOrder: oneOf([
    'desc',
    'asc',
  ]),
  answersType: oneOf([
    'all',
    'enabled',
    'disabled',
  ]),
});

export const statType = shape({
  id: number,
  month: number,
  count: number,
  generated_at: oneOfType([
    Date,
    string,
  ]),
  year: number,
  reference: string,
});

export const appTheme = oneOf([
  'light',
  'dark',
]);

export const reactRouterParams = shape({
  path: string,
  url: string,
  isExact: bool,
  params: object, // Property types are changed according to the context
});

export const toastConfig = shape({
  type: string,
  msg: string,
  display: bool,
});
