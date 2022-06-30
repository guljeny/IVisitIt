import { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import auth from 'utils/firebase/auth';
import Input from 'components/Input';

export default () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('');

  const handleSumbit = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (e: any) {
      setError(e.message)
    }
  }

  return (
    <form onSubmit={handleSumbit}>
      <h2>Register</h2>
      <Input placeholder='email' value={email} onChange={({ target }) => setEmail(target.value)} />
      <Input placeholder='password' type='password' value={password} onChange={({ target }) => setPassword(target.value)} />
      <button>Register</button>
      {error && <div>{error}</div>}
    </form>
  )
}
