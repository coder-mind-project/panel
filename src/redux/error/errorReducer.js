const INITIAL_STATE = false;

export default function (state = INITIAL_STATE, action) {
  if (action.error) {
    // eslint-disable-next-line no-param-reassign
    state = action.error;
  }


  return state;
}
