import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'visiteur_token';

export const saveToken  = (token) => localStorage.setItem(TOKEN_KEY, token);
export const getToken   = ()       => localStorage.getItem(TOKEN_KEY);
export const removeToken = ()      => localStorage.removeItem(TOKEN_KEY);

export const getUser = () => {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = jwtDecode(token);
    if (payload.exp < Date.now() / 1000) {
      removeToken();
      return null;
    }
    return payload;
  } catch {
    return null;
  }
};

export const authHeaders = () => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
});