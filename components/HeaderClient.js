import { Col, Layout, Menu, notification, Row } from 'antd'
import React from 'react'
import { useRouter } from 'next/router'
import { profileOnAtom, signInOnAtom, userAtom } from '../lib/atoms'
import { SettingOutlined } from '@ant-design/icons'
import { auth } from '../lib/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useAtom, useAtomValue } from 'jotai'

const { Header } = Layout
const { SubMenu } = Menu

export default function HeaderClient() {
  const user = useAtomValue(userAtom)
  const [signInOn, setSignInOn] = useAtom(signInOnAtom)
  const [profileOn, setProfileOn] = useAtom(profileOnAtom)

  const router = useRouter()

  const onSignOut = () => {
    auth
      .signOut(auth)
      .then(() => {
        notification.success({
          message: 'Signed Out Successfully'
        })
      })
      .catch((error) => {
        notification.error({
          message: 'Error Logging In',
          description: `${error.message}`
        })
      })
  }

  const LoggedMenu = () => {
    return (
      <Menu mode="horizontal" theme="dark">
        <Menu.Item key="setting:1" onClick={() => router.push('/')}>
          Home
        </Menu.Item>
        <Menu.Item key="setting:2" onClick={() => router.push('/myIngredients')}>
          Ingredients
        </Menu.Item>
        <Menu.Item key="setting:3" onClick={() => router.push('/myRecipes')}>
          Recipes
        </Menu.Item>
        <SubMenu key="SubMenu" icon={<SettingOutlined />} title={user.displayName}>
          <Menu.Item key="setting:4.1" onClick={() => setProfileOn(true)}>
            Profile
          </Menu.Item>
          <Menu.Item key="setting:4.2">Option 2</Menu.Item>
          <Menu.Item key="setting:4.3" onClick={onSignOut}>
            Sign Out
          </Menu.Item>
        </SubMenu>
      </Menu>
    )
  }

  const NotLoggedMenu = () => {
    return (
      <Menu mode="horizontal" theme="dark">
        <Menu.Item key="setting:1" onClick={() => router.push('/')}>
          Home
        </Menu.Item>
        <Menu.Item key="setting:2" onClick={() => setSignInOn(true)}>
          Sign/Log In
        </Menu.Item>
      </Menu>
    )
  }

  return (
    <Header>
      <Row justify="space-between">
        <Col>
          <div className="logo" style={{ color: '#fff' }}>
            LOGO
          </div>
        </Col>
        <Col>{user ? <LoggedMenu /> : <NotLoggedMenu />}</Col>
      </Row>
    </Header>
  )
}
