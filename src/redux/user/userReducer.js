const INITIAL_STATE = {};

export default function (state = INITIAL_STATE, action) {
  if (action.user) {
    // eslint-disable-next-line no-param-reassign
    state = action.user;
  }

  return { ...state };
}
