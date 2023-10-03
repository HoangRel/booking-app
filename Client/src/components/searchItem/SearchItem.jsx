import './searchItem.css';

const SearchItem = ({ name, distance, type, description, rating, photos }) => {
  return (
    <div className='searchItem'>
      <img src={photos[0]} alt='' className='siImg' />
      <div className='siDesc'>
        <h1 className='siTitle'>{name}</h1>
        <span className='siDistance'>{distance} from center</span>
        <span className='siSubtitle'>{description}</span>
        <span className='siFeatures'>{type}</span>
      </div>
      <div className='siDetails'>
        <div className='siRating'>
          <button>{rating}</button>
        </div>
        <div className='siDetailTexts'>
          <span className='siTaxOp'>Includes taxes and fees</span>
          <button className='siCheckButton'>See availability</button>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
