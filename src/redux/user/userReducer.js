/* eslint-disable no-param-reassign */
const INITIAL_STATE = {};

export default function (state = INITIAL_STATE, action) {
  if (action.user) {
    state = action.user;
  } else if (!action.user && action.user !== undefined) {
    state = INITIAL_STATE;
  }

  return state;
}
