import React from 'react';
import { Link } from 'react-router-dom';
import {
    Box,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Typography,
    Button,
    Divider
} from '@mui/material';
import { IconMessage, IconChevronRight } from '@tabler/icons-react';
import ProfileImg from 'src/assets/images/profile/user-1.jpg';
const ListMessage = ({ anchorEl, open, onClose }) => {
    const messages = [
        {
            id: 1,
            sender: 'Nguyễn Văn A',
            content: 'Xin chào, tôi cần hỗ trợ về vấn đề chấm công tháng này...',
            time: '10 phút trước',
            avatar: ProfileImg
        },
        {
            id: 2,
            sender: 'Trần Thị B',
            content: 'Báo cáo sự cố máy chấm công tại phòng kế toán...',
            time: '30 phút trước',
            avatar: ProfileImg
        },
        {
            id: 3,
            sender: 'Lê Văn C',
            content: 'Đơn xin nghỉ phép đã được phê duyệt...',
            time: '1 giờ trước',
            avatar: ProfileImg
        }
    ];

    return (
        <Menu
            id="msgs-menu"
            anchorEl={anchorEl}
            keepMounted
            open={open}
            onClose={onClose}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            sx={{
                '& .MuiMenu-paper': {
                    width: '320px',
                },
            }}
        >
            {messages.map((message, index) => (
                <MenuItem key={message.id} sx={{ py: 1.5 }}>
                    <ListItemAvatar>
                        <Avatar alt={message.sender} src={message.avatar} />
                    </ListItemAvatar>
                    <ListItemText
                        primary={<Typography component="div">{message.sender}</Typography>}
                        secondary={
                            <Box component="span">
                                <Typography
                                    component="span"
                                    sx={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                    }}
                                >
                                    {message.content}
                                </Typography>
                                <Typography component="span" variant="caption" color="text.secondary" display="block">
                                    {message.time}
                                </Typography>
                            </Box>
                        }
                    />
                </MenuItem>
            ))}
            <Divider />
            <Box mt={1} py={1} px={2}>
                <Button
                    to="/messages"
                    variant="outlined"
                    color="primary"
                    component={Link}
                    fullWidth
                    endIcon={<IconChevronRight />}
                >
                    Xem tất cả tin nhắn
                </Button>
            </Box>
        </Menu>
    );
};

export default ListMessage;