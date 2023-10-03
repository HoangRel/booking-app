import React, { useEffect, useState } from 'react';

import { DateRange } from 'react-date-range';

import { useNavigate } from 'react-router-dom';

import './bookingForm.css';

const BookingForm = ({ hotel, rooms }) => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('curUser')) || null;

  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  const [dateString, setDateString] = useState({
    startFormattedDate: 'to day',
    endFormattedDate: 'to day',
  });

  useEffect(() => {
    let startFormattedDate;
    if (date[0].startDate) {
      startFormattedDate = date[0].startDate.toLocaleDateString('en-US', {
        month: 'long',
        day: '2-digit',
        year: 'numeric',
      });
    }

    let endFormattedDate;
    if (date[0].endDate) {
      endFormattedDate = date[0].endDate.toLocaleDateString('en-US', {
        month: 'long',
        day: '2-digit',
        year: 'numeric',
      });
    }

    setDateString({ startFormattedDate, endFormattedDate });
  }, [date, date[0].startDate, date[0].endDate]);

  const [fullName, setFullName] = useState(
    user && user.fullName ? user.fullName : ''
  );
  const [email, setEmail] = useState(user && user.email ? user.email : '');
  const [phoneNumber, setPhoneNumber] = useState(
    user && user.phoneNumber ? user.phoneNumber : ''
  );
  const [card, setCart] = useState('');

  // const [doubleRooms, setDoubleRooms] = useState(rooms.doubleRooms);
  // const [twinRooms, setTwinRooms] = useState(rooms.twinRooms);

  const doubleRooms = rooms.doubleRooms;
  const twinRooms = rooms.twinRooms;

  const [selectedDoubleRooms, setSelectedDoubleRooms] = useState([]);
  const [selectedTwinRooms, setSelectedTwinRooms] = useState([]);

  const [totalPrice, setTotalPrice] = useState(0);
  const [payment, setPayment] = useState('');

  const [dateSelected, setDateSeleted] = useState(false);

  const handleDoubleRoomSelect = (roomNumber, isSelected) => {
    if (isSelected) {
      // Nếu checkbox được chọn, thêm giá trị của phòng vào mảng selectedRooms
      setSelectedDoubleRooms(prevSelectedRooms => [
        ...prevSelectedRooms,
        roomNumber,
      ]);
    } else {
      // Nếu checkbox bị bỏ chọn, xóa giá trị của phòng khỏi mảng selectedRooms
      setSelectedDoubleRooms(prevSelectedRooms =>
        prevSelectedRooms.filter(room => room !== roomNumber)
      );
    }
  };

  const handleTwinRoomSelect = (roomNumber, isSelected) => {
    if (isSelected) {
      // Nếu checkbox được chọn, thêm giá trị của phòng vào mảng selectedRooms
      setSelectedTwinRooms(prevSelectedRooms => [
        ...prevSelectedRooms,
        roomNumber,
      ]);
    } else {
      // Nếu checkbox bị bỏ chọn, xóa giá trị của phòng khỏi mảng selectedRooms
      setSelectedTwinRooms(prevSelectedRooms =>
        prevSelectedRooms.filter(room => room !== roomNumber)
      );
    }
  };

  useEffect(() => {
    // Lấy ngày nhận và trả phòng từ giá trị date
    const startDate = date[0].startDate;
    const endDate = date[0].endDate;

    // Tính số mili giây giữa hai ngày
    const timeDiff = endDate.getTime() - startDate.getTime();

    // Chuyển đổi số mili giây sang số ngày
    const dayDiff = timeDiff / (1000 * 3600 * 24);

    if (dayDiff === 0) {
      setDateSeleted(false);
    } else {
      setDateSeleted(true);
    }

    // Gọi API để lấy dữ liệu về các phòng trống
    // mặc định phòng có trong CSDL hotel.rooms là phòng đang trống.

    // tính total price
    let doubleRoomsPrice = 0;
    if (doubleRooms) {
      doubleRoomsPrice =
        doubleRooms[0].price * dayDiff * selectedDoubleRooms.length;
    }

    let twinRoomsPrice = 0;
    if (twinRooms) {
      twinRoomsPrice = twinRooms[0].price * dayDiff * selectedTwinRooms.length;
    }

    setTotalPrice(() => doubleRoomsPrice + twinRoomsPrice);
  }, [date, selectedDoubleRooms, selectedTwinRooms, doubleRooms, twinRooms]);

  const changePaymentHandler = event => {
    setPayment(event.target.value);
  };

  const submitReserveHandler = event => {
    event.preventDefault();
    if (!dateSelected) {
      return window.alert('Chọn ngày!');
    }

    const validateForm =
      fullName.trim().length > 0 &&
      email.trim().length > 0 &&
      phoneNumber.trim().length > 0;
    if (!validateForm) {
      return window.alert('Điền thông tin liên hệ!');
    }

    const validateCheckbox =
      selectedDoubleRooms.length > 0 || selectedTwinRooms.length > 0;

    if (!validateCheckbox) {
      return window.alert('Chọn ít nhất 1 phòng!');
    }

    const validatePayment = payment === 'credit' || payment === 'cash';

    if (!validatePayment) {
      return window.alert('Chọn phương thức thanh toán!');
    }

    bookingHandler();
  };

  async function bookingHandler() {
    try {
      const curUser = JSON.parse(localStorage.getItem('curUser')) || null;

      if (!curUser) {
        return window.alert('Yêu cầu đăng nhập!');
      }

      const token = curUser.token;

      const rooms = [...selectedDoubleRooms, ...selectedTwinRooms];

      const data = {
        user: curUser.username,
        hotel: hotel._id,
        room: rooms,
        dateStart: date[0].startDate,
        dateEnd: date[0].endDate,
        price: totalPrice,
        payment: payment,
        status: 'Booked',
      };

      const response = await fetch('http://localhost:8080/transaction/booked', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(data),
      });

      if (response.status === 401) {
        const resData = await response.json();
        return window.alert(resData.message);
      }

      if (!response.ok) {
        throw new Error('ERROR');
      }

      const resData = await response.json();

      window.alert(resData.message);

      return navigate('/transactions');
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <section className='section'>
      <div className='checkForm'>
        <div className='dates'>
          <h2>Dates</h2>
          <DateRange
            editableDateInputs={true}
            onChange={item => setDate([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={date}
            className='datee'
            minDate={new Date()}
          />
        </div>
        <div>
          <h2>Reserve Info</h2>
          <form className='formInfo'>
            <label htmlFor='fn'>Your Full Name</label>
            <input
              id='fn'
              value={fullName}
              placeholder='Full Name'
              onChange={event => {
                setFullName(event.target.value);
              }}
            />
            <label htmlFor='eml'>Your Email</label>
            <input
              id='eml'
              value={email}
              placeholder='Your Email'
              onChange={event => {
                setEmail(event.target.value);
              }}
            />
            <label htmlFor='pn'>Your Phone Number</label>
            <input
              id='pn'
              value={phoneNumber}
              placeholder='Phone Number'
              onChange={event => {
                setPhoneNumber(event.target.value);
              }}
            />
            <label htmlFor='icn'>Your Identity Cart Number</label>
            <input
              id='icn'
              value={card}
              placeholder='Card Number'
              onChange={event => {
                setCart(event.target.value);
              }}
            />
          </form>
        </div>
        <div className='select'>
          <h2>Select Rooms</h2>
          <div>
            {rooms && doubleRooms && (
              <div>
                <div>
                  <p>
                    <strong>Budget Double Room</strong>
                  </p>
                  <p>Pay nothing until {dateString.startFormattedDate}</p>
                  <p className='maxP'>
                    Max people: <strong>{doubleRooms[0].maxPeople}</strong>
                  </p>
                  <span>${doubleRooms[0].price}</span>
                </div>
                <div className='roomNum'>
                  {doubleRooms[0].roomNumbers.map(room => (
                    <label key={room}>
                      {room}
                      <input
                        type='checkbox'
                        value={room}
                        onChange={event =>
                          handleDoubleRoomSelect(room, event.target.checked)
                        }
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}
            {rooms && twinRooms && (
              <div>
                <div>
                  <p>
                    <strong>Budget Twin Room</strong>
                  </p>
                  <p>Free cancellation before {dateString.endFormattedDate}</p>
                  <p className='maxP'>
                    Max people: <strong>{twinRooms[0].maxPeople}</strong>
                  </p>
                  <span>${twinRooms[0].price}</span>
                </div>
                <div className='roomNum'>
                  {twinRooms[0].roomNumbers.map(room => (
                    <label key={room}>
                      {room}
                      <input
                        type='checkbox'
                        value={room}
                        onChange={event =>
                          handleTwinRoomSelect(room, event.target.checked)
                        }
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <h2>Total Bill: ${totalPrice}</h2>
      <div className='reserveBtn'>
        <select
          value={payment}
          className='payment'
          onChange={changePaymentHandler}
        >
          <option value=''>Select Payment Method</option>
          <option value='credit'>Credit</option>
          <option value='cash'>cash</option>
        </select>
        <button type='submit' onClick={submitReserveHandler}>
          Reserve Now
        </button>
      </div>
    </section>
  );
};

export default BookingForm;
