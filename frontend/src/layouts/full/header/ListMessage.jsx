// src/layouts/header/ListMessage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Box,
    Menu,
    MenuItem,
    ListItemAvatar,
    Avatar,
    Typography,
    Button,
    Divider,
    CircularProgress,
    Badge,
} from '@mui/material';
import { IconChevronRight } from '@tabler/icons-react';
import ApiService from 'src/service/ApiService';
import { useSignalR } from 'src/contexts/SignalRContext';
import { useUser } from 'src/contexts/UserContext'; // Thêm useUser

const ListMessage = ({ anchorEl, open, onClose }) => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { chatConnection, connectionState } = useSignalR();
    const { user } = useUser(); // Lấy user từ UserContext
    const navigate = useNavigate();

    // Lấy danh sách group chat
    useEffect(() => {
        const fetchGroups = async () => {
            if (!open || !user.isAuthenticated || !user.userId) return;
            try {
                setLoading(true);
                setError(null);
                const data = await ApiService.getChatGroups();
                const enrichedGroups = await Promise.all(
                    data.map(async (group) => {
                        try {
                            const messages = await ApiService.getChatGroupById(group.id);
                            const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
                            const unreadCount = messages.filter(
                                (msg) => !msg.isRead && msg.senderId !== user.userId
                            ).length;
                            return {
                                ...group,
                                lastMessage: lastMessage
                                    ? {
                                        id: lastMessage.id,
                                        content: lastMessage.content,
                                        sentAt: lastMessage.sentAt,
                                        senderName: lastMessage.senderName,
                                    }
                                    : null,
                                unreadCount,
                            };
                        } catch (err) {
                            console.error(`Lỗi khi lấy tin nhắn cho group ${group.id}:`, err);
                            return { ...group, lastMessage: null, unreadCount: 0 };
                        }
                    })
                );
                setGroups(enrichedGroups || []);
            } catch (err) {
                console.error('Lỗi khi lấy danh sách group:', err);
                setError('Không thể tải danh sách nhóm. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, [open, user.isAuthenticated, user.userId]);

    // Tích hợp SignalR để nhận tin nhắn nhóm mới
    useEffect(() => {
        if (!chatConnection || connectionState !== 'Connected' || !user.userId) return;

        const handleReceiveGroupMessage = (messageDto) => {
            if (!messageDto || typeof messageDto !== 'object') return;
            const groupId = messageDto.groupChatId;
            setGroups((prev) => {
                const updatedGroups = prev.map((group) => {
                    if (group.id === groupId) {
                        const isRead = messageDto.senderId === user.userId || messageDto.isRead;
                        return {
                            ...group,
                            lastMessage: {
                                id: messageDto.id,
                                content: messageDto.content,
                                sentAt: messageDto.sentAt || new Date().toISOString(),
                                senderName: messageDto.senderName || 'Người gửi',
                            },
                            hasNewMessage: !isRead,
                        };
                    }
                    return group;
                });
                return updatedGroups.sort((a, b) => {
                    const timeA = a.lastMessage ? new Date(a.lastMessage.sentAt).getTime() : 0;
                    const timeB = b.lastMessage ? new Date(b.lastMessage.sentAt).getTime() : 0;
                    return timeB - timeA;
                });
            });
        };

        chatConnection.on('ReceiveGroupMessage', handleReceiveGroupMessage);

        return () => {
            chatConnection.off('ReceiveGroupMessage', handleReceiveGroupMessage);
        };
    }, [chatConnection, connectionState, user.userId]);

    // Sắp xếp groups theo thời gian tin nhắn mới nhất và chỉ lấy 3 cái đầu tiên
    const sortedGroups = useMemo(() => {
        return [...groups]
            .sort((a, b) => {
                const timeA = a.lastMessage ? new Date(a.lastMessage.sentAt).getTime() : 0;
                const timeB = b.lastMessage ? new Date(b.lastMessage.sentAt).getTime() : 0;
                return timeB - timeA;
            })
            .slice(0, 3);
    }, [groups]);

    // Xử lý khi nhấp vào group
    const handleGroupClick = (group) => {
        navigate('/messages', { state: { selectedGroup: group } });
        onClose();
        setGroups((prev) => prev.map(g => g.id === group.id ? { ...g, hasNewMessage: false } : g));
    };

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
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <CircularProgress size={24} />
                </Box>
            ) : error ? (
                <Box sx={{ p: 2 }}>
                    <Typography color="error">{error}</Typography>
                </Box>
            ) : !user.isAuthenticated ? (
                <Box sx={{ p: 2 }}>
                    <Typography>Vui lòng đăng nhập để xem nhóm chat.</Typography>
                </Box>
            ) : sortedGroups.length === 0 ? (
                <Box sx={{ p: 2 }}>
                    <Typography>Không có nhóm chat nào.</Typography>
                </Box>
            ) : (
                sortedGroups.map((group) => (
                    <MenuItem
                        key={group.id}
                        onClick={() => handleGroupClick(group)}
                        sx={{ py: 1.5 }}
                    >
                        <ListItemAvatar>
                            <Avatar alt={group.name} src={group.icon || '/default-group-icon.jpg'} />
                        </ListItemAvatar>
                        <Box sx={{ flex: 1, overflow: 'hidden' }}>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: group.hasNewMessage ? 'bold' : 'normal',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                {group.name || 'Nhóm không tên'}
                            </Typography>
                            {group.lastMessage && (
                                <>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 1,
                                            WebkitBoxOrient: 'vertical',
                                            color: group.hasNewMessage ? 'text.primary' : 'text.secondary',
                                        }}
                                    >
                                        {group.lastMessage.senderName}: {group.lastMessage.content || 'Không có nội dung'}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ display: 'block' }}
                                    >
                                        {group.lastMessage.sentAt
                                            ? new Date(group.lastMessage.sentAt).toLocaleTimeString('vi-VN')
                                            : 'Vừa xong'}
                                    </Typography>
                                </>
                            )}
                            {group.hasNewMessage && (
                                <Badge
                                    variant="dot"
                                    color="error"
                                    sx={{
                                        position: 'absolute',
                                        right: 8,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                    }}
                                />
                            )}
                        </Box>
                    </MenuItem>
                ))
            )}
            <Divider />
            <Box mt={1} py={1} px={2}>
                <Button
                    to="/messages"
                    variant="outlined"
                    color="primary"
                    component={Link}
                    fullWidth
                    endIcon={<IconChevronRight />}
                    disabled={!user.isAuthenticated}
                >
                    Xem tất cả nhóm chat
                </Button>
            </Box>
        </Menu>
    );
};

export default ListMessage;