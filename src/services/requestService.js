import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    doc,
    deleteDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';

const REQUESTS_COLLECTION = 'requests';

export const createRequest = async (requestData) => {
    try {
        const request = {
            ...requestData,
            createdAt: serverTimestamp(),
            status: 'active'
        };
        const docRef = await addDoc(collection(db, REQUESTS_COLLECTION), request);
        return { id: docRef.id, ...request };
    } catch (error) {
        console.error('Error creating request:', error);
        throw error;
    }
};

export const getRequests = async (filters = {}) => {
    try {
        let q = query(
            collection(db, REQUESTS_COLLECTION),
            where('status', '==', 'active'),
            orderBy('createdAt', 'desc')
        );

        if (filters.limit) {
            q = query(q, limit(filters.limit));
        }

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching requests:', error);
        throw error;
    }
};

export const deleteRequest = async (requestId) => {
    try {
        await deleteDoc(doc(db, REQUESTS_COLLECTION, requestId));
        return true;
    } catch (error) {
        console.error('Error deleting request:', error);
        throw error;
    }
};
