// import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/home/Home';
import Hotel, { loader as hotelLoader } from './pages/hotel/Hotel';
import List from './pages/list/List';
import Auth from './pages/auth/Auth';
import Transactions, {
  loader as TransLoader,
} from './pages/transactions/Transactions';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/auth',
    element: <Auth />,
  },
  { path: '/hotels', element: <List /> },
  { path: '/hotels/:id', element: <Hotel />, loader: hotelLoader },
  { path: '/transactions', element: <Transactions />, loader: TransLoader },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
