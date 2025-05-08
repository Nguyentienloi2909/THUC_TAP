import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Avatar, useTheme, Badge } from '@mui/material';
import { IconCircleFilled } from '@tabler/icons-react';

const ChatHeader = ({ selectedUser }) => {
    const theme = useTheme();

    return (
        <Box sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            borderBottom: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.background.paper
        }}>
            <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                color={selectedUser?.status === 'Online' ? 'success' : 'error'}
            >
                <Avatar
                    alt={selectedUser?.name}
                    src={selectedUser?.avatar}
                    sx={{ width: 40, height: 40 }}
                />
            </Badge>
            <Box sx={{ ml: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {selectedUser?.name || 'Select a user'}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        color: theme.palette.text.secondary
                    }}
                >
                    {selectedUser?.status === 'Online' ? (
                        <IconCircleFilled size={10} color={theme.palette.success.main} />
                    ) : (
                        <IconCircleFilled size={10} color={theme.palette.error.main} />
                    )}
                    {selectedUser?.status || 'Offline'}
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
    })
};

export default ChatHeader;
