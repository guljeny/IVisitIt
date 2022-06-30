import { Link } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import { home, login, register } from 'constants/routes';
import UserMenu from 'components/UserMenu';

import styles from './styles.css';
import templateStyles from 'styles/template.css';

export default () => {
  const user = useAuth()

  return (
    <header className={styles.header}>
      <div className={templateStyles.container}>
        <Link className={styles.logo} to={home}>Task Queue</Link>
        <div>
          {user && <UserMenu />}
          {!user && <Link to={login}>Login</Link>}
          {!user && <Link to={register}>Register</Link>}
        </div>
      </div>
    </header>
  )
}
