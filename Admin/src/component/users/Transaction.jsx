import { format } from 'date-fns';

import Cart from '../card/Card';

import styles from './transaction.module.css';

const Transaction = ({ transactions, title }) => {
  return (
    <Cart>
      <h1 className={styles.h1}>{title}</h1>
      <table className={styles.userTable}>
        <thead>
          <tr>
            <td>
              <input type='checkbox' />
            </td>
            <td>ID</td>
            <td>User</td>
            <td>Room</td>
            <td>Date</td>
            <td>Price</td>
            <td>Pay Method</td>
            <td>Status</td>
          </tr>
        </thead>
        <tbody>
          {transactions &&
            transactions.map(mov => {
              const dateStart = new Date(mov.dateStart);
              const dateEnd = new Date(mov.dateEnd);
              const formattedDateStart = format(dateStart, 'dd/MM/yyyy');
              const formattedDateEnd = format(dateEnd, 'dd/MM/yyyy');

              return (
                <tr key={mov._id}>
                  <td>
                    <input type='checkbox' />
                  </td>
                  <td>{mov._id}</td>
                  <td>{mov.user}</td>
                  <td>{mov.room.join(',')}</td>
                  <td>
                    {formattedDateStart} - {formattedDateEnd}
                  </td>
                  <td>{mov.price}</td>
                  <td>{mov.payment}</td>
                  <td>
                    <p
                      className={`${
                        mov.status === 'Booked'
                          ? styles.sttBk
                          : mov.status === 'Checkin'
                          ? styles.sttCi
                          : mov.status === 'Checkout'
                          ? styles.sttCo
                          : ''
                      }`}
                    >
                      {mov.status}
                    </p>
                  </td>
                </tr>
              );
            })}
          <tr>
            <td></td>
          </tr>
        </tbody>
      </table>
      <div className={styles.page}>
        <p>
          1-{transactions.length} of {transactions.length} &nbsp; &nbsp; &lt;
          &nbsp; &gt;
        </p>
      </div>
    </Cart>
  );
};

export default Transaction;
