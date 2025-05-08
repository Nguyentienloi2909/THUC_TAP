import React, { useState, useEffect } from 'react';
import {
    Paper,
    Grid,
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
    Avatar,
    Box,
    CircularProgress
} from '@mui/material';
import ApiService from '../../service/ApiService';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const userData = await ApiService.getUserProfile();
                setUser(userData);
            } catch (error) {
                setError(error.response?.data?.message || error.message || 'Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleLogout = () => {
        ApiService.logout();
        navigate('/home');
    };

    const handleEditProfile = () => {
        navigate('/edit-profile');
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'error.main' }}>
                <Typography variant="h6">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3, bgcolor: 'background.default' }}>
            <Paper sx={{ width: '100%', maxWidth: '800px', p: 4, borderRadius: 4, boxShadow: 3 }}>
                <Grid container spacing={4}>
                    {/* Left Column - User Info */}
                    <Grid item xs={12} md={4}>
                        <Box sx={{
                            textAlign: 'center',
                            p: 2,
                            borderRight: { md: '1px solid #eee' }
                        }}>
                            <Avatar
                                src={user.avatar}
                                sx={{
                                    width: 120,
                                    height: 120,
                                    mx: 'auto',
                                    mb: 2,
                                    border: '3px solid',
                                    borderColor: 'background.paper',
                                    boxShadow: 2
                                }}
                            />
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, fontSize: '1.25rem' }}>
                                {user.fullName}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'text.secondary',
                                    mb: 1,
                                    fontWeight: 500,
                                    fontSize: '1rem'
                                }}
                            >
                                {user.roleName}
                            </Typography>
                            {/* Additional Info in Left Column */}
                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'text.secondary',
                                    mb: 1,
                                    fontWeight: 500,
                                    fontSize: '1rem'
                                }}
                            >
                                Giới tính: {user.gender ? 'Nam' : 'Nữ'}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'text.secondary',
                                    mb: 1,
                                    fontWeight: 500,
                                    fontSize: '1rem'
                                }}
                            >
                                Nhóm: {user.groupName}
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Right Column - Details */}
                    <Grid item xs={12} md={8}>
                        <Box sx={{ p: 2 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Thông tin cá nhân
                            </Typography>
                            <List dense>
                                <ListItem sx={{ py: 1 }}>
                                    <ListItemText
                                        primary="Ngày Sinh"
                                        secondary={new Date(user.birthDate).toLocaleDateString()}
                                        primaryTypographyProps={{ fontWeight: 500 }}
                                    />
                                </ListItem>
                                <ListItem sx={{ py: 1 }}>
                                    <ListItemText
                                        primary="Số điện thoại"
                                        secondary={user.phoneNumber}
                                        primaryTypographyProps={{ fontWeight: 500 }}
                                    />
                                </ListItem>
                                <ListItem sx={{ py: 1 }}>
                                    <ListItemText
                                        primary="Địa chỉ"
                                        secondary={user.address}
                                        primaryTypographyProps={{ fontWeight: 500 }}
                                    />
                                </ListItem>
                                <ListItem sx={{ py: 1 }}>
                                    <ListItemText
                                        primary="Email"
                                        secondary={user.email}
                                        primaryTypographyProps={{ fontWeight: 500 }}
                                    />
                                </ListItem>
                                <ListItem sx={{ py: 1 }}>
                                    <ListItemText
                                        primary="Ngân hàng"
                                        secondary={`${user.bankName} - ${user.bankNumber}`}
                                        primaryTypographyProps={{ fontWeight: 500 }}
                                    />
                                </ListItem>
                                <ListItem sx={{ py: 1 }}>
                                    <ListItemText
                                        primary="Trạng thái"
                                        secondary={user.status}
                                        primaryTypographyProps={{ fontWeight: 500 }}
                                    />
                                </ListItem>
                            </List>

                            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button
                                    variant="contained"
                                    onClick={handleEditProfile}
                                    sx={{
                                        textTransform: 'none',
                                        minWidth: 100
                                    }}
                                >
                                    Sửa hồ sơ
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={handleLogout}
                                    sx={{
                                        textTransform: 'none',
                                        minWidth: 100
                                    }}
                                >
                                    Đăng xuất
                                </Button>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default Profile;
