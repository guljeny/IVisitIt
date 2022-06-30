import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { updatePassword } from "firebase/auth";
import useAuth from 'hooks/useAuth'
import Input from 'components/Input';
import { login } from 'constants/routes'

export default () => {
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const user = useAuth()

  if (!user) return <Navigate to={login} replace />

  const { email } = user

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      await updatePassword(user, password)
      setPassword('')
      setPasswordError('')
    } catch (e: any) {
      setPasswordError(e.message)
    }
  }

  return (
    <div>
      <span>{email}</span>
      <form onSubmit={handlePasswordUpdate}>
        <Input
          placeholder='new password'
          type='password'
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        <button>Save</button>
        {passwordError && <div>{passwordError}</div>}
      </form>
    </div>
  )
}
