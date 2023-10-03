import { useLoaderData } from 'react-router-dom';

import InfoBoard from './users/InfoBoard';
import styles from './Users.module.css';
import Transaction from './users/Transaction';

const Users = () => {
  const data = useLoaderData();

  const users = data.users;
  const orders = data.orders;
  const earnings = `$ ${data.earnings}`;
  const balance = `$ ${data.balance.toFixed(2)}`;
  const transactions = data.transactions.slice().reverse().slice(0, 8);

  return (
    <section>
      <div className={styles.cardItems}>
        <InfoBoard p='USERS' num={users} />
        <InfoBoard p='ORDERS' num={orders} />
        <InfoBoard p='EARNINGS' num={earnings} />
        <InfoBoard p='BALANCE' num={balance} />
      </div>

      <div style={{ marginTop: '42px' }}>
        <Transaction transactions={transactions} title='Latest Transactions' />
      </div>
    </section>
  );
};

export default Users;

export const loader = async () => {
  const token = JSON.parse(localStorage.getItem('token')) || null;

  return await fetch('http://localhost:8080/admin/dashboard', {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
};
