import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Card, Typography, notification, Avatar, Tag } from 'antd'
import { DeleteOutlined, EditOutlined, PictureOutlined } from '@ant-design/icons'
import { useAtom, useAtomValue } from 'jotai'
import { editIngrDrawerAtom, userAtom } from '../../lib/atoms'
import { addToFirestore, addToStorage, deleteFromFirestore } from '../../lib/sharedFunctions'
import { deleteFromStorage, getURL } from '../../lib/sharedFunctions'
import EditRecipe from './EditRecipe'

const { Title, Text, Paragraph } = Typography

export default function RecipeCard({ itemData }) {
  const router = useRouter()
  const user = useAtomValue(userAtom)
  const imageInput = useRef(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [drawer, setDrawer] = useState(false)

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
  useEffect(() => {
    const path = `users/${user.uid}/recipes`
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
                    description: `${error.message}`
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
    const path = `users/${user.uid}/recipes`
    if (itemData.imgFileName) {
      await deleteFromStorage(`${path}/${itemData.imgFileName}`).then((obj) => {
        if (obj?.success) {
          notification.success({
            message: 'Image Deleted',
            description: `Recipe Image has been deleted successfully.`
          })
        } else
          notification.error({
            message: 'Error Deleting Image',
            description: `${error.message}`
          })
      })
    }

    // Delete the document from firestore
    await deleteFromFirestore(path, itemData.id).then((obj) => {
      if (obj?.success) {
        notification.success({
          message: 'Recipe Deleted',
          description: `Recipe has been deleted successfully.`
        })
      } else
        notification.error({
          message: 'Error Deleting Recipe',
          description: `${error.message}`
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
              {itemData.description}
            </div>
          }
        />
      </Card>
      {drawer && (
        <EditRecipe
          drawer={drawer}
          setDrawer={setDrawer}
          recipe={itemData}
        />
      )}
    </>
  )
}
