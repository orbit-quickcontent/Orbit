import { httpsCallable, } from "firebase/functions";
import { functions } from "./app";

export const functionsService = {
  call: async ( 
    functionName,
    data
  ) => {
    const fnRef = httpsCallable(functions, functionName);
    return fnRef(data);
  }
};
