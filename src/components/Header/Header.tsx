import { Link } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import { home, login, register } from 'constants/routes';
import UserMenu from 'components/UserMenu';

import styles from './styles.css';
import buttonStyles from 'styles/button.css';
import templateStyles from 'styles/template.css';

export default () => {
  const user = useAuth()

  return (
    <header className={styles.header}>
      <div className={templateStyles.container}>
        <Link className={styles.logo} to={home}>I Visit It</Link>
        <div className={styles.rigtPart}>
          {user && <UserMenu />}
          {!user && <Link className={buttonStyles.button} to={login}>Login</Link>}
          {!user && <Link className={buttonStyles.button} to={register}>Register</Link>}
        </div>
      </div>
    </header>
  )
}
