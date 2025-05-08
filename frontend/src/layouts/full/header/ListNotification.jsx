import React from 'react';
import {
    Box,
    Typography,
    Menu,
    MenuItem,
    Divider,
    Button,
    Avatar,
} from '@mui/material';
import { IconCheck } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

const notifications = [
    {
        id: 1,
        title: 'Đơn xin nghỉ phép được duyệt',
        time: '5 phút trước',
        isRead: false,
        type: 'leave'
    },
    {
        id: 2,
        title: 'Nhiệm vụ mới được giao',
        time: '1 giờ trước',
        isRead: false,
        type: 'task'
    },
    {
        id: 3,
        title: 'Lương tháng 2 đã được cập nhật',
        time: '2 giờ trước',
        isRead: true,
        type: 'payroll'
    }
];

const ListNotification = ({ anchorEl, open, onClose }) => {
    const navigate = useNavigate();

    const handleNotificationClick = (type) => {
        switch (type) {
            case 'leave':
                navigate('/nleave');
                break;
            case 'task':
                navigate('/manage/tasks');
                break;
            case 'payroll':
                navigate('/manage/payroll');
                break;
            default:
                break;
        }
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
            
            {notifications.map((notification) => (
                <MenuItem 
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.type)}
                    sx={{
                        py: 1.5,
                        px: 2,
                        backgroundColor: notification.isRead ? 'inherit' : 'action.hover',
                    }}
                >
                    <Box sx={{ width: '100%' }}>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Typography variant="subtitle2">{notification.title}</Typography>
                            {!notification.isRead && (
                                <Box 
                                    sx={{ 
                                        width: 8, 
                                        height: 8, 
                                        borderRadius: '50%', 
                                        bgcolor: 'primary.main' 
                                    }} 
                                />
                            )}
                        </Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {notification.time}
                        </Typography>
                    </Box>
                </MenuItem>
            ))}
            
            <Divider />
            <Box p={2} display="flex" justifyContent="center">
                <Button
                    size="small"
                    startIcon={<IconCheck size={18} />}
                    onClick={onClose}
                >
                    Đánh dấu tất cả đã đọc
                </Button>
            </Box>
        </Menu>
    );
};

export default ListNotification;