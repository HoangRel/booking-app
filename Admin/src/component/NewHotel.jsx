import { useState, useEffect } from 'react';
import { Form, useLocation, useSearchParams, redirect } from 'react-router-dom';
import Card from './card/Card';
import styles from './NewHotel.module.css';

const NewHotel = () => {
  const [hotelId, setHotelId] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [distance, setDistance] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState('');
  const [featured, setFeatured] = useState('No');
  const [rooms, setRooms] = useState('');

  const [searchParams] = useSearchParams();
  const edit = searchParams.get('edit');

  const { state } = useLocation();

  useEffect(() => {
    if (state && edit) {
      const token = JSON.parse(localStorage.getItem('token')) || null;

      const fetchRoomsOnce = async () => {
        try {
          const roomIds = await Promise.all(
            state.rooms.map(async room => {
              const response = await fetch(
                `http://localhost:8080/admin/getRoomById/${room}`,
                {
                  headers: {
                    Authorization: 'Bearer ' + token,
                  },
                }
              );
              const data = await response.json();
              return data ? data.nameRoom : room;
            })
          );
          setRooms(roomIds.join('\n'));
        } catch (err) {
          console.log(err);
        }
      };
      fetchRoomsOnce();
    }
  }, [state, edit]);

  useEffect(() => {
    if (state && edit) {
      setIsEdit(true);
      setHotelId(state._id);
      setName(state.name);
      setType(state.type);
      setCity(state.city);
      setAddress(state.address);
      setDistance(state.distance);
      setTitle(state.name);
      setDesc(state.desc);
      setImages(state.photos.join('\n'));
      setFeatured(state.featured);
      setPrice(state.cheapestPrice);
    } else {
      setIsEdit(false);
      setRooms('');
      setHotelId('');
      setName('');
      setType('');
      setCity('');
      setAddress('');
      setDistance('');
      setTitle('');
      setDesc('');
      setImages('');
      setFeatured('');
      setPrice('');
    }
  }, [state, edit]);

  return (
    <section>
      <div className={styles.title}>
        <Card>
          <p>{!isEdit ? 'Add New Product' : 'Edit Hotel'}</p>
        </Card>
      </div>
      <Card>
        <Form className={styles.form} method={!isEdit ? 'POST' : 'PUT'}>
          <label htmlFor='name'>
            Name
            <input
              type='text'
              id='name'
              required
              value={name}
              onChange={e => setName(e.target.value)}
              name='name'
            />
          </label>
          <label htmlFor='type'>
            Type
            <input
              type='text'
              id='type'
              required
              value={type}
              onChange={e => setType(e.target.value)}
              name='type'
            />
          </label>
          <label htmlFor='city'>
            City
            <input
              type='text'
              id='city'
              required
              value={city}
              onChange={e => setCity(e.target.value)}
              name='city'
            />
          </label>
          <label htmlFor='address'>
            Address
            <input
              type='text'
              id='address'
              required
              value={address}
              onChange={e => setAddress(e.target.value)}
              name='address'
            />
          </label>
          <label htmlFor='distance'>
            Distance from City Center
            <input
              type='text'
              id='distance'
              required
              value={distance}
              onChange={e => setDistance(e.target.value)}
              name='distance'
            />
          </label>
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
          <label htmlFor='images'>
            Images
            <textarea
              type='text'
              id='images'
              required
              value={images}
              onChange={e => setImages(e.target.value)}
              name='images'
            />
          </label>
          <div>
            <p>Featured</p>
            <select
              value={featured}
              onChange={e => setFeatured(e.target.value)}
              name='featured'
            >
              <option value='false'>No</option>
              <option value='true'>Yes</option>
            </select>
          </div>
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
          <input type='hidden' value={hotelId} name='id' />
          <button type='submit'>{!isEdit ? 'Send' : 'Edit'}</button>
        </Form>
      </Card>
    </section>
  );
};

export default NewHotel;

export async function action({ request }) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const edit = searchParams.get('edit');

    const data = await request.formData();
    const reqData = {
      id: data.get('id') || null,
      name: data.get('name'),
      type: data.get('type'),
      city: data.get('city'),
      address: data.get('address'),
      distance: data.get('distance'),
      title: data.get('title'),
      desc: data.get('desc'),
      price: data.get('price'),
      photos: data.get('images'),
      featured: data.get('featured'),
      rooms: data.get('rooms'),
    };

    reqData.photos = reqData.photos.split('\n').map(url => url.trim());
    reqData.rooms = reqData.rooms.split('\n').map(room => room.trim());

    const validate =
      reqData.name.trim() === '' ||
      reqData.type.trim() === '' ||
      reqData.city.trim() === '' ||
      reqData.address.trim() === '' ||
      reqData.distance.trim() === '' ||
      reqData.title.trim() === '' ||
      reqData.desc.trim() === '' ||
      reqData.price.trim() === '' ||
      reqData.photos.length === 0 ||
      reqData.rooms.length === 0;

    if (validate) {
      return window.alert('Cần nhập đầy đủ thông tin!');
    }

    const token = JSON.parse(localStorage.getItem('token')) || null;

    let url = 'http://localhost:8080/admin/addNewHotel';

    if (edit) {
      const id = data.get('id');
      url = `http://localhost:8080/admin/editHotel/${id}`;
    }

    const response = await fetch(url, {
      method: request.method,
      body: JSON.stringify(reqData),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    });

    if (!response.ok) {
      throw new Error('ERROR');
    }

    const resData = await response.json();

    window.alert(resData.message);
    return redirect('/admin/hotels');
  } catch (err) {
    console.log(err.message);
  }
}
