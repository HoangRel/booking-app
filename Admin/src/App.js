import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';

import Dashboard from './page/Dashboard';
import Login from './component/Login';
import AuthProvider from './context/AuthProvider';

import Users, { loader as dashboardLoader } from './component/Users';
import Hotels, { loader as hotelsLoader } from './component/Hotels';
import Rooms, { loader as roomsLoader } from './component/Rooms';
import Transactions, { loader as transLoader } from './component/Transactions';
import NewHotel, { action as hotelAction } from './component/NewHotel';
import NewRoom, {
  action as roomAction,
  loader as hotelofRoomLoader,
} from './component/NewRoom';
import { action as logoutAction } from './component/Logout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to='login' />,
  },
  {
    path: 'login',
    element: <Login />,
  },
  { path: 'logout', action: logoutAction },
  {
    path: 'admin',
    element: <Dashboard />,
    children: [
      { index: true, element: <Users />, loader: dashboardLoader },
      { path: 'hotels', element: <Hotels />, loader: hotelsLoader },
      { path: 'rooms', element: <Rooms />, loader: roomsLoader },
      {
        path: 'transactions',
        element: <Transactions />,
        loader: transLoader,
      },
      { path: 'newHotel', element: <NewHotel />, action: hotelAction },
      {
        path: 'newRoom',
        element: <NewRoom />,
        action: roomAction,
        loader: hotelofRoomLoader,
      },
    ],
  },
  { path: '*', element: <Navigate to='login' /> },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
