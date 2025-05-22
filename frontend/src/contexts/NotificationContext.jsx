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

    const fetchNotifications = useCallback(async () => {
        if (!user.isAuthenticated) return; // Không lấy thông báo nếu chưa đăng nhập
        try {
            setLoading(true);
            const data = await ApiService.getStatusNotification();
            setNotifications(data || []);
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
        const startConnection = async () => {
            try {
                if (user.isAuthenticated) {
                    await notificationConnection.start();
                    console.log('SignalR Connected');
                    notificationConnection.on('ReceiveNotification', (notification) => {
                        // Chỉ thêm thông báo nếu phù hợp với vai trò người dùng
                        if (!notification.role || notification.role === user.role) {
                            setNotifications((prev) => [...prev, notification]);
                        }
                    });
                    fetchNotifications();
                }
            } catch (error) {
                console.error('SignalR notificationConnection Error:', error);
            }
        };

        startConnection();

        return () => {
            notificationConnection.stop();
        };
    }, [fetchNotifications, user.isAuthenticated, user.role]);

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