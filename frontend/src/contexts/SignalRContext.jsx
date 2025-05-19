import React, { createContext, useContext, useEffect, useState } from 'react';
import { chatConnection } from 'src/service/SignalR';

const SignalRContext = createContext();

export const SignalRProvider = ({ children }) => {
    const [connectionState, setConnectionState] = useState(chatConnection.state);

    useEffect(() => {
        const startConnection = async () => {
            try {
                if (chatConnection.state === 'Disconnected') {
                    const token = localStorage.getItem('token');
                    if (token) {
                        chatConnection.accessTokenProvider = () => token;
                    }
                    await chatConnection.start();
                    console.log('ChatHub connected');
                    setConnectionState('Connected');
                }
            } catch (error) {
                console.error('Failed to connect to ChatHub:', error);
                setConnectionState('Disconnected');
            }
        };

        startConnection();

        const handleStateChange = () => setConnectionState(chatConnection.state);
        chatConnection.onreconnecting(() => setConnectionState('Reconnecting'));
        chatConnection.onreconnected(() => setConnectionState('Connected'));
        chatConnection.onclose(() => setConnectionState('Disconnected'));

        return () => {
            chatConnection.off('reconnecting', handleStateChange);
            chatConnection.off('reconnected', handleStateChange);
            chatConnection.off('close', handleStateChange);
        };
    }, []);

    return (
        <SignalRContext.Provider value={{ chatConnection, connectionState }}>
            {children}
        </SignalRContext.Provider>
    );
};

export const useSignalR = () => useContext(SignalRContext);