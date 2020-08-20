import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

import firebaseConfig from "./firebase-config.json";
// firebase init - add your own config here
firebase.initializeApp(firebaseConfig)

// utils
export const db = firebase.firestore()
export const auth = firebase.auth()
export function getCurrentUser() {
  return new Promise((resolve, reject) => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      unsubscribe();
      resolve(user);
    }, reject);
  })
}
// collection references
export const studentsCollection = db.collection('students')
