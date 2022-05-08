import { useEffect, useState, useContext } from 'react'
import { Form, Input, Button, notification, Drawer, Grid, Typography, Select } from 'antd'
import { useAtom, useAtomValue } from 'jotai'
import { editIngrDrawerAtom, userAtom } from '../../lib/atoms'
import { addToFirestore } from '../../lib/sharedFunctions'

export default function EditIngredient({ ingr, drawer, setDrawer }) {
  const user = useAtomValue(userAtom)
  const [ingrLocal, setIngrLocal] = useState(ingr)

  const screens = Grid.useBreakpoint()

  const editIngr = async () => {
    const path = `users/${user.uid}/ingredients`

    // Edits a document in firestore
    await addToFirestore(path, ingr.id, ingrLocal).then((obj) => {
      if (obj?.success) {
        setDrawer(false)
        notification.success({
          message: 'Ingredient updated successfully'
        })
      } else
        notification.error({
          message: 'Error Updating Ingredient',
          description: `${obj.error.message}`
        })
    })
  }

  return (
    <Drawer
      placement="right"
      closable={false}
      destroyOnClose
      onClose={() => setDrawer(false)}
      visible={drawer}
      width={screens.xs ? '80vw' : '30vw'}
      style={{ backgroundColor: 'rgba(255, 255, 255, .15)', backdropFilter: 'blur(5px)' }}
    >
      <Typography component="h2" variant="h5">
        Edit Ingredient
      </Typography>
      <Form
        layout="vertical"
        name="EditIngredientForm"
        initialValues={{
          ['name']: ingr?.name,
          ['amount']: ingr?.amount,
          ['amountType']: ingr?.amountType,
          ['price']: ingr?.price,
          ['availableQty']: ingr?.availableQty
        }}
        onFinish={editIngr}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input
            name="Name"
            id="name"
            placeholder="Name"
            value={ingr?.name}
            onChange={(e) => setIngrLocal({ ...ingrLocal, name: e.target.value })}
          />
        </Form.Item>
        <Form.Item
          label="Amount"
          name="amount"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input
            name="Amount"
            id="amount"
            placeholder="Amount"
            value={ingr?.amount}
            onChange={(e) => setIngrLocal({ ...ingrLocal, amount: e.target.value })}
          />
        </Form.Item>
        <Form.Item
          label="Amount Type"
          name="amountType"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Select
            name="Amount Type"
            id="amountType"
            placeholder="Amount Type"
            value={ingr?.amountType}
            onChange={(value) => setIngrLocal({ ...ingrLocal, amountType: value })}
          >
            <Select.Option value="gr">gr</Select.Option>
            <Select.Option value="ml">ml</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input
            name="Price"
            id="price"
            placeholder="Price"
            value={ingr?.price}
            onChange={(e) => setIngrLocal({ ...ingrLocal, price: e.target.value })}
          />
        </Form.Item>
        <Form.Item
          label="Available"
          name="availableQty"
          rules={[{ required: false, message: 'Please input your username!' }]}
        >
          <Input
            name="Quantity Available"
            id="availableQty"
            placeholder="Quantity Available"
            value={ingr?.availableQty}
            onChange={(e) => setIngrLocal({ ...ingrLocal, availableQty: e.target.value })}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}
