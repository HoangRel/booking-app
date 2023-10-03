import { createContext } from 'react';

const AuthContext = createContext({
  isLogged: false,
  onLogin: () => {},
  onLogout: () => {},
});

export default AuthContext;
