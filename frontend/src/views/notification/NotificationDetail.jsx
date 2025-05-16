
import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Divider, ButtonGroup, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { IconArrowLeft, IconEdit, IconTrash } from '@tabler/icons-react';
import { NotificationContext } from '../../contexts/NotificationContext';
import ApiService from 'src/service/ApiService'; // Import ApiService

const NotificationDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { notification } = location.state || {};
    const { markAsRead } = useContext(NotificationContext);
    const [readTime, setReadTime] = useState(null);
    const [user, setUser] = useState(null); // State to store user data

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await ApiService.getUserProfile(); // Fetch user data
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();

        if (notification && !notification.isRead) {
            markAsRead(notification.id);
        }
        setReadTime(new Date());
    }, [notification, markAsRead]);

    if (!notification) {
        return (
            <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
                Không có thông báo được chọn
            </Typography>
        );
    }

    const handleEdit = () => {
        console.log('Edit notification:', notification.id);
        // Navigate to edit page or handle edit logic
    };

    const handleDelete = async () => {
        const confirmed = window.confirm('Are you sure you want to delete this notification?');
        if (confirmed) {
            try {
                await ApiService.deleteNotification(notification.id);
                console.log('Notification deleted successfully');
                navigate('/home'); // Go back to the previous page
            } catch (error) {
                console.error('Error deleting notification:', error);
            }
        }
    };

    return (
        <PageContainer title="Thông báo" description="Chi tiết thông báo">
            <Box sx={{
                mb: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Button
                    variant="outlined"
                    startIcon={<IconArrowLeft />}
                    onClick={() => navigate(-1)}
                    sx={{ fontSize: '0.95rem', mr: 2 }}
                >
                    Trở lại
                </Button>
                {user?.roleName === 'ADMIN' && (
                    <ButtonGroup variant="contained">
                        <Button
                            color="primary"
                            startIcon={<IconEdit />}
                            onClick={handleEdit}
                            sx={{ fontSize: '0.95rem' }}
                        >
                            Sửa
                        </Button>
                        <Button
                            color="error"
                            startIcon={<IconTrash />}
                            onClick={handleDelete}
                            sx={{ fontSize: '0.95rem' }}
                        >
                            Xóa
                        </Button>
                    </ButtonGroup>
                )}
            </Box>
            <DashboardCard title="" sx={{ maxWidth: '800px', margin: 'auto', mt: 4, boxShadow: 3, borderRadius: 2 }}>
                <Box sx={{ p: 4 }}>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
                        {notification.title}
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    <Typography variant="body1" paragraph sx={{ mb: 3, lineHeight: 1.6 }}>
                        {notification.description}
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                        Ngày đăng: {new Date(notification.sentAt).toLocaleString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                        })}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                        Thời gian đọc: {readTime ? readTime.toLocaleString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                        }) : 'Đang tải...'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 3 }}>
                        Người đăng: {notification.senderName}
                    </Typography>
                </Box>
            </DashboardCard>
        </PageContainer>
    );
};

export default NotificationDetail;
