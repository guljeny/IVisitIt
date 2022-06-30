import { useEffect } from 'react';

export default (ref, callback) => {
  const handleClick = (e) => {
    if (ref.current.contains(e.target)) return;

    callback();
  }

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [])

  return null
}
