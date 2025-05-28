import React, { useState, useMemo, useEffect } from 'react';
import { Paper, Box, useTheme } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import UserList from './components/UserList';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/messagelist';
import MessageInput from './components/MessageInput';
import ApiService from 'src/service/ApiService';
import { useSignalR } from 'src/contexts/SignalRContext';
import { useMessageBadge } from 'src/contexts/MessageBadgeContext';

const Message = () => {
    const { markUnread, markRead } = useMessageBadge();
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const theme = useTheme();
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [userMessages, setUserMessages] = useState({});
    const [groupMessages, setGroupMessages] = useState({});
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [users, setUsers] = useState([]);
    const { chatConnection, connectionState } = useSignalR();

    // Lấy danh sách users thực tế từ API
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const userProfile = await ApiService.getUserProfile();
                setLoggedInUserId(userProfile.id);
                const allUsers = await ApiService.getAllUsers();
                // Loại bỏ chính mình khỏi danh sách chat
                setUsers(allUsers.filter(u => u.id !== userProfile.id));
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = useMemo(() =>
        users.filter((user) =>
            (user.fullName || user.name || '').toLowerCase().includes(searchQuery.toLowerCase())
        ), [users, searchQuery]
    );

    // Lắng nghe tin nhắn mới qua SignalR
    useEffect(() => {
        if (!chatConnection || connectionState !== 'Connected' || !loggedInUserId) return;

        const handleReceiveMessage = (messageDto) => {
            const userId = messageDto.senderId === loggedInUserId ? messageDto.receiverId : messageDto.senderId;
            // Nếu user này không phải đang được chọn thì markUnread
            if (!selectedUser || selectedUser.id !== userId) {
                markUnread('user', userId);
            }

            // Thêm chấm đỏ cho user có tin mới
            setUsers((prev) =>
                prev.map((u) =>
                    u.id === userId && userId !== selectedUser?.id
                        ? { ...u, hasNewMessage: true }
                        : u
                )
            );

            setUserMessages((prev) => {
                const userMsgList = prev[userId] || [];
                if (!userMsgList.some((msg) => msg.id === messageDto.id)) {
                    return {
                        ...prev,
                        [userId]: [...userMsgList, messageDto],
                    };
                }
                return prev;
            });
        };

        const handleReceiveGroupMessage = (messageDto) => {
            const groupId = messageDto.groupChatId;
            if (!selectedGroup || selectedGroup.id !== groupId) {
                markUnread('group', groupId);
            }

            // Thêm chấm đỏ cho group có tin mới
            setGroups((prev) =>
                prev.map((g) =>
                    g.id === groupId && groupId !== selectedGroup?.id
                        ? { ...g, hasNewMessage: true }
                        : g
                )
            );

            setGroupMessages((prev) => {
                const groupMsgList = prev[groupId] || [];
                if (!groupMsgList.some((msg) => msg.id === messageDto.id)) {
                    return {
                        ...prev,
                        [groupId]: [...groupMsgList, messageDto],
                    };
                }
                return prev;
            });
        };

        chatConnection.on('ReceiveMessage', handleReceiveMessage);
        chatConnection.on('ReceiveGroupMessage', handleReceiveGroupMessage);

        return () => {
            chatConnection.off('ReceiveMessage', handleReceiveMessage);
            chatConnection.off('ReceiveGroupMessage', handleReceiveGroupMessage);
        };
    }, [chatConnection, connectionState, loggedInUserId, selectedUser, selectedGroup, markUnread]);

    // Chỉ fetch messages khi chưa có
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                if (selectedUser?.id && !userMessages[selectedUser.id]) {
                    const data = await ApiService.handleRequest('get', `/Message/private/${selectedUser.id}`);
                    setUserMessages((prev) => ({
                        ...prev,
                        [selectedUser.id]: data || [],
                    }));
                } else if (selectedGroup?.id && !groupMessages[selectedGroup.id]) {
                    const data = await ApiService.handleRequest('get', `/Message/chatGroups/${selectedGroup.id}`);
                    setGroupMessages((prev) => ({
                        ...prev,
                        [selectedGroup.id]: data || [],
                    }));
                }
            } catch (error) {
                console.error('Failed to fetch messages:', error);
            }
        };
        fetchMessages();
    }, [selectedUser, selectedGroup, userMessages, groupMessages]);

    // Gửi tin nhắn
    const handleSendMessage = async (content) => {
        if (!loggedInUserId || connectionState !== 'Connected') {
            console.error('Cannot send message: Not connected or user not logged in');
            return;
        }
        try {
            if (selectedUser?.id) {
                await chatConnection.invoke('SendPrivateMessage', loggedInUserId, selectedUser.id, content);
            } else if (selectedGroup?.id) {
                await chatConnection.invoke('SendGroupMessage', loggedInUserId, selectedGroup.id, content);
            }
        } catch (error) {
            console.error('Gửi tin nhắn thất bại:', error);
        }
    };

    // Chỉ render messages của user/group đang chọn
    const displayedMessages = useMemo(() => {
        if (selectedUser?.id) return userMessages[selectedUser.id] || [];
        if (selectedGroup?.id) return groupMessages[selectedGroup.id] || [];
        return [];
    }, [selectedUser, selectedGroup, userMessages, groupMessages]);

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setSelectedGroup(null);
        markRead('user', user.id);
    };

    const handleSelectGroup = (group) => {
        setSelectedGroup(group);
        setSelectedUser(null);
        markRead('group', group.id);
    };


    return (
        <PageContainer title="Tin nhắn" description="Trò chuyện">
            <Paper
                sx={{
                    height: 'calc(100vh - 100px)',
                    display: 'flex',
                    bgcolor: theme.palette.background.default,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: theme.shadows[3],
                }}
            >
                <Box
                    sx={{
                        width: 320,
                        borderRight: `1px solid ${theme.palette.divider}`,
                        bgcolor: theme.palette.background.paper,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Box
                        sx={{
                            flex: 1,
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            '&::-webkit-scrollbar': {
                                width: '6px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: theme.palette.divider,
                                borderRadius: '6px',
                            },
                        }}
                    >
                        <UserList
                            users={filteredUsers}
                            selectedUser={selectedUser}
                            selectedGroup={selectedGroup}
                            onSelectUser={handleSelectUser}
                            onSelectGroup={handleSelectGroup}
                        />
                    </Box>
                </Box>

                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        bgcolor: theme.palette.background.default,
                    }}
                >
                    <Box
                        sx={{
                            borderBottom: `1px solid ${theme.palette.divider}`,
                            bgcolor: theme.palette.background.paper,
                            height: '72px',
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                        }}
                    >
                        <ChatHeader selectedUser={selectedUser} selectedGroup={selectedGroup} />
                    </Box>
                    <Box
                        sx={{
                            flex: 1,
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            '&::-webkit-scrollbar': {
                                width: '6px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: theme.palette.divider,
                                borderRadius: '6px',
                            },
                        }}
                    >
                        <MessageList
                            messages={displayedMessages}
                            selectedUser={selectedUser}
                            selectedGroup={selectedGroup}
                        />
                    </Box>
                    <Box
                        sx={{
                            borderTop: `1px solid ${theme.palette.divider}`,
                            bgcolor: theme.palette.background.paper,
                            display: 'flex',
                            width: '100%',
                            padding: 0,
                            minHeight: '72px',
                        }}
                    >
                        <MessageInput
                            onSendMessage={handleSendMessage}
                            disabled={!selectedUser && !selectedGroup}
                            sx={{ width: '100%' }}
                        />
                    </Box>
                </Box>
            </Paper>
        </PageContainer>
    );
};

export default Message;