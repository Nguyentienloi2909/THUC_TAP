import React, { useState, useMemo } from 'react';
import { Paper, Box, useTheme } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import SearchBox from './components/SearchBox';
import UserList from './components/UserList';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';

const Message = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const theme = useTheme();

    // Example user data
    const users = useMemo(() => [
        {
            id: 1,
            name: 'John Doe',
            avatar: 'https://www.bootdey.com/img/Content/avatar/avatar1.png',
            status: 'Online',
            lastMessage: 'See you tomorrow!',
            unreadCount: 2
        },
        {
            id: 2,
            name: 'Jane Smith',
            avatar: 'https://www.bootdey.com/img/Content/avatar/avatar2.png',
            status: 'Offline',
            lastMessage: 'Sounds good to me',
            unreadCount: 0
        }
    ], []);

    const filteredUsers = useMemo(() => {
        return users.filter(user =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [users, searchQuery]);

    return (
        <PageContainer title="Tin nhắn" description="Trò chuyện">
            <Paper sx={{
                height: 'calc(100vh - 100px)',
                display: 'flex',
                bgcolor: theme.palette.background.default,
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: theme.shadows[3]
            }}>
                {/* Left side - User list */}
                <Box sx={{
                    width: 320,
                    borderRight: `1px solid ${theme.palette.divider}`,
                    bgcolor: theme.palette.background.paper,
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Box sx={{
                        p: 2,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        height: '72px', // Consistent height with chat header
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <SearchBox onSearch={setSearchQuery} />
                    </Box>
                    <Box sx={{
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
                        }
                    }}>
                        <UserList
                            users={filteredUsers}
                            selectedUser={selectedUser}
                            onSelectUser={setSelectedUser}
                        />
                    </Box>
                </Box>

                {/* Right side - Chat area */}
                <Box sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: theme.palette.background.default
                }}>
                    <Box sx={{
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        bgcolor: theme.palette.background.paper,
                        height: '72px', // Consistent height
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <ChatHeader selectedUser={selectedUser} />
                    </Box>
                    <Box sx={{
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
                        }
                    }}>
                        <MessageList selectedUser={selectedUser} />
                    </Box>
                    <Box sx={{
                        borderTop: `1px solid ${theme.palette.divider}`,
                        bgcolor: theme.palette.background.paper,
                        display: 'flex',
                        width: '100%',
                        padding: 0,
                        minHeight: '72px'
                    }}>
                        <MessageInput
                            onSendMessage={(message) => {
                                console.log('Message sent:', message);
                                // Here you would implement your actual message sending logic
                            }}
                            disabled={!selectedUser}
                            sx={{ width: '100%' }}
                        />
                    </Box>
                </Box>
            </Paper>
        </PageContainer>
    );
};

export default Message;