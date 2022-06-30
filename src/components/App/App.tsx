import { useState, useEffect } from 'react'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import MemberList from 'components/MemberList'
import Header from 'components/Header'
import LoginForm from 'components/LoginForm'
import RegisterForm from 'components/RegisterForm'
import Profile from 'components/Profile'
import AuthWrapper from 'components/AuthWrapper'
import { login, register, profile } from 'constants/routes'
import auth from 'utils/firebase/auth';

export default () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    (async () => {
      await (auth as any).operations;
      setIsLoading(false)
    })()
  }, [])

  if (isLoading) return <div>Loading...</div>

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path={login} element={<AuthWrapper><LoginForm /></AuthWrapper>} />
        <Route path={register} element={<AuthWrapper><RegisterForm /></AuthWrapper>} />
        <Route path={profile} element={<Profile />} />
        <Route path='/' element={<MemberList />}>
          <Route path=':listId' element={<MemberList />} />
        </Route>
      </Routes>
    </BrowserRouter>
    )
}
