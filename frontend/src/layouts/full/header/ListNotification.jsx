import React, { useContext } from 'react';
import { Box, Typography, Menu, MenuItem, Divider, Button } from '@mui/material';
import { IconCheck } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { NotificationContext } from '../../../contexts/NotificationContext';

const ListNotification = ({ anchorEl, open, onClose }) => {
    const navigate = useNavigate();
    const { notifications, markAsRead, markAllAsRead } = useContext(NotificationContext);

    const handleNotificationClick = (notification) => {
        if (!notification.isRead) {
            markAsRead(notification.id);
        }
        navigate(`/notification/${notification.id}`, { state: { notification } }); // Navigate to detail page with ID
        onClose();
    };

    return (
        <Menu
            anchorEl={anchorEl}
            id="notification-menu"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: { width: 320, maxHeight: 450 },
            }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        >
            <Box p={2}>
                <Typography variant="h6">Thông báo</Typography>
            </Box>
            <Divider />

            {notifications.length === 0 ? (
                <MenuItem disabled>
                    <Typography variant="body2" color="text.secondary">
                        Không có thông báo mới nào
                    </Typography>
                </MenuItem>
            ) : (
                notifications.slice(0, 3).map((notification) => ( // Display first 3 notifications
                    <MenuItem
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        sx={{
                            py: 1.5,
                            px: 2,
                            backgroundColor: notification.isRead ? 'inherit' : 'action.hover',
                        }}
                    >
                        <Box sx={{ width: '100%' }}>
                            <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                            >
                                <Typography variant="subtitle2">{notification.title}</Typography>
                                {!notification.isRead && (
                                    <Box
                                        sx={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            bgcolor: 'primary.main',
                                        }}
                                    />
                                )}
                            </Box>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {notification.time || new Date(notification.sentAt).toLocaleTimeString('vi-VN')}
                            </Typography>
                        </Box>
                    </MenuItem>
                ))
            )}

            <Divider />
            <Box p={2} display="flex" justifyContent="center">
                <Button
                    size="small"
                    startIcon={<IconCheck size={18} />}
                    onClick={() => navigate('/home')}
                >
                    Tất cả thông báo
                </Button>
            </Box>
        </Menu>
    );
};

export default ListNotification;
