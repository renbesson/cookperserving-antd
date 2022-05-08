import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Card, Typography, notification, Avatar, Tag } from 'antd'
import { DeleteOutlined, EditOutlined, PictureOutlined } from '@ant-design/icons'
import { useAtom, useAtomValue } from 'jotai'
import { editIngrDrawerAtom, userAtom } from '../../lib/atoms'
import {
  addToFirestore,
  addToStorage,
  deleteFromFirestore,
  deleteFromStorage,
  getURL
} from '../../lib/sharedFunctions'
import EditIngredient from './EditIngredient'

const { Title, Text, Paragraph } = Typography

export default function IngredientCard({ itemData }) {
  const router = useRouter()
  const user = useAtomValue(userAtom)
  const imageInput = useRef(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [drawer, setDrawer] = useState(false)

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
  useEffect(() => {
    const path = `users/${user.uid}/ingredients`
    const imgFileName = `${itemData.id}.${selectedImage?.name.split('.').pop()}`
    const imgPath = `${path}/${imgFileName}`

    // Add the image in the selectedImage to firestorage if theres one
    if (selectedImage) {
      addToStorage(imgPath, selectedImage).then((obj) => {
        if (obj?.success) {
          getURL(imgPath).then((obj) => {
            if (obj?.success) {
              addToFirestore(path, itemData.id, {
                imgURL: obj.url,
                imgFileName
              }).then((obj) => {
                if (obj?.success)
                  notification.success({
                    message: 'Image Added',
                    description: `Image has been added successfully.`
                  })
                else
                  notification.error({
                    message: 'Error Adding Image',
                    description: `${obj.error.message}`
                  })
              })
            }
          })
        }
      })
      setSelectedImage(null)
    }

    return () => {}
  }, [selectedImage])
  // ------------------------------------------------------------------------------------------ //

  const handleDelete = async () => {
    // Delete the image from firestorage
    const path = `users/${user.uid}/ingredients`
    if (itemData.imgFileName) {
      await deleteFromStorage(`${path}/${itemData.imgFileName}`).then((obj) => {
        if (obj?.success) {
          notification.success({
            message: 'Image Deleted',
            description: `Product Image has been deleted successfully.`
          })
        } else
          notification.error({
            message: 'Error Deleting Image',
            description: `${obj.error.message}`
          })
      })
    }

    // Delete the document from firestore
    await deleteFromFirestore(path, itemData.id).then((obj) => {
      if (obj?.success) {
        notification.success({
          message: 'Ingredient Deleted',
          description: `Ingredient has been deleted successfully.`
        })
      } else
        notification.error({
          message: 'Error Deleting Ingredient',
          description: `${obj.error.message}`
        })
    })
  }

  return (
    <>
      <Card
        style={{ width: 300, height: 300 }}
        cover={
          <img
            style={{ maxWidth: 300, maxHeight: 130 }}
            alt="example"
            src={itemData?.imgURL || 'no_img.png'}
          />
        }
        hoverable
        actions={[
          <>
            <input
              accept="image/*"
              type="file"
              id="selectImage"
              style={{ display: 'none' }}
              onChange={(e) => setSelectedImage(e.target.files[0])}
              ref={imageInput}
            />
            <PictureOutlined key="change-picture" onClick={() => imageInput.current.click()} />
          </>,
          <EditOutlined key="edit" onClick={() => setDrawer(true)} />,
          <DeleteOutlined style={{ color: 'red' }} key="delete" onClick={handleDelete} />
        ]}
      >
        <Card.Meta
          title={itemData.name}
          description={
            <div
              style={{
                height: 50
              }}
            >
              <Tag style={{ margin: 2 }} visible={itemData.amount && itemData.amountType}>
                Amount: {itemData?.amount}
                {itemData?.amountType}
              </Tag>
              <Tag style={{ margin: 2 }} visible={itemData.price}>
                Price: ${itemData?.price}
              </Tag>
              <Tag style={{ margin: 2 }} visible={itemData.availableQTY}>
                Available: {itemData?.availableQty}
              </Tag>
            </div>
          }
        />
      </Card>
      {drawer && (
        <EditIngredient
          drawer={drawer}
          setDrawer={setDrawer}
          ingr={itemData}
        />
      )}
    </>
  )
}
