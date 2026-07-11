import { useState, useEffect } from "react";
import { onAuthStateChanged, } from "firebase/auth";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { auth, db } from "./app";


/**
 * Hook to track client user session state
 */
export function useClientAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { user, loading, isAuthenticated: !!user };
}

/**
 * Realtime hook to track client projects
 */
export function useClientProjects(clientId) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientId) {
      setProjects([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "projects"),
      where("clientId", "==", clientId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } ));
        setProjects(list);
        setLoading(false);
      },
      (error) => {
        console.error("[Client Hooks] Error loading projects:", error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [clientId]);

  return { projects, loading };
}
