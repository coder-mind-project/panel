const INITIAL_STATE = false;

export default function (state = INITIAL_STATE, action) {
  if (action.theme) {
    // eslint-disable-next-line no-param-reassign
    state = action.theme;
  }


  return state;
}
