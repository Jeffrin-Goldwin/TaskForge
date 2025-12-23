import axios from 'axios';

// Ensure these env vars are set in .env.local
const USER_SERVICE_URL = process.env.NEXT_PUBLIC_USER_SERVICE_URL || 'http://localhost:3002/api';
const TASK_SERVICE_URL = process.env.NEXT_PUBLIC_TASK_SERVICE_URL || 'http://localhost:3003/api';

export const userApi = axios.create({
    baseURL: USER_SERVICE_URL,
});

export const taskApi = axios.create({
    baseURL: TASK_SERVICE_URL,
});

export const getAuthHeader = () => {
    // Basic implementation: Get token from localStorage
    // In a real app, use a proper hook or session management
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    }
    return {};
};
