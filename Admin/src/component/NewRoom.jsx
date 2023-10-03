import { useState, useEffect } from 'react';
import {
  Form,
  useLocation,
  useSearchParams,
  redirect,
  useLoaderData,
} from 'react-router-dom';
import Card from './card/Card';
import styles from './NewRoom.module.css';

const NewHotel = () => {
  const [roomId, setRoomId] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [maxPeople, setMaxPeople] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [hotel, setHotel] = useState('');
  const [rooms, setRooms] = useState('');
  const [hotels, setHotels] = useState([]);

  const [searchParams] = useSearchParams();
  const edit = searchParams.get('edit');

  const { state } = useLocation();

  const data = useLoaderData();

  const fetchHotel = async id => {
    const token = JSON.parse(localStorage.getItem('token')) || null;
    const response = await fetch(
      `http://localhost:8080/admin/getHotelofRoomId/${id}`,
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    );
    const [reqData] = await response.json();

    if (!reqData) {
      return setHotels(data);
    }
    setHotels([reqData]);
  };

  useEffect(() => {
    if (state && edit) {
      setHotels(data);
      setRoomId(state._id);
      fetchHotel(state._id);
      setIsEdit(true);
      setTitle(state.title);
      setDesc(state.desc);
      setRooms(state.roomNumbers.join('\n'));
      setPrice(state.price);
      setMaxPeople(state.maxPeople);
    } else {
      setHotels(data);
      setRoomId('');
      setIsEdit(false);
      setTitle('');
      setDesc('');
      setRooms('');
      setPrice('');
      setMaxPeople('');
    }
  }, [state, edit, data]);

  return (
    <section>
      <div className={styles.title}>
        <Card>
          <p>{!isEdit ? 'Add New Room' : 'Edit Room'}</p>
        </Card>
      </div>
      <Card>
        <Form className={styles.form} method={!isEdit ? 'POST' : 'PUT'}>
          <label htmlFor='title'>
            Title
            <input
              type='text'
              id='title'
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              name='title'
            />
          </label>
          <label htmlFor='desc'>
            Description
            <input
              id='desc'
              type='text'
              required
              value={desc}
              onChange={e => setDesc(e.target.value)}
              name='desc'
            />
          </label>
          <label htmlFor='price'>
            Price
            <input
              type='number'
              id='price'
              required
              value={price}
              onChange={e => setPrice(e.target.value)}
              name='price'
            />
          </label>
          <label htmlFor='distance'>
            Max People
            <input
              type='number'
              id='maxPeople'
              required
              value={maxPeople}
              onChange={e => setMaxPeople(e.target.value)}
              name='maxPeople'
            />
          </label>

          <div className={styles.endForm}>
            <label htmlFor='rooms' className={styles.rooms}>
              Rooms
              <textarea
                type='text'
                id='rooms'
                value={rooms}
                onChange={e => setRooms(e.target.value)}
                name='rooms'
              />
            </label>
            <div>
              <p>Chosse a hotel</p>
              <select
                value={hotel}
                onChange={e => setHotel(e.target.value)}
                name='hotel'
                // multiple
              >
                {hotels.length > 0 &&
                  hotels.map(hotel => (
                    <option value={hotel._id} key={hotel._id}>
                      {hotel.name}
                    </option>
                  ))}
              </select>
            </div>
            <input type='hidden' value={roomId} name='id' />
            <button type='submit'>{!isEdit ? 'Send' : 'Edit'}</button>
          </div>
        </Form>
      </Card>
    </section>
  );
};

export default NewHotel;

export async function action({ request, params }) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const edit = searchParams.get('edit');

    const data = await request.formData();
    const reqData = {
      id: data.get('id') || null,
      title: data.get('title'),
      desc: data.get('desc'),
      price: data.get('price'),
      maxPeople: data.get('maxPeople'),
      roomNumbers: data.get('rooms'),
      hotelId: data.get('hotel'),
    };

    reqData.roomNumbers = reqData.roomNumbers
      .split('\n')
      .map(room => room.trim());

    const validate =
      reqData.title.trim() === '' ||
      reqData.desc.trim() === '' ||
      reqData.price.trim() === '' ||
      reqData.maxPeople.trim() === '' ||
      reqData.roomNumbers.length === 0;

    if (validate) {
      window.alert('Cần nhập đầy đủ thông tin!');
      return null;
    }
    const priceInput = parseFloat(reqData.price);
    if (isNaN(priceInput)) {
      window.alert('price phải là một số!');
      return null;
    }

    const maxPeopleInput = parseInt(reqData.maxPeople);
    if (isNaN(maxPeopleInput)) {
      window.alert('maxPeople phải là một số!');
      return null;
    }

    const token = JSON.parse(localStorage.getItem('token')) || null;

    let url = 'http://localhost:8080/admin/addNewRoom';

    if (edit) {
      const id = data.get('id');
      url = `http://localhost:8080/admin/editRoom/${id}`;
    }

    const response = await fetch(url, {
      method: request.method,
      body: JSON.stringify(reqData),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    });

    if (response.status === 500) {
      const data = await response.json();
      window.alert(data.message);
      return null;
    }

    if (!response.ok) {
      throw new Error('ERROR');
    }

    const resData = await response.json();

    window.alert(resData.message);
    return redirect('/admin/rooms');
  } catch (err) {
    window.alert(err.message);
    return null;
  }
}

export const loader = async () => {
  const token = JSON.parse(localStorage.getItem('token')) || null;

  return await fetch('http://localhost:8080/admin/getNameAndIdHotels', {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
};
