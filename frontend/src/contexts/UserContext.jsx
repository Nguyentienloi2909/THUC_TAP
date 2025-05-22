// src/contexts/UserContext.jsx
import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import ApiService from '../service/ApiService';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedRole = localStorage.getItem('role');
        const savedToken = localStorage.getItem('authToken');
        const savedFullName = localStorage.getItem('fullName'); // Thêm nếu muốn lưu fullName
        return {
            role: savedRole || null,
            isAuthenticated: !!savedToken,
            token: savedToken || null,
            userId: null,
            avatar: null,
            email: null,
            fullName: savedFullName || null,
            phoneNumber: null,
            // Thêm các trường khác nếu cần, ví dụ: department, createdAt, v.v.
        };
    });

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (user.isAuthenticated && !user.userId && user.token) {
                try {
                    const profile = await ApiService.getUserProfile();
                    console.log('User profile:', profile); // Log để kiểm tra
                    setUser((prev) => ({
                        ...prev,
                        userId: profile?.id || prev.userId,
                        avatar: profile?.avatar || prev.avatar,
                        email: profile?.email || prev.email,
                        fullName: profile?.fullName || prev.fullName,
                        phoneNumber: profile?.phoneNumber || prev.phoneNumber,
                        role: prev.role, // Giữ nguyên role từ login
                        // Thêm các trường khác từ profile nếu cần
                        // ví dụ: department: profile?.department || prev.department,
                    }));
                    // Lưu fullName vào localStorage (tùy chọn)
                    if (profile?.fullName) {
                        localStorage.setItem('fullName', profile.fullName);
                    }
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                    setUser((prev) => ({
                        ...prev,
                        userId: null,
                        avatar: null,
                        email: null,
                        fullName: null,
                        phoneNumber: null,
                    }));
                }
            }
        };

        fetchUserProfile();
    }, [user.isAuthenticated, user.token]);

    const login = async (username, password) => {
        try {
            const response = await ApiService.loginUser({
                Email: username,
                PasswordHash: password
            });
            const newUser = {
                role: response.role,
                isAuthenticated: true,
                token: response.token,
                userId: null,
                avatar: null,
                email: null,
                fullName: null,
                phoneNumber: null,
                // Thêm các trường khác nếu cần
            };
            setUser(newUser);
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('role', response.role);
            console.log('User set after login:', newUser);
        } catch (error) {
            console.error('Login error:', error);
            throw new Error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
        }
    };

    const logout = () => {
        ApiService.logout();
        setUser({
            role: null,
            isAuthenticated: false,
            token: null,
            userId: null,
            avatar: null,
            email: null,
            fullName: null,
            phoneNumber: null,
        });
        localStorage.removeItem('authToken');
        localStorage.removeItem('role');
        localStorage.removeItem('fullName'); // Xóa fullName nếu đã lưu
    };

    const value = useMemo(() => ({ user, login, logout }), [user]);

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};