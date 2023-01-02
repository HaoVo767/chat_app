import {useEffect, useState} from "react";
import { db } from '../firebase/configure';

export const useFirestore = (collection, condition) => {
    const [documents, setDocuments] = useState([]);
    useEffect(() => {
        let collectionRef = db.collection(collection).orderBy('createAt');
        if (condition) {
            if (!condition.compareValue || !condition.compareValue.length) {
                return;
            }
            collectionRef = collectionRef.where(
                condition.fieldName, 
                condition.operator, 
                condition.compareValue
            );
        }
        const unsubcribe = collectionRef.onSnapshot((snapshot) => {
            const documents = snapshot.docs.map(doc => ({
                ...doc.data(),
               id: doc.id,
            }))
            setDocuments(documents);
        })
        return unsubcribe;
      }, [collection, condition]);
      return documents;
}