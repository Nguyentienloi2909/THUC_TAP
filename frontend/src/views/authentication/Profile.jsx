import React, { useState, useEffect } from 'react';
import {
    Grid, Typography, Button, List, ListItem, ListItemText, Avatar,
    Box, CircularProgress, Card, CardContent, CardHeader, Divider, Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';
import PageContainer from 'src/components/container/PageContainer';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userData = await ApiService.getUserProfile();
                setUser(userData);
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Lỗi khi tải hồ sơ');
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
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography variant="h6" color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <PageContainer title="Thông tin nhân viên" description="Trang chi tiết hồ sơ cá nhân">
            <Box sx={{ minHeight: '100vh', py: 4, px: { xs: 2, sm: 4 } }}>
                <Grid container justifyContent="center">
                    <Grid item xs={12} md={10} lg={8}>
                        <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
                            <CardHeader
                                avatar={
                                    <Avatar
                                        src={user.avatar}
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            border: '3px solid white',
                                            boxShadow: 2
                                        }}
                                    />
                                }
                                title={
                                    <Typography variant="h5" fontWeight={700}>{user.fullName}</Typography>
                                }
                                subheader={
                                    <>
                                        <Typography variant="body1" color="text.secondary">{user.roleName}</Typography>
                                        <Typography variant="body2" color="text.secondary">Nhóm: {user.groupName}</Typography>
                                        <Chip
                                            label={user.status === 'Active' ? 'Đang hoạt động' : user.status}
                                            color={user.status === 'Active' ? 'success' : 'default'}
                                            size="small"
                                            sx={{ mt: 1 }}
                                        />
                                    </>
                                }
                                sx={{ pb: 0, pt: 3, px: 4 }}
                            />
                            <Divider sx={{ my: 2 }} />
                            <CardContent>
                                <Grid container spacing={4}>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>Thông tin cá nhân</Typography>
                                        <List dense>
                                            <InfoItem label="Ngày sinh" value={formatDate(user.birthDate)} />
                                            <InfoItem label="Giới tính" value={user.gender ? 'Nam' : 'Nữ'} />
                                            <InfoItem label="Số điện thoại" value={user.phoneNumber} />
                                            <InfoItem label="Email" value={user.email} />
                                            <InfoItem label="Địa chỉ" value={user.address} />
                                        </List>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>Thông tin công việc</Typography>
                                        <List dense>
                                            <InfoItem label="Ngân hàng" value={`${user.bankName} - ${user.bankNumber}`} />
                                            <InfoItem label="Lương tháng" value={user.monthSalary ? `${user.monthSalary.toLocaleString('vi-VN')} VNĐ` : '---'} />
                                            <InfoItem label="Ngày bắt đầu" value={formatDate(user.startDate)} />
                                            <InfoItem label="Trạng thái" value={user.status} />
                                        </List>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ my: 4 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                    <Button variant="contained" onClick={handleEditProfile} sx={{ minWidth: 120 }}>
                                        Sửa hồ sơ
                                    </Button>
                                    <Button variant="outlined" onClick={handleLogout} sx={{ minWidth: 120 }}>
                                        Đăng xuất
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </PageContainer>
    );
};

const InfoItem = ({ label, value }) => (
    <ListItem sx={{ py: 1 }}>
        <ListItemText
            primary={label}
            secondary={value}
            primaryTypographyProps={{ fontWeight: 500 }}
            secondaryTypographyProps={{ color: 'text.secondary' }}
        />
    </ListItem>
);

const formatDate = (dateStr) => {
    if (!dateStr) return '---';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN');
};

export default Profile;
