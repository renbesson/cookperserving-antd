import { useState, useContext } from 'react'
import { Grid, Drawer, Avatar, Typography, Form, Input, Button, notification } from 'antd'
import { LockOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { useAtom, useAtomValue } from 'jotai'
import { signInOnAtom, signUpOnAtom, userAtom } from '../lib/atoms'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, firestore } from '../lib/firebase'
import { doc, setDoc } from 'firebase/firestore'

export default function SignUpDrawer() {
  const [user, loadingUser, errorUser] = useAuthState(auth)
  const [signInOn, setSignInOn] = useAtom(signInOnAtom)
  const [signUpOn, setSignUpOn] = useAtom(signUpOnAtom)

  const router = useRouter()
  const [newUser, setNewUser] = useState({
    displayName: '',
    email: '',
    password: ''
  })

  const screens = Grid.useBreakpoint()

  const createUser = async () => {
    await createUserWithEmailAndPassword(auth, newUser.email, newUser.password)
      .then((res) => {
        updateProfile(auth.currentUser, {
          displayName: `${newUser.displayName}`,
          photoURL: 'https://i.pravatar.cc/300'
        })
        const userObj = {
          uid: res.user.uid,
          displayName: newUser.displayName,
          email: res.user.email,
          phoneNumber: '',
          shoppingLists: [],
          cart: [],
          orders: [],
          addresses: []
        }
        setDoc(doc(firestore, 'users', res.user.uid), userObj)
        setSignUpOn(false)
        notification.success({
          message: 'Signed Up Successfully',
          description: `User "${newUser.displayName}" has been created successfully wth the email "${newUser.email}".`
        })
        // Refreshes the page to reload the userContext.js to get the new user's info.
      })
      .catch((error) => {
        console.error(error)
        notification.error({
          message: 'Error Signing Up',
          description: `${error.message}`
        })
      })
  }
  const toggleDrawers = () => {
    setSignInOn(!signInOn)
    setSignUpOn(!signUpOn)
  }

  // Finishes firebase onAuthStateChanged and didn't find any user
  if (user === null) {
    return (
      <Drawer
        placement="right"
        closable={false}
        onClose={() => setSignUpOn(false)}
        visible={signUpOn}
        width={screens.xs ? '80vw' : '30vw'}
        style={{ backgroundColor: 'rgba(255, 255, 255, .15)', backdropFilter: 'blur(5px)' }}
      >
        <Avatar>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>

        <Form layout="vertical" onFinish={createUser}>
          <Form.Item
            label="Display Name"
            name="displayName"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input
              name="displayName"
              id="displayName"
              placeholder="Display Name"
              value={newUser.displayName}
              onChange={(e) => setNewUser({ ...newUser, displayName: e.target.value })}
            />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input
              name="email"
              id="email"
              placeholder="Email Address"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input
              name="password"
              id="password"
              placeholder="Password"
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Sign Up
          </Button>
          <Button type="link" onClick={toggleDrawers}>
            Already have an account?
          </Button>
        </Form>
      </Drawer>
    )
    // Finishes firebase onAuthStateChanged and a user is found
  } else {
    return <></>
  }
}
