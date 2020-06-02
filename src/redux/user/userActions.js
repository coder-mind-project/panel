import { setAuthToken } from '@/config/axios';

export function setUser(user) {
  setAuthToken(user.token);
  return {
    type: 'SAVE_USER',
    user: user.user,
  };
}

export default { setUser };
