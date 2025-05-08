import React from 'react';
import { Box, Typography, Divider, IconButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer'; // Import PageContainer
import DashboardCard from '../../components/shared/DashboardCard'; // Import DashboardCard
import { IconArrowLeft } from '@tabler/icons-react'; // Import IconArrowLeft

const NotificationDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { notification } = location.state || {};

    if (!notification) {
        return <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>No notification selected</Typography>;
    }

    return (
        <Box sx={{ position: 'relative', mb: 2 }}>
            <IconButton onClick={() => navigate(-1)} sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1000 }}>
                <IconArrowLeft />
            </IconButton>
            <PageContainer title="Thông báo" description="Chi tiết thông báo">
                <DashboardCard title="" sx={{ maxWidth: '800px', margin: 'auto', mt: 4, boxShadow: 3, borderRadius: 2 }}>
                    <Box sx={{ p: 4 }}>
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
                            {notification.title}
                        </Typography>
                        <Divider sx={{ mb: 3 }} />
                        <Typography variant="body1" paragraph sx={{ mb: 3, lineHeight: 1.6 }}>
                            {notification.content}
                        </Typography>
                        <Divider sx={{ mb: 3 }} />
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                            Ngày đăng: {notification.date}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 3 }}>
                            Người đăng: {notification.author}
                        </Typography>
                    </Box>
                </DashboardCard>
            </PageContainer>
        </Box>
    );
};

export default NotificationDetail;