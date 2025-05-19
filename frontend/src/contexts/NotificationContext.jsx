import React, { createContext, useState, useEffect, useCallback } from 'react';
import ApiService from 'src/service/ApiService';
import { notificationConnection } from '../service/SignalR';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const data = await ApiService.getStatusNotification();
            setNotifications(data || []);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    // Listen for SignalR events
    useEffect(() => {
        notificationConnection.start().then(() => {
            console.log('SignalR Connected');
            notificationConnection.on('ReceiveNotification', (notification) => {
                setNotifications((prev) => [...prev, notification]);
            });
        }).catch((error) => {
            console.error('SignalR notificationConnection Error:', error);
        });

        return () => {
            notificationConnection.stop();
        };
    }, []);

    const markAsRead = useCallback(async (notificationId) => {
        try {
            await ApiService.updateStatusNotification(notificationId);
            setNotifications((prev) =>
                prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
            );
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        try {
            const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id);
            if (unreadIds.length === 0) return;
            await Promise.all(unreadIds.map((id) => ApiService.updateStatusNotification(id)));
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    }, [notifications]);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                loading,
                fetchNotifications,
                markAsRead,
                markAllAsRead,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};
