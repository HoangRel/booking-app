import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar';
import Header from '../../components/header/Header';
import MailList from '../../components/mailList/MailList';
import BookingForm from '../../components/bookingForm/BookingForm';
import Footer from '../../components/footer/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faLocationDot,
} from '@fortawesome/free-solid-svg-icons';

import './hotel.css';
const Hotel = () => {
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [openBooking, setOpenBooking] = useState(false);
  const [rooms, setRooms] = useState(null);

  const data = useLoaderData();

  const handleOpen = i => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = direction => {
    let newSlideNumber;

    if (direction === 'l') {
      newSlideNumber = slideNumber === 0 ? 5 : slideNumber - 1;
    } else {
      newSlideNumber = slideNumber === 5 ? 0 : slideNumber + 1;
    }

    setSlideNumber(newSlideNumber);
  };

  const fetctRooms = async url => {
    const user = JSON.parse(localStorage.getItem('curUser')) || null;
    let token;
    if (user) {
      token = user.token;
    }

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });

      if (!response.ok) {
        throw new Error('ERROR');
      }

      const data = await response.json();
      setRooms(data);
    } catch (err) {
      console.log(err);
    }
  };

  const openBookingHandler = data => {
    const double = data.rooms[0] || null;
    const twin = data.rooms[1] || null;

    const url = `http://localhost:8080/room/findById?double=${double}&twin=${twin}`;

    fetctRooms(url);
    setOpenBooking(true);
  };

  return (
    <div>
      <Navbar />
      <Header type='list' />
      <div className='hotelContainer'>
        {open && (
          <div className='slider'>
            <FontAwesomeIcon
              icon={faCircleXmark}
              className='close'
              onClick={() => setOpen(false)}
            />
            <FontAwesomeIcon
              icon={faCircleArrowLeft}
              className='arrow'
              onClick={() => handleMove('l')}
            />
            <div className='sliderWrapper'>
              <img
                src={data.photos[slideNumber]}
                alt=''
                className='sliderImg'
              />
            </div>
            <FontAwesomeIcon
              icon={faCircleArrowRight}
              className='arrow'
              onClick={() => handleMove('r')}
            />
          </div>
        )}
        {data && (
          <div className='hotelWrapper'>
            <button
              className='bookNow'
              onClick={() => openBookingHandler(data)}
            >
              Reserve or Book Now!
            </button>
            <h1 className='hotelTitle'>{data.name}</h1>
            <div className='hotelAddress'>
              <FontAwesomeIcon icon={faLocationDot} />
              <span>{data.address}</span>
            </div>
            <span className='hotelDistance'>
              Excellent location – {data.distance}m from center
            </span>
            <span className='hotelPriceHighlight'>
              Book a stay over ${data.cheapestPrice} at this property and get a
              free airport taxi
            </span>
            <div className='hotelImages'>
              {data.photos.map((photo, i) => (
                <div className='hotelImgWrapper' key={i}>
                  <img
                    onClick={() => handleOpen(i)}
                    src={photo}
                    alt=''
                    className='hotelImg'
                  />
                </div>
              ))}
            </div>
            <div className='hotelDetails'>
              <div className='hotelDetailsTexts'>
                <h1 className='hotelTitle'>{data.name}</h1>
                <p className='hotelDesc'>{data.desc}</p>
              </div>
              <div className='hotelDetailsPrice'>
                <h1>Perfect for a 9-night stay!</h1>
                <span>
                  Located in the real heart of Krakow, this property has an
                  excellent location score of {data.rating}✩!
                </span>
                <h2>
                  <b>${data.cheapestPrice * 9}</b> (9 nights)
                </h2>
                <button onClick={() => openBookingHandler(data)}>
                  Reserve or Book Now!
                </button>
              </div>
            </div>
          </div>
        )}
        {openBooking && rooms && <BookingForm hotel={data} rooms={rooms} />}
        <MailList />
        <Footer />
      </div>
    </div>
  );
};

export default Hotel;

export async function loader({ params }) {
  const hotelId = params.id;
  return fetch(`http://localhost:8080/hotel/${hotelId}`);
}
