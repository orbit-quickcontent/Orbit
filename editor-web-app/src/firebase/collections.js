import { collection, } from "firebase/firestore";
import { db } from "./app";









const getCollectionRef = (name) => {
  return collection(db, name) ;
};

export const editorCollections = {
  organizations: () => getCollectionRef("organizations"),
  users: () => getCollectionRef("users"),
  projects: () => getCollectionRef("projects"),
  tasks: () => getCollectionRef("tasks"),
  documents: () => getCollectionRef("documents"),
  files: () => getCollectionRef("files")
};
