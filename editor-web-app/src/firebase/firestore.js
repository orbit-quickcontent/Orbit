import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,

  runTransaction,
  writeBatch,

} from "firebase/firestore";
import { db } from "./app";

export const firestoreService = {
  get: async ( collectionName, id) => {
    const docRef = doc(db, collectionName, id);
    const snap = await getDoc(docRef);
    return snap.exists() ? (snap.data() ) : null;
  },
  set: async ( collectionName, id, data) => {
    const docRef = doc(db, collectionName, id);
    return setDoc(docRef, data, { merge: true });
  },
  update: async (collectionName, id, data) => {
    const docRef = doc(db, collectionName, id);
    return updateDoc(docRef, data);
  },
  delete: async (collectionName, id) => {
    const docRef = doc(db, collectionName, id);
    return deleteDoc(docRef);
  },
  query: async ( collectionName, ...constraints) => {
    const colRef = collection(db, collectionName);
    const q = query(colRef, ...constraints);
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } ));
  },
  transaction: async ( updateFn) => {
    return runTransaction(db, updateFn);
  },
  batch: () => {
    return writeBatch(db);
  }
};
