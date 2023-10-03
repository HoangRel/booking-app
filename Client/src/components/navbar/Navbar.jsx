import { useNavigate } from 'react-router-dom';
import './navbar.css';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const [isLogin, setIsLogin] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const curUser = JSON.parse(localStorage.getItem('curUser')) || null;

    if (curUser) {
      setIsLogin(curUser.email);
    }
  }, []);

  const signUpHandler = () => {
    navigate('/auth?mode=signUp');
  };
  const loginHander = () => {
    navigate('/auth');
  };

  const logoutHandler = () => {
    localStorage.removeItem('curUser');
    setIsLogin(null);
    navigate('/');
  };

  const transactionsHandler = () => {
    navigate('/transactions');
  };

  return (
    <div className='navbar'>
      <div className='navContainer'>
        <span className='logo'>Booking Website</span>
        <div className='navItems'>
          {!isLogin ? (
            <>
              <button onClick={signUpHandler} className='navButton'>
                Sign Up
              </button>
              <button onClick={loginHander} className='navButton'>
                Login
              </button>
            </>
          ) : (
            <>
              <p>{isLogin}</p>
              <button className='navButton' onClick={transactionsHandler}>
                Transactions
              </button>
              <button onClick={logoutHandler} className='navButton'>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
