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
