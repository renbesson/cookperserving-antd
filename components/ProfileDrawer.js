import { useState, useCallback } from 'react'
import { Grid, Drawer, Avatar, Typography, Form, Input, Button, notification } from 'antd'
import { useAtom, useAtomValue } from 'jotai'
import { profileOnAtom, signInOnAtom, signUpOnAtom, userAtom } from '../lib/atoms'
import { auth, firestore } from '../lib/firebase'
import { createFirestore } from '../lib/sharedFunctions'
import { updateProfile } from 'firebase/auth'

export default function SignUpDrawer() {
  const [user, loadingUser, errorUser] = useAtom(userAtom)
  const [profileOn, setProfileOn] = useAtom(profileOnAtom)

  const [editedUser, setEditedUser] = useState({
    displayName: user?.displayName,
    email: user?.email,
    phoneNumber: user?.phoneNumber
  })

  const screens = Grid.useBreakpoint()

  const changeProfile = async (changes) => {
    try {
      await updateProfile(auth.currentUser, {
        displayName: changes.displayName,
        email: changes.email,
        phoneNumber: changes.phoneNumber
      })
      await createFirestore('users', user.uid, { ...changes }).then((obj) => {
        if (obj?.success) {
          notification.success({
            message: 'Profile updated successfully'
          })
        } else
          notification.error({
            message: 'Error Updating Profile',
            description: `${obj.error.message}`
          })
      })
    } catch (error) {
      notification.error({
        message: 'Error Updating Profile',
        description: `${error.message}`
      })
    }
  }

  // Finishes firebase onAuthStateChanged and didn't find any user
  if (user !== null) {
    return (
      <Drawer
        placement="right"
        closable={false}
        onClose={() => setProfileOn(false)}
        visible={profileOn}
        width={screens.xs ? '80vw' : '30vw'}
        style={{ backgroundColor: 'rgba(255, 255, 255, .15)', backdropFilter: 'blur(5px)' }}
      >
        <Typography component="h2" variant="h5">
          Profile
        </Typography>
        <Form
          layout="vertical"
          name="EditProfileForm"
          initialValues={{
            ['displayName']: user?.displayName,
            ['email']: user?.email,
            ['phoneNumber']: user?.phoneNumber
          }}
          onFinish={changeProfile}
        >
          <Form.Item
            label="Display Name"
            name="displayName"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input
              name="displayName"
              id="displayName"
              placeholder="Display Name"
              value={editedUser?.displayName}
              onChange={(e) => setEditedUser({ ...editedUser, displayName: e.target.value })}
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
              value={editedUser?.email}
              onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
            />
          </Form.Item>
          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[{ required: true, message: 'Please input your phone number!' }]}
          >
            <Input
              name="phoneNumber"
              id="phoneNumber"
              placeholder="phoneNumber"
              value={editedUser?.phoneNumber}
              onChange={(e) => setEditedUser({ ...editedUser, phoneNumber: e.target.value })}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form>
      </Drawer>
    )
    // Finishes firebase onAuthStateChanged and a user is found
  } else {
    return <></>
  }
}
