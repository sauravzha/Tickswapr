import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

// Upload file to Firebase Storage
export const uploadFile = async (file, path) => {
    try {
        if (!file) return null;

        // Create a reference to the file location
        // Example path: 'tickets/userId/timestamp_filename'
        const storageRef = ref(storage, path);

        // Upload the file
        const snapshot = await uploadBytes(storageRef, file);

        // Get the download URL
        const downloadURL = await getDownloadURL(snapshot.ref);

        return downloadURL;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};

// Upload ticket image
export const uploadTicketImage = async (file, userId) => {
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const path = `tickets/${userId}/${fileName}`;
    return uploadFile(file, path);
};
