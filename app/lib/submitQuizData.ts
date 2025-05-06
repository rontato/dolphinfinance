import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

export const submitQuizData = async (data: any) => {
  try {
    const docRef = await addDoc(collection(db, "quiz_responses"), data);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}; 