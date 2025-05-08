import React from 'react';
import { 
    List, 
    ListItem, 
    ListItemAvatar, 
    Avatar, 
    ListItemText, 
    Typography,
    useTheme,
    Badge,
    Box // Add this import
} from '@mui/material';
import { IconCircleFilled } from '@tabler/icons-react';

const UserList = ({ selectedUser, onSelectUser }) => {
    const theme = useTheme();
    
    // Example user data
    const users = [
        {
            id: 1,
            name: 'John Doe',
            avatar: 'https://www.bootdey.com/img/Content/avatar/avatar1.png',
            lastMessage: 'See you tomorrow!',
            status: 'Online',
            unreadCount: 2
        },
        {
            id: 2,
            name: 'Jane Smith',
            avatar: 'https://www.bootdey.com/img/Content/avatar/avatar2.png',
            lastMessage: 'Sounds good to me',
            status: 'Offline',
            unreadCount: 0
        }
    ];

    return (
        <List sx={{ p: 0 }}>
            {users.map((user) => (
                <ListItem 
                    key={user.id}
                    button 
                    selected={selectedUser?.id === user.id}
                    onClick={() => onSelectUser(user)}
                    sx={{
                        '&:hover': {
                            bgcolor: theme.palette.action.hover
                        },
                        '&.Mui-selected': {
                            bgcolor: theme.palette.action.selected
                        }
                    }}
                >
                    <ListItemAvatar>
                        <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            variant="dot"
                            color={user.status === 'Online' ? 'success' : 'error'}
                        >
                            <Avatar alt={user.name} src={user.avatar} />
                        </Badge>
                    </ListItemAvatar>
                    <ListItemText
                        primaryTypographyProps={{ 
                            component: 'div',
                            variant: 'subtitle1',
                            sx: { fontWeight: 600 }
                        }}
                        primary={user.name}
                        secondaryTypographyProps={{ component: 'div' }}
                        secondary={
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 0.5
                            }}>
                                <Box
                                    component="span"
                                    sx={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        color: theme.palette.text.secondary
                                    }}
                                >
                                    {user.lastMessage}
                                </Box>
                                {user.unreadCount > 0 && (
                                    <Box sx={{
                                        bgcolor: theme.palette.primary.main,
                                        color: theme.palette.primary.contrastText,
                                        borderRadius: '50%',
                                        width: 20,
                                        height: 20,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.75rem'
                                    }}>
                                        {user.unreadCount}
                                    </Box>
                                )}
                            </Box>
                        }
                    />
                </ListItem>
            ))}
        </List>
    );
};

export default UserList;