import { useEffect, useContext } from 'react';
import { useNavigate, Outlet, Link, useSubmit } from 'react-router-dom';
import AuthContext from '../context/auth';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import StoreIcon from '@mui/icons-material/Store';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Dashboard = () => {
  const submit = useSubmit();
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    if (!authCtx.isLogged) {
      return navigate('/login');
    }
  }, [authCtx.isLogged, navigate, authCtx]);

  const logoutHandler = () => {
    submit(null, { action: '/logout', method: 'POST' });
    authCtx.onLogout();
  };

  return (
    <section className='DasSec'>
      <h3>Admin Page</h3>
      <div className='div2'></div>
      <div className='div3'>
        <nav>
          <p>Main</p>
          <Link to='/admin'>
            <DashboardIcon className='icons' />
            <p>Dashboard</p>
          </Link>
        </nav>
        <nav>
          <p>Lists</p>
          <Link to='/admin'>
            <PersonOutlineIcon className='icons' />
            <p>Users</p>
          </Link>
          <Link to='/admin/hotels'>
            <StoreIcon className='icons' />
            <p>Hotels</p>
          </Link>
          <Link to='/admin/rooms'>
            <CreditCardIcon className='icons' />
            <p>Rooms</p>
          </Link>
          <Link to='/admin/transactions'>
            <LocalShippingIcon className='icons' />
            <p>Transactions</p>
          </Link>
        </nav>
        <nav>
          <p>New</p>
          <Link to='/admin/newHotel'>
            <StoreIcon className='icons' />
            <p>New Hotel</p>
          </Link>
          <Link to='/admin/newRoom'>
            <CreditCardIcon className='icons' />
            <p>New Room</p>
          </Link>
        </nav>
        <nav>
          <p>User</p>
          <li id='onLogout' onClick={logoutHandler}>
            <ExitToAppIcon className='icons' />
            <p>Logout</p>
          </li>
        </nav>
      </div>
      <main className='mainDiv'>{authCtx.isLogged && <Outlet />}</main>
    </section>
  );
};

export default Dashboard;
