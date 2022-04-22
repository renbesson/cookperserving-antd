import { deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore'
import { deleteObject, getDownloadURL, ref } from 'firebase/storage'
import { uploadBytes } from 'firebase/storage'
import { firestore, storage } from './firebase'

//////////////////////////////////////////////////////////////////

export async function createFirestore(path, id, docObj) {
  const docRef = doc(firestore, path, id)
  return await setDoc(docRef, docObj, { merge: true })
    .then(() => {
      return {
        success: true
      }
    })
    .catch((error) => {
      return {
        success: false,
        error
      }
    })
}

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

export async function addToFirestore(path, id, docObj) {
  const docRef = doc(firestore, path, id)
  return await setDoc(docRef, docObj, { merge: true })
    .then(() => {
      return {
        success: true
      }
    })
    .catch((error) => {
      return {
        success: false,
        error
      }
    })
}

//////////////////////////////////////////////////////////////////

export async function deleteFromFirestore(path, uid) {
  const firestoreRef = doc(firestore, path, uid)
  return await deleteDoc(firestoreRef)
    .then(() => {
      return {
        success: true
      }
    })
    .catch((error) => {
      return {
        success: false,
        error
      }
    })
}

//////////////////////////////////////////////////////////////////

export async function addToStorage(path, file) {
  const imgRef = ref(storage, path)
  await uploadBytes(imgRef, file)
  return await getDownloadURL(imgRef)
    .then((url) => {
      return {
        success: true,
        url
      }
    })
    .catch((error) => {
      return {
        success: false,
        error
      }
    })
}

//////////////////////////////////////////////////////////////////

export async function deleteFromStorage(path) {
  const storageRef = ref(storage, path)
  return await deleteObject(storageRef)
    .then(() => {
      return {
        success: true
      }
    })
    .catch((error) => {
      return {
        success: false,
        error
      }
    })
}

//////////////////////////////////////////////////////////////////

export async function getURL(path) {
  const imgRef = ref(storage, path)
  return await getDownloadURL(imgRef)
    .then((url) => {
      return {
        success: true,
        url
      }
    })
    .catch((error) => {
      return {
        success: false,
        error
      }
    })
}

//////////////////////////////////////////////////////////////////
