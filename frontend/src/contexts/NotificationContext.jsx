// src/contexts/NotificationContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import ApiService from 'src/service/ApiService';
import { notificationConnection } from '../service/SignalR';
import { useUser } from './UserContext';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { user } = useUser();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    // Hàm sort notification mới nhất lên đầu
    const sortNotifications = (arr) =>
        [...arr].sort(
            (a, b) =>
                new Date(b.timestamp || b.createdAt) - new Date(a.timestamp || a.createdAt)
        );

    const fetchNotifications = useCallback(async () => {
        if (!user.isAuthenticated) return;
        try {
            setLoading(true);
            const data = await ApiService.getStatusNotification();
            setNotifications(sortNotifications(data || []));
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    }, [user.isAuthenticated]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    // Listen for SignalR events
    useEffect(() => {
        let isMounted = true;
        if (!user.isAuthenticated) return;

        const startConnection = async () => {
            try {
                if (notificationConnection.state !== 'Connected') {
                    await notificationConnection.start();
                    console.log('SignalR Connected');
                }
                // Đăng ký event chỉ 1 lần
                const handler = (notification) => {
                    if (!notification.role || notification.role === user.role) {
                        setNotifications((prev) =>
                            sortNotifications([notification, ...prev])
                        );
                    }
                };
                notificationConnection.on('ReceiveNotification', handler);

                // Không gọi fetchNotifications ở đây để tránh gọi lại API
            } catch (error) {
                console.error('SignalR notificationConnection Error:', error);
            }
        };

        startConnection();

        return () => {
            // Chỉ hủy đăng ký event, không stop connection
            notificationConnection.off('ReceiveNotification');
            isMounted = false;
        };
        // Chỉ phụ thuộc user.isAuthenticated, user.role
    }, [user.isAuthenticated, user.role]);

    const markAsRead = useCallback(async (notificationId) => {
        try {
            await ApiService.updateStatusNotification(notificationId);
            setNotifications((prev) =>
                sortNotifications(
                    prev.map((n) =>
                        n.id === notificationId ? { ...n, isRead: true } : n
                    )
                )
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
            setNotifications((prev) =>
                sortNotifications(prev.map((n) => ({ ...n, isRead: true })))
            );
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