import { useMemo, useEffect, useState, useCallback } from 'react';
import cn from 'class-names';
import { Navigate, useParams } from 'react-router-dom';
import { getDatabase, ref, onValue, set } from "firebase/database";
import useAuth from 'hooks/useAuth';
import firebaseApp from 'utils/firebase/firebaseApp';
import { svgParams, pathConfig } from 'constants/world';
import ImageViewer from 'components/ImageViewer';

import styles from './styles.css';

const db = getDatabase(firebaseApp);

export default () => {
  const user = useAuth();
  const { mapId } = useParams();
  const [hoverItem, setHoverItem] = useState<string | null>(null);
  const [visitedCountries, setVisitedCountries] = useState<string[]>([]);
  const isOwner = user && user.uid === mapId;
  const mapRef = useMemo(() => ref(db, 'maps/' + mapId), [mapId]);

  const handleMouseMove = useCallback((e) => {
    const itemName = e.target.getAttribute('data-name');
    if (itemName === hoverItem) return;
    setHoverItem(itemName);
  }, [hoverItem]);

  const handleMouseDown = useCallback((e) => {
    if (!user || !isOwner || !hoverItem) return;
    const isVisited = visitedCountries.includes(hoverItem || '');
    if (isVisited) {
      const newVisited = visitedCountries.filter(country => country !== hoverItem);
      return set(mapRef, newVisited);
    }
    set(mapRef, [...visitedCountries, hoverItem]);
  }, [user, isOwner, hoverItem, mapRef, visitedCountries]);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleMouseDown);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleMouseDown);
    }
  }, [handleMouseMove, handleMouseDown]);

  useEffect(() => {
    return onValue(mapRef, snapshoot => {
      setVisitedCountries(snapshoot.val() || []);
    })
  }, [mapRef]);

  const countriesOrder = useMemo(() => 
    pathConfig.sort(({ name }) => name === hoverItem ? 1 : -1),
    [hoverItem],
  )

  if (!mapId && user) {
    return <Navigate to={`/${user.uid}`} replace />;
  }

  return (
    <div className={styles.worldMapContainer}>
      <ImageViewer maxScale={5} minScale={1}>
        <svg viewBox={svgParams.viewBox}>
          {countriesOrder.map(({ d, name }) => (
            <path
              className={cn({
                [styles.hover]: hoverItem === name,
                [styles.visited]: visitedCountries.includes(name),
              })}
              d={d}
              key={d}
              data-name={name}
            />
          ))}
        </svg>
      </ImageViewer>
    </div>
  );
}
