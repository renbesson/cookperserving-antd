import { Col, Layout, Menu, notification, Row } from 'antd'
import React from 'react'
import { useRouter } from 'next/router'
import { profileOnAtom, signInOnAtom, userAtom } from '../lib/atoms'
import { MenuOutlined } from '@ant-design/icons'
import { auth } from '../lib/firebase'
import { useAtom, useAtomValue } from 'jotai'
import Link from 'next/link'

const { Header } = Layout

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

  const LoggedMenuItems = [
    {
      label: (
        <Link href="/">
          <a>Home</a>
        </Link>
      ),
      key: 'hom'
    },
    {
      label: (
        <Link href="/myIngredients">
          <a>Ingredients</a>
        </Link>
      ),
      key: 'ingr'
    },
    {
      label: (
        <Link href="/myRecipes">
          <a>Recipes</a>
        </Link>
      ),
      key: 'rec'
    },
    { label: <a onClick={() => setProfileOn(true)}>Profile</a>, key: 'pro' },
    { label: <a onClick={onSignOut}>Sign Out</a>, key: 'out' }
  ]

  const NotLoggedMenuItems = [
    {
      label: (
        <Link href="/">
          <a>Home</a>
        </Link>
      ),
      key: 'hom'
    },
    { label: <a onClick={() => setSignInOn(true)}>Sign/Log In</a>, key: 'sin' }
  ]

  const LoggedMenu = () => {
    return (
      <Menu
        overflowedIndicator={<MenuOutlined />}
        mode="horizontal"
        theme="dark"
        items={LoggedMenuItems}
      />
    )
  }

  const NotLoggedMenu = () => {
    return <Menu mode="horizontal" theme="dark" items={NotLoggedMenuItems} />
  }

  return (
    <Header>
      <Row justify="space-between">
        <Col span={1}>
          <div className="logo" style={{ color: '#fff' }}>
            LOGO
          </div>
        </Col>
        <Col>{user ? <LoggedMenu /> : <NotLoggedMenu />}</Col>
      </Row>
    </Header>
  )
}
