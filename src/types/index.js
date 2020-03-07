import {
  shape,
  string,
  bool,
  oneOfType,
  number,
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
  cpf: string,
  celphone: string,
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

export const articleType = shape({
  _id: string,
});

export const ticketType = shape({
  _id: string,
});

export const commentType = shape({
  _id: string,
  confirmed: bool,
  readed: bool,
  answerOf: ticketType,
  userName: string,
  userEmail: string,
  comment: string,
  article: articleType,
  created_at: oneOfType([
    Date,
    string,
  ]),
  updatedAt: oneOfType([
    Date,
    string,
  ]),
});
