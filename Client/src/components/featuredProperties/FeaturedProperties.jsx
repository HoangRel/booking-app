import { Link } from 'react-router-dom';
import useFetch from '../../hook/useFetch';

import './featuredProperties.css';

const FeaturedProperties = () => {
  const { isLoading, data } = useFetch('http://localhost:8080/hotel/top3');

  return (
    <div className='fp'>
      {isLoading && <p>Loading...</p>}
      {!isLoading && data && (
        <>
          {data.map(mov => (
            <div className='fpItem' key={mov._id}>
              <img src={mov.photos[0]} alt='' className='fpImg' />
              <span className='fpName'>
                <Link to={`/hotels/${mov._id}`} target='_blank'>
                  {mov.name}
                </Link>
              </span>
              <span className='fpCity'>{mov.city}</span>
              <span className='fpPrice'>
                Starting from ${mov.cheapestPrice}
              </span>
              <div className='fpRating'>
                <button>{mov.rating}</button>
                <span>Excellent</span>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default FeaturedProperties;
