import { useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import Navbar from '../../components/navbar/Navbar';

import './auth.css';

const Auth = () => {
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  const emailRef = useRef();
  const passRef = useRef();

  const [searchParams] = useSearchParams();
  const moded = searchParams.get('mode');

  const isMode = moded === 'signUp';

  const submitHandler = event => {
    setError(null);
    event.preventDefault();
    const resUser = {
      email: emailRef.current.value,
      password: passRef.current.value,
    };

    fetchAuth(resUser);
  };

  const fetchAuth = async resUser => {
    let url = 'http://localhost:8080/user/auth?mode=signIn';

    if (isMode) {
      url = 'http://localhost:8080/user/auth?mode=signUp';
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resUser),
    });

    if (response.status === 500) {
      const data = await response.json();
      window.alert(data.message);
      return navigate('/auth');
    }

    if (!response.ok) {
      const errData = await response.json();
      setError(errData.message);
    }

    const data = await response.json();
    localStorage.setItem('curUser', JSON.stringify(data.curUser));
    return navigate('/');
  };

  return (
    <>
      <Navbar />
      <div className='auth'>
        <h1>{!isMode ? 'Login' : 'Sign Up'}</h1>
        <form className='authForm' onSubmit={submitHandler}>
          {error && <p className='errMess'>{error}</p>}
          <input type='email' ref={emailRef} required />
          <input type='password' ref={passRef} required />
          <button>{!isMode ? 'Login' : 'Sign Up'}</button>
        </form>
      </div>
    </>
  );
};

export default Auth;
