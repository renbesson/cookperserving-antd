import { useEffect } from 'react'
import 'antd/dist/antd.css'
import '../styles/vars.css'
import '../styles/global.css'
import { Grid, Layout } from 'antd'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, firestore } from '../lib/firebase'
import SignInDrawer from '../components/SignInDrawer'
import SignUpDrawer from '../components/SignUpDrawer'
import ProfileDrawer from '../components/ProfileDrawer'
import HeaderClient from '../components/HeaderClient'
import { doc, onSnapshot } from 'firebase/firestore'
import { useAtom } from 'jotai'
import { userAtom } from '../lib/atoms'
import Head from 'next/head'

const { Content, Footer } = Layout

export default function MyApp({ Component, pageProps }) {
  const [userAuth, loadingUserAuth, errorUserAuth] = useAuthState(auth)
  const [user, setUser] = useAtom(userAtom)

  const screens = Grid.useBreakpoint()

  // Get user doc and inject into userAtom
  useEffect(() => {
    const unsub = onSnapshot(doc(firestore, 'users', userAuth?.uid || 'none'), (doc) => {
      setUser(doc.data())
    })

    return () => {
      unsub()
    }
  }, [userAuth])

  return (
    <>
      <Head>
        <title>Cook Per Serving</title>
        <link rel="icon" href="logo.png" />
      </Head>
      <Layout className="layout">
        <SignInDrawer />
        <SignUpDrawer />
        <ProfileDrawer />
        <HeaderClient />
        <Content style={{ alignSelf: 'center', padding: screens.lg ? '30px' : '10px' }}>
          <Component {...pageProps} />
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
      </Layout>
    </>
  )
}

