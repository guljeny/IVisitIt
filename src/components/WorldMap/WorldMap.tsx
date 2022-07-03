import { useMemo } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { getDatabase, ref, onValue, set } from "firebase/database";
import useAuth from 'hooks/useAuth';
import firebaseApp from 'utils/firebase/firebaseApp';
import { svgParams, pathConfig } from 'constants/world';

import styles from './styles.css';

const db = getDatabase(firebaseApp);

export default () => {
  const user = useAuth();
  const { listId } = useParams();
  const isOwner = user && user.uid === listId;
  const mapRef = useMemo(() => ref(db, 'maps/' + listId), [listId]);

  return (
    <div className={styles.worldMapContainer}>
      <svg viewBox={svgParams.viewBox}>
        {pathConfig.map(({ d }) => (
          <path d={d} key={d} />
        ))}
      </svg>
    </div>
  );
}
