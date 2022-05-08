import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore'
import { collection, doc, query, where } from 'firebase/firestore'
import { firestore } from '../lib/firebase'
import { useAtomValue } from 'jotai'
import { userAtom } from '../lib/atoms'
import { Col, Divider, Form, Grid, Image, InputNumber, Row, Typography } from 'antd'

export default function viewRecipe() {
  const router = useRouter()
  const screens = Grid.useBreakpoint()
  const user = useAtomValue(userAtom)
  const { rcp } = router.query
  const [recipe, recipeLoading, recipeError] = useDocumentData(
    doc(firestore, `users/${user?.uid}/recipes/${rcp}`)
  )
  const ingrsRef = collection(firestore, `users/${user?.uid}/ingredients`)

  const idsArray = recipe?.ingredients?.map((el) => el.id)

  const [ingrs, ingrsLoading, ingrsError] = useCollectionData(
    idsArray && query(ingrsRef, where('id', 'in', idsArray))
  )
  const [servings, setServings] = useState(recipe?.servings)

  const tableClass = {
    borderCollapse: 'collapse',
    width: screens.xs ? '90vw' : '500px'
  }

  const tdth = {
    textAlign: 'left',
    padding: '8px'
  }

  useEffect(() => {
    setServings(recipe?.servings)
  }, [recipe?.servings])

  const Ingrs = () => {
    const getName = (id) => {
      const ingr = ingrs?.find((ingr) => ingr.id === id)
      return ingr?.name
    }

    const getPrice = (id, amountType, amount) => {
      const ingr = ingrs?.find((ingr) => ingr.id === id)

      const pricePerAmountType = ingr?.price / ingr?.amount
      return (pricePerAmountType * amount).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      })
    }

    return (
      <table style={tableClass}>
        <tbody>
          <tr style={tdth}>
            <th>Amount</th>
            <th>Name</th>
            <th>Cost</th>
          </tr>
          {recipe?.ingredients?.map((el, index) => {
            const amount = parseInt((+el.amount / +recipe?.servings) * +servings)

            return (
              <tr key={index}>
                <td style={{ textAlign: 'right', paddingRight: '50px', width: '100px' }}>
                  {amount}
                  {el.amountType}
                </td>
                <td>{getName(el.id)}</td>
                <td>{getPrice(el.id, el.amountType, amount)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }

  return (
    <>
      <Typography.Title>{recipe?.name}</Typography.Title>
      <Divider />
      <Image preview={false} src={recipe?.imgURL} />
      <Divider />
      <Typography.Title>Ingredients</Typography.Title>
      <Row>
        <Col>
          <Ingrs />
        </Col>
        <Col>
          <InputNumber
            style={{ width: '150px', margin: '20px' }}
            addonBefore="Servings:"
            placeholder="Servings"
            value={servings}
            onChange={setServings}
          />
        </Col>
      </Row>
      <Divider />
      <Typography.Title>Directions</Typography.Title>
      <Typography style={{ whiteSpace: 'pre-wrap' }}>{recipe?.directions}</Typography>
      <Divider />
    </>
  )
}
