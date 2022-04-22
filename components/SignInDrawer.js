import { useState } from 'react'
import { Grid, Drawer, Avatar, Typography, Form, Input, Button, notification } from 'antd'
import { LockOutlined } from '@ant-design/icons'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { signInOnAtom, signUpOnAtom, userAtom } from '../lib/atoms'
import { auth } from '../lib/firebase'
import { useAtom, useAtomValue } from 'jotai'
import { useAuthState } from 'react-firebase-hooks/auth'

export default function SignInDrawer() {
  const [user, loadingUser, errorUser] = useAuthState(auth)
  const [signInOn, setSignInOn] = useAtom(signInOnAtom)
  const [signUpOn, setSignUpOn] = useAtom(signUpOnAtom)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const screens = Grid.useBreakpoint()

  const signInUser = async () => {
    await signInWithEmailAndPassword(auth, email, password)
      .then((res) => {
        setSignInOn(false)
        notification.success({
          message: 'Signed In Successfully',
          description: `User "${res.user.displayName}" signed in successfully wth the email "${res.user.email}".`
        })
      })
      .catch((error) => {
        notification.error({
          message: 'Error Logging In',
          description: `${error}`
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
        onClose={() => setSignInOn(false)}
        visible={signInOn}
        width={screens.xs ? '80vw' : '30vw'}
        style={{ backgroundColor: 'rgba(255, 255, 255, .15)', backdropFilter: 'blur(5px)' }}
      >
        <Avatar>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>

        <Form layout="vertical" onFinish={signInUser}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input
              name="email"
              id="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input
              name="password"
              id="password"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Sign In
          </Button>
          <Button type="link" onClick={toggleDrawers}>
            Don't have an account?
          </Button>
        </Form>
      </Drawer>
    )
    // Finishes firebase onAuthStateChanged and a user is found
  } else {
    return <></>
  }
}
