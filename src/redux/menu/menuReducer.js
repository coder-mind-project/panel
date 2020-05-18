const INITIAL_STATE = false;

export default function (state = INITIAL_STATE, action) {
  if (action.menu) {
    // eslint-disable-next-line no-param-reassign
    state = action.menu;
  }


  return state;
}
