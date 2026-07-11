import { httpsCallable, } from "firebase/functions";
import { functions } from "./app";

export const functionsService = {
  /**
   * Invoke a typed callable Cloud Function
   */
  call: async ( 
    functionName,
    data
  ) => {
    const fnRef = httpsCallable(functions, functionName);
    return fnRef(data);
  }
};
