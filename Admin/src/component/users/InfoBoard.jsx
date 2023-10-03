import Card from '../card/Card';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import styles from './InfoBoard.module.css';

const InfoBoard = ({ p, num }) => {
  let icon;
  let iconClass;

  switch (p) {
    case 'USERS':
      icon = <PersonOutlineIcon />;
      iconClass = 'redCl';
      break;

    case 'ORDERS':
      icon = <ShoppingCartIcon />;
      iconClass = 'yellowCl';
      break;

    case 'EARNINGS':
      icon = <MonetizationOnIcon />;
      iconClass = 'greenCl';
      break;
    case 'BALANCE':
      icon = <AccountBalanceWalletIcon />;
      iconClass = 'purpleCl';
      break;
    default:
      break;
  }

  return (
    <Card>
      <p className={styles.p}>{p}</p>
      <p className={styles.num}>{num}</p>
      <i className={`${styles.icon} ${styles[iconClass]}`}>{icon}</i>
    </Card>
  );
};

export default InfoBoard;
