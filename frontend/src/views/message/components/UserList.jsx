import React, { useState, useEffect } from 'react';
import {
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Typography,
    useTheme,
    Badge,
    Box,
    Tabs,
    Tab,
    Paper
} from '@mui/material';
import { IconUser, IconUsers } from '@tabler/icons-react';
import ApiService from 'src/service/ApiService';

const UserList = ({
    users = [],
    selectedUser,
    selectedGroup,
    onSelectUser,
    onSelectGroup = () => { }
}) => {
    const theme = useTheme();
    const [tabValue, setTabValue] = useState(0);
    const [groups, setGroups] = useState([]);
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const userProfile = await ApiService.getUserProfile();
                console.log('User Profile:', userProfile); // Log the user profile
                const loggedInUserId = userProfile.id;
                const allUsers = await ApiService.getAllUsers();
                console.log('All Users:', allUsers); // Log all users
                const filteredUsers = allUsers.filter(user => user.id !== loggedInUserId);
                console.log('Filtered Users:', filteredUsers); // Log filtered users
                setUserList(filteredUsers);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        };

        const fetchGroups = async () => {
            try {
                const data = await ApiService.getChatGroups();
                console.log('Fetched groups:', data); // Log fetched groups
                setGroups(data || []);
            } catch (error) {
                console.error('Failed to fetch user groups:', error);
            }
        };

        fetchUsers();
        fetchGroups();
    }, []);

    return (
        <Paper elevation={2} sx={{ width: '100%', bgcolor: theme.palette.background.paper }}>
            <Tabs
                value={tabValue}
                onChange={(_, newValue) => {
                    console.log('Tab changed to:', newValue);
                    setTabValue(newValue);
                }}
                centered
                sx={{ mb: 2 }}
            >
                <Tab label="Private" icon={<IconUser size={18} />} iconPosition="start" />
                <Tab label="Groups" icon={<IconUsers size={18} />} iconPosition="start" />
            </Tabs>
            {tabValue === 0 && (
                <List sx={{ p: 0 }}>
                    {userList.map((user) => (
                        <ListItem
                            key={user.id}
                            button
                            selected={selectedUser?.id === user.id}
                            onClick={() => {
                                console.log('User selected:', user);
                                onSelectUser(user);
                            }}
                            sx={{
                                '&:hover': { bgcolor: theme.palette.action.hover },
                                '&.Mui-selected': { bgcolor: theme.palette.action.selected }
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
            )}
            {tabValue === 1 && (
                <List sx={{ p: 0 }}>
                    {groups.map((group) => (
                        <ListItem
                            key={group.id}
                            button
                            selected={selectedGroup?.id === group.id}
                            onClick={() => {
                                console.log('Group selected:', group);
                                onSelectGroup(group);
                            }}
                            sx={{
                                '&:hover': { bgcolor: theme.palette.action.hover },
                                '&.Mui-selected': { bgcolor: theme.palette.action.selected }
                            }}
                        >
                            <ListItemAvatar>
                                <Avatar alt={group.name} src={group.icon} />
                            </ListItemAvatar>
                            <ListItemText
                                primaryTypographyProps={{
                                    component: 'div',
                                    variant: 'subtitle1',
                                    sx: { fontWeight: 600 }
                                }}
                                primary={group.name}
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
                                            {group.lastMessage}
                                        </Box>
                                        {group.unreadCount > 0 && (
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
                                                {group.unreadCount}
                                            </Box>
                                        )}
                                        <Box
                                            component="span"
                                            sx={{ color: theme.palette.text.secondary, ml: 1, fontSize: 12 }}
                                        >
                                            ({group.memberCount} members)
                                        </Box>
                                    </Box>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </Paper>
    );
};

export default UserList;