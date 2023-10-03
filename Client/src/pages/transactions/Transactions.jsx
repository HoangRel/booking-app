import { useEffect } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Footer from '../../components/footer/Footer';
import Header from '../../components/header/Header';
import MailList from '../../components/mailList/MailList';
import Navbar from '../../components/navbar/Navbar';

import './transactions.css';

const Transactions = () => {
  const navigate = useNavigate();
  const data = useLoaderData();

  useEffect(() => {
    if (!data) {
      navigate('/');
    }
  }, [data, navigate]);

  return (
    <>
      <Navbar />
      <Header type='list' />
      <main className='transMain'>
        <h2>Your Transactions</h2>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Hotel</th>
              <th>Room</th>
              <th>Date</th>
              <th>Price</th>
              <th>Pay Method</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((mov, i) => {
                const index = (i + 1).toString().padStart(2, '0');
                const dateStart = new Date(mov.dateStart);
                const dateEnd = new Date(mov.dateEnd);
                const formattedDateStart = format(dateStart, 'dd/MM/yyyy');
                const formattedDateEnd = format(dateEnd, 'dd/MM/yyyy');

                return (
                  <tr key={i}>
                    <th>{index}</th>
                    <th>{mov.hotel}</th>
                    <th>{mov.room.join(',')}</th>
                    <th>
                      {formattedDateStart} - {formattedDateEnd}
                    </th>
                    <th>${mov.price}</th>
                    <th>{mov.payment}</th>
                    <th>
                      <p
                        className={
                          mov.status === 'Booked'
                            ? 'sttBk'
                            : mov.status === 'Checkin'
                            ? 'sttCi'
                            : mov.status === 'Checkout'
                            ? 'sttCo'
                            : ''
                        }
                      >
                        {mov.status}
                      </p>
                    </th>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </main>
      <MailList />
      <Footer />
    </>
  );
};

export default Transactions;

export async function loader() {
  const curUser = JSON.parse(localStorage.getItem('curUser')) || null;

  if (!curUser) {
    return null;
  }
  const token = curUser.token;

  return fetch('http://localhost:8080/transaction/history', {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
}
