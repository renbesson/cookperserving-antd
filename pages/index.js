// Custom DatePicker that uses Day.js instead of Moment.js

import { useAtomValue } from 'jotai'
import { userAtom } from '../lib/atoms'

export default function Home() {
  const user = useAtomValue(userAtom)
  return <div>{JSON.stringify(user)}</div>
}

