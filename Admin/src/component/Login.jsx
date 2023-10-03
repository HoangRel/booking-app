import { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/auth';
import { useEffect } from 'react';
import styles from './login.module.css';

const Login = () => {
  const [mess, setMess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPage, setLoadingPage] = useState(false);
  const emailRef = useRef();
  const passRef = useRef();

  const navigate = useNavigate();

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    setLoadingPage(false);
    if (authCtx.isLogged) {
      setLoadingPage(true);
      return navigate('/admin');
    }
  }, [authCtx.isLogged, navigate]);

  const fetchAuth = async user => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8080/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email, password: user.password }),
      });

      if (response.status === 401) {
        const data = await response.json();
        setIsLoading(false);

        return setMess(data.message);
      }

      if (!response.ok) {
        setIsLoading(false);
        throw new Error('Lỗi hệ thống');
      }

      const data = await response.json();

      const token = data.token;

      localStorage.setItem('token', JSON.stringify(token));
      authCtx.onLogin();

      setIsLoading(false);
      window.alert(data.message);
      return navigate('/admin');
    } catch (err) {
      setIsLoading(false);
      return setMess(err.message);
    }
  };

  const loginHandler = event => {
    event.preventDefault();

    const emailValue = emailRef.current.value;

    if (emailValue.trim().length === 0 || !emailValue.includes('@')) {
      return setMess('Nhập email hợp lệ');
    }

    const passValue = passRef.current.value;

    if (passValue.length < 3) {
      return setMess('Nhập password từ 3 ký tự');
    }

    setMess(null);

    fetchAuth({ email: emailValue, password: passValue });
  };

  return (
    <section className={styles.section}>
      {isLoadingPage ? (
        <p>Loading...</p>
      ) : (
        <>
          {mess && <p className={styles.mess}>{mess}</p>}
          <form onSubmit={loginHandler}>
            <label>
              Email
              <input type='email' ref={emailRef} />
            </label>
            <label>
              Password
              <input type='password' ref={passRef} />
            </label>
            {!isLoading ? (
              <button type='submit'>Login</button>
            ) : (
              <button disabled>Logging in....</button>
            )}
          </form>
        </>
      )}
    </section>
  );
};

export default Login;
