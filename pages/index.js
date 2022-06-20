// Custom DatePicker that uses Day.js instead of Moment.js

import { useAtomValue } from 'jotai'
import { userAtom } from '../lib/atoms'

export default function Home() {
  const user = useAtomValue(userAtom)
  return user ? (
    <div>Your user data is: {JSON.stringify(user)}</div>
  ) : (
    <div>You are not logged in</div>
  )
}

