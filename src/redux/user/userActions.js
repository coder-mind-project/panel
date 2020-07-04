import { setAuthToken } from '@/config/axios';

export function setUser(user) {
  if (user && user.token) {
    setAuthToken(user.token);
  }

  return {
    type: 'SAVE_USER',
    user: user && user.user,
  };
}

export default { setUser };
