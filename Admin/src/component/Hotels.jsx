import { useLoaderData, Link, useNavigate } from 'react-router-dom';
import Cart from './card/Card';
import styles from './Hotels.module.css';

const Hotels = () => {
  const hotels = useLoaderData();
  const navigate = useNavigate();

  async function fetchDeleteHotel(id) {
    try {
      const token = JSON.parse(localStorage.getItem('token')) || null;
      const response = await fetch(
        `http://localhost:8080/admin/deleteHotel/${id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
        }
      );

      if (response.status === 500) {
        const data = await response.json();
        return window.alert(data.message);
      }

      if (!response.ok) {
        throw new Error('ERROR');
      }

      const data = await response.json();
      navigate('/admin/hotels', { replace: true });
      return window.alert(data.message);
    } catch (err) {
      console.log(err.message);
    }
  }

  const deleteHanlder = hotel => {
    const confirmDelete = window.confirm('Xoá Hotel này?');
    if (confirmDelete) {
      fetchDeleteHotel(hotel._id);
    }
  };

  const editHandler = hotel => {
    navigate('/admin/newHotel?edit=true', { state: hotel });
  };

  return (
    <Cart>
      <div className={styles.firstDiv}>
        <h1>Hotels List</h1>
        <Link to='/admin/newHotel'>Add New</Link>
      </div>
      <table className={styles.userTable}>
        <thead>
          <tr>
            <td>
              <input type='checkbox' />
            </td>
            <td>ID</td>
            <td>Name</td>
            <td>Type</td>
            <td>Title</td>
            <td>City</td>
            <td>Action</td>
            <td>Edit</td>
          </tr>
        </thead>
        <tbody>
          {hotels &&
            hotels.map(mov => (
              <tr key={mov._id}>
                <td>
                  <input type='checkbox' />
                </td>
                <td>{mov._id}</td>
                <td>{mov.name}</td>
                <td>{mov.type}</td>
                <td>{mov.name}</td>
                <td>{mov.city}</td>
                <td className={styles.dete}>
                  <button onClick={() => deleteHanlder(mov)}>Delete</button>
                </td>
                <td className={styles.edit}>
                  <button onClick={() => editHandler(mov)}>Edit</button>
                </td>
              </tr>
            ))}
          <tr>
            <td></td>
          </tr>
        </tbody>
      </table>
    </Cart>
  );
};

export default Hotels;

export const loader = async () => {
  const token = JSON.parse(localStorage.getItem('token')) || null;

  return await fetch('http://localhost:8080/admin/getHotels', {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
};
