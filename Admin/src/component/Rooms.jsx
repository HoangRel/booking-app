import { useLoaderData, Link, useNavigate } from 'react-router-dom';
import Cart from './card/Card';
import styles from './Hotels.module.css';

const Rooms = () => {
  const rooms = useLoaderData();
  const navigate = useNavigate();

  async function fetchDeleteHotel(id) {
    try {
      const token = JSON.parse(localStorage.getItem('token')) || null;
      const response = await fetch(
        `http://localhost:8080/admin/deleteRoom/${id}`,
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
      navigate('/admin/rooms', { replace: true });
      return window.alert(data.message);
    } catch (err) {
      console.log(err.message);
    }
  }

  const deleteHanlder = room => {
    const confirmDelete = window.confirm('Xoá phòng này?');
    if (confirmDelete) {
      fetchDeleteHotel(room._id);
    }
  };

  const editHandler = hotel => {
    navigate('/admin/newRoom?edit=true', { state: hotel });
  };

  return (
    <Cart>
      <div className={styles.firstDiv}>
        <h1>Rooms List</h1>
        <Link to='/admin/newRoom'>Add New</Link>
      </div>
      <table className={styles.userTable}>
        <thead>
          <tr>
            <td>
              <input type='checkbox' />
            </td>
            <td>ID</td>
            <td>Title</td>
            <td>Description</td>
            <td>Price</td>
            <td>Max People</td>
            <td>Action</td>
            <td>Edit</td>
          </tr>
        </thead>
        <tbody>
          {rooms &&
            rooms.map(mov => (
              <tr key={mov._id}>
                <td>
                  <input type='checkbox' />
                </td>
                <td>{mov._id}</td>
                <td>{mov.title}</td>
                <td>
                  {mov.desc.length > 50
                    ? mov.desc.slice(0, 50) + '...'
                    : mov.desc}
                </td>

                <td>{mov.price}</td>
                <td>{mov.maxPeople}</td>
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

export default Rooms;

export const loader = async () => {
  const token = JSON.parse(localStorage.getItem('token')) || null;

  return await fetch('http://localhost:8080/admin/getRooms', {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
};
