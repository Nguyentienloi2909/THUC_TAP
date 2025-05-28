import React, { createContext, useContext, useState, useCallback } from 'react';

const MessageBadgeContext = createContext();

export const MessageBadgeProvider = ({ children }) => {
    // { userId: true, groupId: true }
    const [unread, setUnread] = useState({});

    // Khi nhận tin nhắn mới
    const markUnread = useCallback((type, id) => {
        console.log('Mark unread:', type, id);
        setUnread(prev => ({ ...prev, [`${type}_${id}`]: true }));
    }, []);

    // Khi user đọc (chọn) cuộc trò chuyện
    const markRead = useCallback((type, id) => {
        console.log('Mark read:', type, id);
        setUnread(prev => {
            const copy = { ...prev };
            delete copy[`${type}_${id}`];
            return copy;
        });
    }, []);

    // Tổng số badge chưa đọc
    const unreadCount = Object.keys(unread).length;

    return (
        <MessageBadgeContext.Provider value={{ unread, unreadCount, markUnread, markRead }}>
            {children}
        </MessageBadgeContext.Provider>
    );
};

export const useMessageBadge = () => useContext(MessageBadgeContext);