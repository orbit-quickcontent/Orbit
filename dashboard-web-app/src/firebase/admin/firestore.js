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
  /**
   * Fetch a single document by ID in a collection
   */
  get: async ( collectionName, id) => {
    const docRef = doc(db, collectionName, id);
    const snap = await getDoc(docRef);
    return snap.exists() ? (snap.data() ) : null;
  },

  /**
   * Set (or overwrite) a document by ID in a collection
   */
  set: async ( collectionName, id, data) => {
    const docRef = doc(db, collectionName, id);
    return setDoc(docRef, data, { merge: true });
  },

  /**
   * Update fields of an existing document
   */
  update: async (collectionName, id, data) => {
    const docRef = doc(db, collectionName, id);
    return updateDoc(docRef, data);
  },

  /**
   * Delete a document by ID
   */
  delete: async (collectionName, id) => {
    const docRef = doc(db, collectionName, id);
    return deleteDoc(docRef);
  },

  /**
   * Query a collection with specific constraints (where, orderBy, limit, etc.)
   */
  query: async ( collectionName, ...constraints) => {
    const colRef = collection(db, collectionName);
    const q = query(colRef, ...constraints);
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } ));
  },

  /**
   * Run a transactional database operation
   */
  transaction: async ( updateFn) => {
    return runTransaction(db, updateFn);
  },

  /**
   * Create a new write batch
   */
  batch: () => {
    return writeBatch(db);
  }
};
