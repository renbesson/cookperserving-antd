import { collection, orderBy, query, Timestamp } from 'firebase/firestore'
import { useAtomValue } from 'jotai'
import { userAtom } from '../lib/atoms'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { firestore } from '../lib/firebase'
import RecipeCard from '../components/myRecipes/RecipeCard'
import { Card, Col, notification, Row } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import { addToFirestore } from '../lib/sharedFunctions'
import { customAlphabet } from 'nanoid'
import { useState } from 'react'

const nanoid = customAlphabet('0123456789', 6)

export default function myRecipes() {
  const user = useAtomValue(userAtom)
  const [newUid, setNewUid] = useState(nanoid())
  const [recipes, recipesLoading, recipesError] = useCollectionData(
    query(collection(firestore, `users/${user?.uid}/recipes/`), orderBy('createdAt', 'asc'))
  )

  const addRecipe = async () => {
    const path = `users/${user.uid}/recipes`
    const newRecipe = {
      id: newUid,
      name: 'Untitled',
      servings: '',
      ingredients: [],
      directions: '',
      createdOn: Timestamp.now(),
      modifiedOn: Timestamp.now()
    }
    await addToFirestore(path, newUid, newRecipe).then((obj) => {
      if (obj?.success) {
        notification.success({
          message: 'New Recipe Created',
          description: `Recipe has been created successfully.`
        })
      } else
        notification.error({
          message: 'Error Creating Recipe',
          description: `${obj.error.message}`
        })
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
          onClick={addRecipe}
        ></Card>
      </Col>
      {recipes?.map((recipe) => (
        <Col key={recipe.id}>
          <RecipeCard itemData={recipe} />
        </Col>
      ))}
    </Row>
  )
}
