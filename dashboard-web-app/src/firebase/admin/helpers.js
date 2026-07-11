 function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import { Timestamp } from "firebase/firestore";

export const firebaseHelpers = {
  /**
   * Convert a Firestore Timestamp object safely to standard JS Date object
   */
  toDate: (timestamp) => {
    if (!timestamp) return null;
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate();
    }
    if (typeof timestamp.toDate === "function") {
      return timestamp.toDate();
    }
    if (timestamp.seconds !== undefined) {
      return new Timestamp(timestamp.seconds, timestamp.nanoseconds || 0).toDate();
    }
    return new Date(timestamp);
  },

  /**
   * Parse deep dates of a Firestore document object recursively
   */
  parseDates: (data) => {
    if (!data || typeof data !== "object") return data;
    const parsed = { ...data };
    for (const key of Object.keys(parsed)) {
      const val = parsed[key];
      if (val && typeof val === "object" && (val instanceof Timestamp || typeof val.toDate === "function")) {
        parsed[key] = _optionalChain([firebaseHelpers, 'access', _ => _.toDate, 'call', _2 => _2(val), 'optionalAccess', _3 => _3.toISOString, 'call', _4 => _4()]);
      } else if (typeof val === "object") {
        parsed[key] = firebaseHelpers.parseDates(val);
      }
    }
    return parsed;
  },

  /**
   * Convert standard js Date objects to Firebase Firestore timestamps
   */
  toTimestamp: (date) => {
    return Timestamp.fromDate(new Date(date));
  }
};
