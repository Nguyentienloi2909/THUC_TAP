// src/contexts/SignalRContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { chatConnection } from 'src/service/SignalR';
import { useUser } from './UserContext';

const SignalRContext = createContext();

export const SignalRProvider = ({ children }) => {
    const { user } = useUser(); // Lấy thông tin người dùng
    const [connectionState, setConnectionState] = useState(chatConnection.state);

    useEffect(() => {
        const startConnection = async () => {
            try {
                if (chatConnection.state === 'Disconnected' && user.isAuthenticated) {
                    chatConnection.accessTokenFactory = () => user.token; // Sử dụng token từ UserContext
                    await chatConnection.start();
                    setConnectionState('Connected');
                    console.log('Fetching notifications...');
                }
            } catch (error) {
                setConnectionState('Disconnected');
                console.error('SignalR Connection Error:', error);
            }
        };

        startConnection();

        const handleStateChange = () => {
            setConnectionState(chatConnection.state);
            if (chatConnection.state === 'Connected') {
                console.log('Fetching notifications...');
            }
        };

        chatConnection.onreconnecting(() => setConnectionState('Reconnecting'));
        chatConnection.onreconnected(() => setConnectionState('Connected'));
        chatConnection.onclose(() => setConnectionState('Disconnected'));

        return () => {
            chatConnection.off('reconnecting', handleStateChange);
            chatConnection.off('reconnected', handleStateChange);
            chatConnection.off('close', handleStateChange);
        };
    }, [user.isAuthenticated, user.token]); // Chạy lại khi trạng thái đăng nhập hoặc token thay đổi

    return (
        <SignalRContext.Provider value={{ chatConnection, connectionState }}>
            {children}
        </SignalRContext.Provider>
    );
};

export const useSignalR = () => useContext(SignalRContext);