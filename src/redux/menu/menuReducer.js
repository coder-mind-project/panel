/* eslint-disable no-param-reassign */
const INITIAL_STATE = false;

export default function (state = INITIAL_STATE, action) {
  if (typeof action.menu === 'boolean') {
    state = action.menu || false;
  }

  return state;
}
