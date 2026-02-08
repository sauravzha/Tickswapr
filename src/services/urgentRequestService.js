import { auth } from '../config/firebase';

const API_URL = 'http://localhost:5000/api/urgent-requests';

const getAuthHeader = async () => {
    const user = auth.currentUser;
    if (user) {
        try {
            const token = await user.getIdToken();
            return { 'Authorization': `Bearer ${token}` };
        } catch (error) {
            console.error("Error getting ID token:", error);
            return {};
        }
    }
    return {};
};

export const getUrgentRequests = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch requests');
        return await response.json();
    } catch (error) {
        console.error("Error fetching urgent requests:", error);
        throw error;
    }
};

export const createUrgentRequest = async (requestData) => {
    const headers = await getAuthHeader();
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create request');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const deleteUrgentRequest = async (id) => {
    const headers = await getAuthHeader();
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: headers
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete request');
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};
