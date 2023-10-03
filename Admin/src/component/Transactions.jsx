import { useLoaderData } from 'react-router-dom';

import Transaction from './users/Transaction';

const Transactions = () => {
  const data = useLoaderData();

  const transactions = data.slice().reverse();

  return (
    <>
      <Transaction transactions={transactions} title='Transactions List' />
    </>
  );
};

export default Transactions;

export const loader = async () => {
  const token = JSON.parse(localStorage.getItem('token')) || null;

  return await fetch('http://localhost:8080/admin/getTransactions', {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
};
