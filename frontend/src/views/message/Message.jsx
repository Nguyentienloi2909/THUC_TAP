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
                    <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                        <SearchBox onSearch={setSearchQuery} />
                    </Box>
                    <Box sx={{ flex: 1, overflowY: 'auto' }}>
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
                        bgcolor: theme.palette.background.paper
                    }}>
                        <ChatHeader selectedUser={selectedUser} />
                    </Box>
                    <Box sx={{ 
                        flex: 1,
                        overflowY: 'auto',
                        p: 2
                    }}>
                        <MessageList selectedUser={selectedUser} />
                    </Box>
                    <Box sx={{ 
                        borderTop: `1px solid ${theme.palette.divider}`,
                        bgcolor: theme.palette.background.paper,
                        p: 2
                    }}>
                        <MessageInput />
                    </Box>
                </Box>
            </Paper>
        </PageContainer>
    );
};

export default Message;