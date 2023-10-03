import './featured.css';
import HCMimg from '../../image/cityImg/HCM.jpg';
import DNimg from '../../image/cityImg/DaNang.jpg';
import HNimg from '../../image/cityImg/HaNoi.jpg';

import useFetch from '../../hook/useFetch';

const Featured = () => {
  const { data, isLoading } = useFetch('http://localhost:8080/hotel/city');

  return (
    <div className='featured'>
      {isLoading && <p>Loading...</p>}
      {data && !isLoading && (
        <>
          <div className='featuredItem'>
            <img src={HNimg} alt='' className='featuredImg' />
            <div className='featuredTitles'>
              <h1>Hà Nội</h1>
              <h2>{data.HaNoi.length} properties</h2>
            </div>
          </div>

          <div className='featuredItem'>
            <img src={DNimg} alt='' className='featuredImg' />
            <div className='featuredTitles'>
              <h1>Da Nang</h1>
              <h2>{data.DaNang.length} properties</h2>
            </div>
          </div>
          <div className='featuredItem'>
            <img src={HCMimg} alt='' className='featuredImg' />
            <div className='featuredTitles'>
              <h1>Ho Chi Minh</h1>
              <h2>{data.HoChiMinh.length} properties</h2>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Featured;
