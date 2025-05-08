import React, { useState, useEffect } from 'react';
import {
    Grid,
    CardContent,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import Notification from '../notification/components/Notification'
import ApiService from 'src/service/ApiService'; // Import ApiService
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const HomePage = () => {
    const navigate = useNavigate(); // Initialize navigate
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(10);
    const [userRole, setUserRole] = useState(''); // Initialize with an empty string

    useEffect(() => {
        // Fetch user role using ApiService
        const role = ApiService.isAdmin() ? 'ADMIN' : 'USER'; // Example logic
        setUserRole(role);
    }, []);

    const announcements = Array.from({ length: 30 }, (_, index) => ({
        id: index + 1,
        title: `Điều chỉnh nhân sự bộ phận ... ${index + 1}`,
        summary: `Thông tin đến từ bộ phận quản lý ... ${index + 1}. Click to read more...`,
        date: '2024-01-15',
        author: 'Tưởng Nguyễn Văn ' + (index % 3 + 1),
        isRead: index % 3 === 0,
        content: `Chi tiết thông báo ${index + 1}  qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq wwwwwwwwwwwwwwwwwwwwwwwwwwwww eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr tttttttttttttttttttttttttttttttttttttttttt yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu` // Add detailed content
    }));

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleNotificationClick = (notification) => {
        navigate('/notification/1', { state: { notification } }); // Navigate to NotificationDetail
    };

    const handleAddNotification = () => {
        // Logic to add a new notification
        console.log('Add Notification button clicked');
    };

    return (
        <PageContainer title="Trang chủ" description="Trang chủ">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <DashboardCard title="Thông báo">
                        {userRole === 'ADMIN' && ( // Check if user role is ADMIN
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleAddNotification} // Ensure function is defined
                                    sx={{
                                        transition: 'transform 0.2s, background-color 0.2s',
                                        '&:hover': {
                                            backgroundColor: 'primary.dark',
                                            transform: 'scale(1.05)'
                                        },
                                        '&:active': {
                                            transform: 'scale(0.95)'
                                        }
                                    }}
                                >
                                    Thêm thông báo
                                </Button>
                            </div>
                        )}
                        <CardContent sx={{ p: 1 }}>
                            <Notification
                                announcements={announcements}
                                page={page}
                                rowsPerPage={rowsPerPage}
                                handleChangePage={handleChangePage}
                                onNotificationClick={handleNotificationClick} // Update click handler
                                compact
                            />
                        </CardContent>
                    </DashboardCard>
                </Grid>
            </Grid>
        </PageContainer>
    );
};

export default HomePage;
