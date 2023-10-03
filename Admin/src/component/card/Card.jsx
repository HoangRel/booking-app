import styles from './card.module.css';

const Cart = props => {
  return <div className={styles.card}>{props.children}</div>;
};

export default Cart;
