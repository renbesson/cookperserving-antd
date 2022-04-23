import { collection } from 'firebase/firestore'
import { useAtomValue } from 'jotai'

import { userAtom } from '../lib/atoms'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { firestore } from '../lib/firebase'
import IngredientCard from '../components/myIngredients/IngredientCard'
import { Card, Col, notification, Row } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import { addToFirestore } from '../lib/sharedFunctions'
import { customAlphabet } from 'nanoid'
import { useState } from 'react'

const nanoid = customAlphabet('0123456789', 6)

export default function myIngredients() {
  const user = useAtomValue(userAtom)
  const [newUid, setNewUid] = useState(nanoid())
  const [ingrs, ingLoading, ingError] = useCollectionData(
    collection(firestore, `users/${user?.uid}/ingredients/`)
  )

  const addIngr = async (event) => {
    event.preventDefault()
    const path = `users/${user.uid}/ingredients`
    await addToFirestore(path, newUid, {
      id: newUid,
      name: 'Untitled',
      amount: '',
      amountType: '',
      price: '',
      availableQty: ''
    }).then((obj) => {
      if (obj?.success) {
        setNewUid(nanoid())
        notification.success({
          message: 'New Product Created',
          description: `Product has been created successfully.`
        })
      } else {
        notification.error({
          message: 'Error Creating Product',
          description: `${error.message}`
        })
      }
    })
  }

  return (
    <Row align="middle" justify="center" gutter={[20, 20]}>
      <Col>
        <Card
          style={{ width: 300, height: 300 }}
          cover={
            <PlusCircleOutlined
              style={{
                maxWidth: 300,
                maxHeight: 150,
                fontSize: '15rem',
                margin: 'auto',
                paddingTop: '40px',
                paddingBottom: '10px'
              }}
            />
          }
          hoverable
          onClick={addIngr}
        ></Card>
      </Col>
      {ingrs?.map((ingr) => (
        <Col key={[ingr.id].toString()}>
          <IngredientCard itemData={ingr} />
        </Col>
      ))}
    </Row>
  )
}
