import { db } from './firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where as fsWhere,
  orderBy as fsOrderBy,
  limit as fsLimit
} from 'firebase/firestore';

// Helper to convert Firestore timestamp/Date fields to Date objects
function parseDates(data: any) {
  if (!data) return data;
  const parsed = { ...data };
  for (const key of Object.keys(parsed)) {
    const val = parsed[key];
    if (val && typeof val === 'object' && typeof val.toDate === 'function') {
      parsed[key] = val.toDate();
    } else if (key.endsWith('At') && typeof val === 'string') {
      parsed[key] = new Date(val);
    }
  }
  return parsed;
}

// Custom query helper to parse Prisma-like where and orderBy objects to Firestore queries
function buildQuery(colRef: any, filter?: any, sorting?: any) {
  let q = query(colRef);

  if (filter) {
    Object.keys(filter).forEach((key) => {
      const val = filter[key];
      if (val === undefined) return;

      if (val && typeof val === 'object') {
        if ('in' in val) {
          if (Array.isArray(val.in) && val.in.length > 0) {
            q = query(q, fsWhere(key, 'in', val.in));
          } else {
            // Firestore 'in' query fails with empty array, so match nothing
            q = query(q, fsWhere(key, '==', '__EMPTY_ARRAY_MATCH__'));
          }
        } else if ('notIn' in val) {
          if (Array.isArray(val.notIn) && val.notIn.length > 0) {
            q = query(q, fsWhere(key, 'not-in', val.notIn));
          }
        } else if ('not' in val) {
          q = query(q, fsWhere(key, '!=', val.not));
        }
      } else {
        q = query(q, fsWhere(key, '==', val));
      }
    });
  }

  if (sorting) {
    Object.keys(sorting).forEach((key) => {
      const direction = sorting[key];
      q = query(q, fsOrderBy(key, direction));
    });
  }

  return q;
}

export const firestoreDb = {
  clientUsers: {
    findUnique: async ({ where }: { where: { email?: string; id?: string } }) => {
      if (where.id) {
        const d = await getDoc(doc(db, 'client_users', where.id));
        return d.exists() ? parseDates({ id: d.id, ...d.data() }) : null;
      }
      if (where.email) {
        const email = where.email.toLowerCase().trim();
        const q = query(collection(db, 'client_users'), fsWhere('email', '==', email));
        const snap = await getDocs(q);
        return !snap.empty ? parseDates({ id: snap.docs[0].id, ...snap.docs[0].data() }) : null;
      }
      return null;
    },
    findFirst: async ({ where }: { where: { email?: string; id?: string } }) => {
      return firestoreDb.clientUsers.findUnique({ where });
    },
    create: async ({ data }: { data: any }) => {
      const id = data.id || doc(collection(db, 'client_users')).id;
      const payload = {
        ...data,
        id,
        createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'client_users', id), payload);
      return parseDates(payload);
    },
    update: async ({ where, data }: { where: { id: string }; data: any }) => {
      const docRef = doc(db, 'client_users', where.id);
      const updatePayload = {
        ...data,
        updatedAt: new Date().toISOString()
      };
      await updateDoc(docRef, updatePayload);
      const snap = await getDoc(docRef);
      return parseDates({ id: snap.id, ...snap.data() });
    },
    findMany: async (args?: { where?: any }) => {
      const colRef = collection(db, 'client_users');
      const q = buildQuery(colRef, args?.where);
      const snap = await getDocs(q);
      return snap.docs.map((d) => parseDates({ id: d.id, ...d.data() }));
    },
    upsert: async ({ where, update, create }: { where: { email: string }; update: any; create: any }) => {
      const existing = await firestoreDb.clientUsers.findUnique({ where });
      if (existing) {
        return firestoreDb.clientUsers.update({ where: { id: existing.id }, data: update });
      }
      return firestoreDb.clientUsers.create({ data: create });
    }
  },

  partnerUsers: {
    findUnique: async ({ where }: { where: { email?: string; id?: string } }) => {
      if (where.id) {
        const d = await getDoc(doc(db, 'partner_users', where.id));
        return d.exists() ? parseDates({ id: d.id, ...d.data() }) : null;
      }
      if (where.email) {
        const email = where.email.toLowerCase().trim();
        const q = query(collection(db, 'partner_users'), fsWhere('email', '==', email));
        const snap = await getDocs(q);
        return !snap.empty ? parseDates({ id: snap.docs[0].id, ...snap.docs[0].data() }) : null;
      }
      return null;
    },
    findFirst: async ({ where }: { where: { email?: string; id?: string } }) => {
      return firestoreDb.partnerUsers.findUnique({ where });
    },
    create: async ({ data }: { data: any }) => {
      const id = data.id || doc(collection(db, 'partner_users')).id;
      const payload = {
        ...data,
        id,
        createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'partner_users', id), payload);
      return parseDates(payload);
    },
    update: async ({ where, data }: { where: { id: string }; data: any }) => {
      const docRef = doc(db, 'partner_users', where.id);
      const updatePayload = {
        ...data,
        updatedAt: new Date().toISOString()
      };
      await updateDoc(docRef, updatePayload);
      const snap = await getDoc(docRef);
      return parseDates({ id: snap.id, ...snap.data() });
    },
    findMany: async (args?: { where?: any }) => {
      const colRef = collection(db, 'partner_users');
      const q = buildQuery(colRef, args?.where);
      const snap = await getDocs(q);
      return snap.docs.map((d) => parseDates({ id: d.id, ...d.data() }));
    },
    upsert: async ({ where, update, create }: { where: { email: string }; update: any; create: any }) => {
      const existing = await firestoreDb.partnerUsers.findUnique({ where });
      if (existing) {
        return firestoreDb.partnerUsers.update({ where: { id: existing.id }, data: update });
      }
      return firestoreDb.partnerUsers.create({ data: create });
    }
  },

  // General users query helper (checks both collections)
  users: {
    findUnique: async ({ where }: { where: { email?: string; id?: string } }) => {
      const clientUser = await firestoreDb.clientUsers.findUnique({ where });
      if (clientUser) return clientUser;
      return firestoreDb.partnerUsers.findUnique({ where });
    },
    findFirst: async ({ where }: { where: { email?: string; id?: string } }) => {
      return firestoreDb.users.findUnique({ where });
    },
    findMany: async () => {
      const clients = await firestoreDb.clientUsers.findMany();
      const partners = await firestoreDb.partnerUsers.findMany();
      return [...clients, ...partners];
    }
  },

  packages: {
    findMany: async () => {
      const snap = await getDocs(collection(db, 'packages'));
      return snap.docs.map((d) => parseDates({ id: d.id, ...d.data() }));
    },
    findUnique: async ({ where }: { where: { id?: string; tier?: string } }) => {
      if (where.id) {
        const d = await getDoc(doc(db, 'packages', where.id));
        return d.exists() ? parseDates({ id: d.id, ...d.data() }) : null;
      }
      if (where.tier) {
        const q = query(collection(db, 'packages'), fsWhere('tier', '==', where.tier));
        const snap = await getDocs(q);
        return !snap.empty ? parseDates({ id: snap.docs[0].id, ...snap.docs[0].data() }) : null;
      }
      return null;
    },
    findFirst: async ({ where }: { where: { id?: string; tier?: string } }) => {
      return firestoreDb.packages.findUnique({ where });
    },
    create: async ({ data }: { data: any }) => {
      const id = data.id || doc(collection(db, 'packages')).id;
      const payload = {
        ...data,
        id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'packages', id), payload);
      return parseDates(payload);
    },
    update: async ({ where, data }: { where: { id: string }; data: any }) => {
      const docRef = doc(db, 'packages', where.id);
      await updateDoc(docRef, { ...data, updatedAt: new Date().toISOString() });
      const snap = await getDoc(docRef);
      return parseDates({ id: snap.id, ...snap.data() });
    },
    upsert: async ({ where, update, create }: { where: { tier: string }; update: any; create: any }) => {
      const existing = await firestoreDb.packages.findUnique({ where });
      if (existing) {
        return firestoreDb.packages.update({ where: { id: existing.id }, data: update });
      }
      return firestoreDb.packages.create({ data: create });
    }
  },

  bookings: {
    findMany: async (args?: { where?: any; orderBy?: any }) => {
      const colRef = collection(db, 'bookings');
      const q = buildQuery(colRef, args?.where, args?.orderBy);
      const snap = await getDocs(q);
      return snap.docs.map((d) => parseDates({ id: d.id, ...d.data() }));
    },
    findUnique: async ({ where }: { where: { id: string } }) => {
      const d = await getDoc(doc(db, 'bookings', where.id));
      return d.exists() ? parseDates({ id: d.id, ...d.data() }) : null;
    },
    findFirst: async ({ where }: { where: { id: string } }) => {
      return firestoreDb.bookings.findUnique({ where });
    },
    create: async ({ data }: { data: any }) => {
      const id = data.id || doc(collection(db, 'bookings')).id;
      const payload = {
        ...data,
        id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'bookings', id), payload);
      return parseDates(payload);
    },
    update: async ({ where, data }: { where: { id: string }; data: any }) => {
      const docRef = doc(db, 'bookings', where.id);
      await updateDoc(docRef, { ...data, updatedAt: new Date().toISOString() });
      const snap = await getDoc(docRef);
      return parseDates({ id: snap.id, ...snap.data() });
    }
  },

  partners: {
    findMany: async (args?: { where?: any }) => {
      const colRef = collection(db, 'partner_profiles');
      const q = buildQuery(colRef, args?.where);
      const snap = await getDocs(q);
      return snap.docs.map((d) => parseDates({ id: d.id, ...d.data() }));
    },
    findUnique: async ({ where }: { where: { id?: string; userId?: string } }) => {
      if (where.id) {
        const d = await getDoc(doc(db, 'partner_profiles', where.id));
        return d.exists() ? parseDates({ id: d.id, ...d.data() }) : null;
      }
      if (where.userId) {
        const q = query(collection(db, 'partner_profiles'), fsWhere('userId', '==', where.userId));
        const snap = await getDocs(q);
        return !snap.empty ? parseDates({ id: snap.docs[0].id, ...snap.docs[0].data() }) : null;
      }
      return null;
    },
    findFirst: async ({ where }: { where: { id?: string; userId?: string } }) => {
      return firestoreDb.partners.findUnique({ where });
    },
    create: async ({ data }: { data: any }) => {
      const id = data.id || doc(collection(db, 'partner_profiles')).id;
      const payload = {
        availability: true,
        isVerified: false,
        rating: 0.0,
        completedProjects: 0,
        walletBalance: 0.0,
        pendingClearance: 0.0,
        totalWithdrawn: 0.0,
        ...data,
        id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'partner_profiles', id), payload);
      return parseDates(payload);
    },
    update: async ({ where, data }: { where: { id: string }; data: any }) => {
      const docRef = doc(db, 'partner_profiles', where.id);
      await updateDoc(docRef, { ...data, updatedAt: new Date().toISOString() });
      const snap = await getDoc(docRef);
      return parseDates({ id: snap.id, ...snap.data() });
    },
    upsert: async ({ where, update, create }: { where: { userId: string }; update: any; create: any }) => {
      const existing = await firestoreDb.partners.findUnique({ where });
      if (existing) {
        return firestoreDb.partners.update({ where: { id: existing.id }, data: update });
      }
      return firestoreDb.partners.create({ data: create });
    }
  },

  workDispatches: {
    findMany: async (args?: { where?: any }) => {
      const colRef = collection(db, 'work_dispatches');
      const q = buildQuery(colRef, args?.where);
      const snap = await getDocs(q);
      return snap.docs.map((d) => parseDates({ id: d.id, ...d.data() }));
    },
    findFirst: async ({ where }: { where: { bookingId?: string; partnerId?: string; status?: string } }) => {
      const list = await firestoreDb.workDispatches.findMany({ where });
      return list.length > 0 ? list[0] : null;
    },
    create: async ({ data }: { data: any }) => {
      const id = data.id || doc(collection(db, 'work_dispatches')).id;
      const payload = {
        ...data,
        id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'work_dispatches', id), payload);
      return parseDates(payload);
    },
    update: async ({ where, data }: { where: { id: string }; data: any }) => {
      const docRef = doc(db, 'work_dispatches', where.id);
      await updateDoc(docRef, { ...data, updatedAt: new Date().toISOString() });
      const snap = await getDoc(docRef);
      return parseDates({ id: snap.id, ...snap.data() });
    },
    updateMany: async ({ where, data }: { where: any; data: any }) => {
      const list = await firestoreDb.workDispatches.findMany({ where });
      await Promise.all(
        list.map((item) =>
          updateDoc(doc(db, 'work_dispatches', item.id), {
            ...data,
            updatedAt: new Date().toISOString()
          })
        )
      );
      return { count: list.length };
    }
  },

  transactions: {
    findMany: async (args?: { where?: any; orderBy?: any }) => {
      const colRef = collection(db, 'partner_transactions');
      const q = buildQuery(colRef, args?.where, args?.orderBy);
      const snap = await getDocs(q);
      return snap.docs.map((d) => parseDates({ id: d.id, ...d.data() }));
    },
    create: async ({ data }: { data: any }) => {
      const id = data.id || doc(collection(db, 'partner_transactions')).id;
      const payload = {
        ...data,
        id,
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'partner_transactions', id), payload);
      return parseDates(payload);
    }
  },

  clientAuditLogs: {
    create: async ({ data }: { data: any }) => {
      const id = doc(collection(db, 'client_audit_logs')).id;
      const payload = { ...data, id, createdAt: new Date().toISOString() };
      await setDoc(doc(db, 'client_audit_logs', id), payload);
      return parseDates(payload);
    },
    findMany: async () => {
      const snap = await getDocs(collection(db, 'client_audit_logs'));
      return snap.docs.map((d) => parseDates({ id: d.id, ...d.data() }));
    }
  },

  partnerAuditLogs: {
    create: async ({ data }: { data: any }) => {
      const id = doc(collection(db, 'partner_audit_logs')).id;
      const payload = { ...data, id, createdAt: new Date().toISOString() };
      await setDoc(doc(db, 'partner_audit_logs', id), payload);
      return parseDates(payload);
    },
    findMany: async () => {
      const snap = await getDocs(collection(db, 'partner_audit_logs'));
      return snap.docs.map((d) => parseDates({ id: d.id, ...d.data() }));
    }
  }
};
