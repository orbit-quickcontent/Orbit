import { collection, } from "firebase/firestore";
import { db } from "./app";
























// Collection helper to create typed references
const getCollectionRef = (name) => {
  return collection(db, name) ;
};

export const adminCollections = {
  organizations: () => getCollectionRef("organizations"),
  users: () => getCollectionRef("users"),
  roles: () => getCollectionRef("roles"),
  permissions: () => getCollectionRef("permissions"),
  projects: () => getCollectionRef("projects"),
  tasks: () => getCollectionRef("tasks"),
  subscriptions: () => getCollectionRef("subscriptions"),
  invoices: () => getCollectionRef("invoices"),
  payments: () => getCollectionRef("payments"),
  documents: () => getCollectionRef("documents"),
  files: () => getCollectionRef("files"),
  chatRooms: () => getCollectionRef("chatRooms"),
  messages: () => getCollectionRef("messages"),
  notifications: () => getCollectionRef("notifications"),
  activityLogs: () => getCollectionRef("activityLogs"),
  auditLogs: () => getCollectionRef("auditLogs"),
  analytics: () => getCollectionRef("analytics"),
  usage: () => getCollectionRef("usage"),
  supportTickets: () => getCollectionRef("supportTickets"),
  settings: () => getCollectionRef("settings"),
  apiKeys: () => getCollectionRef("apiKeys")
};
