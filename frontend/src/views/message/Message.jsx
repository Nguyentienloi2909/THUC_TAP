import React, { useState, useMemo, useEffect } from 'react';
import { Paper, Box, useTheme } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import SearchBox from './components/SearchBox';
import UserList from './components/UserList';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/messagelist';
import MessageInput from './components/MessageInput';
import ApiService from 'src/service/ApiService';
import { useSignalR } from 'src/contexts/SignalRContext';

const Message = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const theme = useTheme();
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [userMessages, setUserMessages] = useState({});
    const [groupMessages, setGroupMessages] = useState({});
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const { chatConnection, connectionState } = useSignalR();

    const users = useMemo(() => [
        {
            id: 1,
            name: 'John Doe',
            avatar: 'https://www.bootdey.com/img/Content/avatar/avatar1.png',
            status: 'Online',
            lastMessage: 'See you tomorrow!',
            unreadCount: 2,
        },
        {
            id: 2,
            name: 'Jane Smith',
            avatar: 'https://www.bootdey.com/img/Content/avatar/avatar2.png',
            status: 'Offline',
            lastMessage: 'Sounds good to me',
            unreadCount: 0,
        },
    ], []);

    const filteredUsers = useMemo(() => {
        return users.filter((user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [users, searchQuery]);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                console.log('Fetching user profile...');
                const userProfile = await ApiService.getUserProfile();
                console.log('User profile retrieved:', userProfile);
                setLoggedInUserId(userProfile.id);
            } catch (error) {
                console.error('Failed to retrieve user profile:', error);
            }
        };
        fetchUserId();
    }, []);

    useEffect(() => {
        if (!chatConnection || connectionState !== 'Connected') return;

        const handleReceiveMessage = (messageDto) => {
            console.log('Received private message:', messageDto);
            if (!messageDto || typeof messageDto !== 'object') return;

            const userId = messageDto.senderId === loggedInUserId ? messageDto.receiverId : messageDto.senderId;
            setUserMessages((prev) => {
                const userMsgList = prev[userId] || [];
                if (!userMsgList.some((msg) => msg.id === messageDto.id)) {
                    const updatedMessages = {
                        ...prev,
                        [userId]: [...userMsgList, messageDto],
                    };
                    console.log('Updated userMessages:', updatedMessages);
                    return updatedMessages;
                }
                return prev;
            });
        };

        const handleReceiveGroupMessage = (messageDto) => {
            console.log('Received group message:', messageDto);
            if (!messageDto || typeof messageDto !== 'object') return;

            const groupId = messageDto.groupChatId;
            setGroupMessages((prev) => {
                const groupMsgList = prev[groupId] || [];
                if (!groupMsgList.some((msg) => msg.id === messageDto.id)) {
                    const updatedMessages = {
                        ...prev,
                        [groupId]: [...groupMsgList, messageDto],
                    };
                    console.log('Updated groupMessages:', updatedMessages);
                    return updatedMessages;
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
    }, [chatConnection, connectionState, loggedInUserId]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                if (selectedUser?.id && !userMessages[selectedUser.id]) {
                    console.log('Fetching messages for user:', selectedUser.id);
                    const data = await ApiService.handleRequest('get', `/Message/private/${selectedUser.id}`);
                    console.log('Fetched user messages:', data);
                    setUserMessages((prev) => ({
                        ...prev,
                        [selectedUser.id]: data || [],
                    }));
                } else if (selectedGroup?.id && !groupMessages[selectedGroup.id]) {
                    console.log('Fetching messages for group:', selectedGroup.id);
                    const data = await ApiService.handleRequest('get', `/Message/chatGroups/${selectedGroup.id}`);
                    console.log('Fetched group messages:', data);
                    setGroupMessages((prev) => ({
                        ...prev,
                        [selectedGroup.id]: data || [],
                    }));
                }
            } catch (error) {
                console.error('Failed to fetch messages:', error.response ? error.response.data : error.message);
            }
        };
        fetchMessages();
    }, [selectedUser, selectedGroup, userMessages, groupMessages]);

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
            console.log('Tin nhắn gửi thành công');
        } catch (error) {
            console.error('Gửi tin nhắn thất bại:', error);
        }
    };

    const displayedMessages = useMemo(() => {
        // Sửa lỗi: Thêm kiểm tra selectedUser và selectedGroup trước khi truy cập id
        const messages = selectedUser && selectedUser.id
            ? userMessages[selectedUser.id] || []
            : selectedGroup && selectedGroup.id
                ? groupMessages[selectedGroup.id] || []
                : [];
        console.log('Displayed messages:', messages);
        return messages;
    }, [selectedUser, selectedGroup, userMessages, groupMessages]);

    const handleSelectUser = (user) => {
        console.log('User selected:', user);
        setSelectedUser(user);
        setSelectedGroup(null);
    };

    const handleSelectGroup = (group) => {
        console.log('Group selected:', group);
        setSelectedGroup(group);
        setSelectedUser(null);
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
                            p: 2,
                            borderBottom: `1px solid ${theme.palette.divider}`,
                            height: '72px',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <SearchBox onSearch={setSearchQuery} />
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