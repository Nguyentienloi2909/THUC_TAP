import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Avatar, useTheme, Badge } from '@mui/material';
import { IconCircleFilled } from '@tabler/icons-react';

const ChatHeader = ({ selectedUser, selectedGroup }) => {
    const theme = useTheme();

    // Determine the display name and status based on the selection
    const displayName = selectedUser?.fullName || selectedGroup?.name || 'Select a user or group';
    const displayStatus = selectedUser ? selectedUser.status || 'Offline' : selectedGroup ? 'Group' : 'Offline';
    const avatarSrc = selectedUser?.avatar || selectedGroup?.avatar || 'https://www.bootdey.com/img/Content/avatar/avatar1.png'; // Fallback avatar

    return (
        <Box sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            borderBottom: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.background.paper,
            minHeight: 72,
        }}>
            <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                color={displayStatus === 'Online' ? 'success' : 'error'}
                sx={{
                    '& .MuiBadge-dot': {
                        border: `2px solid ${theme.palette.background.paper}`,
                        height: 10,
                        minWidth: 10,
                    }
                }}
            >
                <Avatar
                    alt={displayName}
                    src={avatarSrc}
                    sx={{ width: 40, height: 40 }}
                />
            </Badge>
            <Box sx={{ ml: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                    {displayName}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        color: theme.palette.text.secondary,
                        fontSize: 13,
                    }}
                >
                    {displayStatus === 'Online' ? (
                        <IconCircleFilled size={10} color={theme.palette.success.main} />
                    ) : (
                        <IconCircleFilled size={10} color={theme.palette.error.main} />
                    )}
                    {displayStatus}
                </Typography>
            </Box>
        </Box>
    );
};

ChatHeader.propTypes = {
    selectedUser: PropTypes.shape({
        name: PropTypes.string,
        status: PropTypes.string,
        avatar: PropTypes.string
    }),
    selectedGroup: PropTypes.shape({
        name: PropTypes.string,
        avatar: PropTypes.string
    })
};

export default ChatHeader;