import { useRef, useState } from 'react';
import cn from 'class-names';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import auth from 'utils/firebase/auth';
import { profile } from 'constants/routes';
import useAuth from 'hooks/useAuth';
import useCliclOutside from 'hooks/useClickOutside';

import styles from './styles.css';

export default () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const user = useAuth()
  useCliclOutside(containerRef, () => setIsOpen(false));

  const toggleOpen = () => setIsOpen(prevIsOpen => !prevIsOpen);

  const { email } = user || {};

  return (
    <div className={styles.container} ref={containerRef} onClick={toggleOpen}>
      <div className={styles.avatar}>
        {String(email).slice(0, 2)}
      </div>
      <div className={cn(styles.menu, { [styles.menuVisible]: isOpen })}>
        <Link className={styles.menuButton} to={profile}>Profile</Link>
        <button className={styles.menuButton} onClick={() => signOut(auth)}>Sign out</button>
      </div>
    </div>
  )
}
