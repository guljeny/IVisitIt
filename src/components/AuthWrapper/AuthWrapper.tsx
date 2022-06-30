import { PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'
import useAuth from 'hooks/useAuth'
import { home } from 'constants/routes'

export default ({ children }: PropsWithChildren<{}>) => {
  const user = useAuth()

  if (user) return <Navigate to={home} replace />

  return (
    <div>
      {children}
    </div>
  )
}
