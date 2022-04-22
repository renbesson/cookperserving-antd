import { createContext } from 'react'
import { auth } from '../lib/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'

export const UserContext = createContext({
  user: null,
  loadingUser: true,
  errorUser: null
})

// Custom hook to read  auth record and user profile doc
export function UserState(props) {
  const [user, loadingUser, errorUser] = useAuthState(auth)

  return (
    <UserContext.Provider value={{ user, loadingUser, errorUser }}>
      {props.children}
    </UserContext.Provider>
  )
}
