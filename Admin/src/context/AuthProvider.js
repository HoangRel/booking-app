import { useEffect } from 'react';
import AuthContext from './auth';
import { useState } from 'react';

const AuthProvider = props => {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const adUser = localStorage.getItem('adUser') || null;

    if (adUser === 'ad') {
      setIsLogged(true);
    } else {
      setIsLogged(false);
    }
  }, []);

  const onLoginHandler = () => {
    localStorage.setItem('adUser', 'ad');
    setIsLogged(true);
  };

  const onLogoutHandler = () => {
    localStorage.removeItem('adUser');
    setIsLogged(false);
  };

  const authContext = {
    isLogged,
    onLogin: onLoginHandler,
    onLogout: onLogoutHandler,
  };

  return (
    <AuthContext.Provider value={authContext}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
