import { useEffect, useState, useContext } from 'react'
import { Form, Input, Button, notification, Drawer } from 'antd'
import { Grid, Typography, Select, Space, InputNumber } from 'antd'
import { useAtom, useAtomValue } from 'jotai'
import { editIngrDrawerAtom, userAtom } from '../../lib/atoms'
import { addToFirestore } from '../../lib/sharedFunctions'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { firestore } from '../../lib/firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { collection } from 'firebase/firestore'

export default function EditRecipe({ recipe, drawer, setDrawer }) {
  const user = useAtomValue(userAtom)
  const [recipeLocal, setRecipeLocal] = useState(recipe)
  const [ingrs, ingrsLoading, ingrsError] = useCollectionData(
    collection(firestore, `users/${user?.uid}/ingredients/`)
  )

  const screens = Grid.useBreakpoint()

  const editRecipe = async (updatedRecipe) => {
    const path = `users/${user.uid}/recipes`

    // Edits a document in firestore
    await addToFirestore(path, recipe.id, updatedRecipe).then((obj) => {
      if (obj?.success) {
        setDrawer(false)
        notification.success({
          message: 'Recipe updated successfully'
        })
      } else
        notification.error({
          message: 'Error Updating Recipe',
          description: `${error}`
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
      width={screens.xs ? '95vw' : '50vw'}
      style={{ backgroundColor: 'rgba(255, 255, 255, .15)', backdropFilter: 'blur(5px)' }}
    >
      <Typography component="h2" variant="h5">
        Edit Recipe
      </Typography>
      <Form
        layout="vertical"
        name="EditIngredientForm"
        initialValues={{
          ['name']: recipe?.name,
          ['servings']: recipe?.servings,
          ['ingredients']: recipe?.ingredients,
          ['directions']: recipe?.directions
        }}
        onFinish={editRecipe}
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
            value={recipe?.name}
            onChange={(e) => setRecipeLocal({ ...recipeLocal, name: e.target.value })}
          />
        </Form.Item>
        <Form.Item
          label="Servings"
          name="servings"
          rules={[{ required: true, message: 'Please input recipe servings!' }]}
        >
          <InputNumber
            name="Servings"
            id="servings"
            placeholder="Servings"
            value={recipe?.amount}
            onChange={(value) => setRecipeLocal({ ...recipeLocal, servings: value })}
          />
        </Form.Item>
        <Form.Item
          label="Ingredients"
          name="ingredients"
          rules={[{ required: true, message: 'Please input recipe servings!' }]}
        >
          <Form.List name="ingredients" id="ingredients">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'amount']}
                      rules={[{ required: true, message: 'Missing amount' }]}
                    >
                      <InputNumber placeholder="Amount" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'amountType']}
                      rules={[{ required: true, message: 'Missing amount type' }]}
                    >
                      <Select style={{ width: 60 }} placeholder="Type">
                        <Select.Option key="gr" value="gr">
                          gr
                        </Select.Option>
                        <Select.Option key="ml" value="ml">
                          ml
                        </Select.Option>
                      </Select>
                    </Form.Item>
                    <p>of</p>
                    <Form.Item
                      {...restField}
                      name={[name, 'id']}
                      rules={[{ required: true, message: 'Missing ingredient' }]}
                    >
                      <Select
                        style={{ width: 200 }}
                        showSearch
                        placeholder="Ingredient"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {ingrs?.map((ingr, key) => (
                          <Select.Option key={`${ingr.id}${key}`} value={ingr.id}>
                            {ingr.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add Ingredient
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item>
        <Form.Item
          label="Directions"
          name="directions"
          rules={[{ required: true, message: 'Please input some directions!' }]}
        >
          <Input.TextArea
            rows={10}
            name="Directions"
            id="directions"
            placeholder="Directions"
            value={recipe?.price}
            onChange={(e) => setRecipeLocal({ ...recipeLocal, directions: e.target.value })}
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
