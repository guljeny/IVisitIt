import { useEffect, useState, useMemo } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { getDatabase, ref, onValue, set } from "firebase/database";
import Input from 'components/Input';
import LoginForm from 'components/LoginForm';
import useAuth from 'hooks/useAuth';
import firebaseApp from 'utils/firebase/firebaseApp';

import styles from './styles.css';

const db = getDatabase(firebaseApp);

interface IMember {
  name: string;
  id: number;
}

export default () => {
  const [members, setMembers] = useState<IMember[]>([]);
  const [newMemberName, setNewMemberName] = useState('');
  const user = useAuth();
  const { listId } = useParams();
  const isOwner = user && user.uid === listId;
  const roomRef = useMemo(() => ref(db, 'rooms/' + listId), [listId]);

  const addMember = (e) => {
    e.preventDefault();
    setNewMemberName('');
    set(roomRef, [{ name: newMemberName, id: Date.now() }, ...members]);
  }

  const deleteMember = (e, id) => {
    e.stopPropagation();
    set(roomRef, members.filter(member => member.id !== id));
  }

  const onMemberClick = (id) => {
    if (!isOwner) return;

    const member = members.find(member => member.id === id);
    const newMembers = members.filter(member => member.id !== id)

    set(roomRef, [...newMembers, member]);
  }

  useEffect(() => {
    return onValue(roomRef, snapshoot => {
      setMembers(snapshoot.val() || []);
    })
  }, [roomRef]);


  if (!listId) {
    if (user) return <Navigate to={`/${user.uid}`} replace />;

    return <LoginForm />;
  }

  return (
    <div className={styles.container}>
      {isOwner && (
        <form className={styles.form} onSubmit={addMember}>
          <Input
            placeholder='new member'
            value={newMemberName}
            onChange={({ target }) => setNewMemberName(target.value)}
          />
          <button>Add</button>
        </form>
      )}
      {members.map(({ id, name }) => (
        <div className={styles.member} key={id} onClick={() => onMemberClick(id)}>
          {name}
          {isOwner && (
            <button className={styles.removeButton} onClick={(e) => deleteMember(e, id)}>
              x
            </button>
          )}
        </div>
      ))}
    </div>
  )
} 
