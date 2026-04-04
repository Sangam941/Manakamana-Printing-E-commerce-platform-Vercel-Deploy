import api from "./axios";

// Get all notifications
export const getAllNotifications = async () => {
    try {
        const response = await api.get('/v1/wallet/notifications');
        return response.data.data.items || [];
    } catch (error) {
        throw error;
    }
};

// Mark a single notification as read by ID
export const markNotificationAsRead = async (notificationId: string) => {
    try {
        const response = await api.patch(`/v1/wallet/notifications/${notificationId}/read`);
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
    try {
        const response = await api.post('/v1/wallet/notifications/mark-all-read');
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

// Clear all notifications
export const clearAllNotifications = async () => {
    try {
        const response = await api.post('/v1/wallet/notifications/clear-all');
        return response.data.data;
    } catch (error) {
        throw error;
    }
};