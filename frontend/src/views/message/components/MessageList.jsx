import React from 'react';
import { Box, Typography, Avatar, Paper, useTheme } from '@mui/material';
import { IconCheck } from '@tabler/icons-react';

const MessageList = ({ selectedUser }) => {
    const theme = useTheme();

    return (
        <Box sx={{
            flex: 1,
            overflow: 'auto',
            p: 2,
            bgcolor: theme.palette.background.default,
            display: 'flex',
            flexDirection: 'column',
            gap: 2
        }}>
            {selectedUser && [1, 2, 3].map((msg, index) => (
                <Box
                    key={msg}
                    sx={{
                        display: 'flex',
                        justifyContent: index % 2 === 0 ? 'flex-start' : 'flex-end',
                        mb: 2,
                        alignItems: 'flex-end'
                    }}
                >
                    {index % 2 === 0 && (
                        <Avatar
                            src={`https://www.bootdey.com/img/Content/avatar/avatar${selectedUser}.png`}
                            sx={{
                                mr: 1,
                                width: 32,
                                height: 32
                            }}
                        />
                    )}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            maxWidth: '70%',
                            bgcolor: index % 2 === 0 ? '#e0e8f5' : '#1976d2', // Darker left bubble color
                            color: index % 2 === 0 ? theme.palette.text.primary : '#ffffff',
                            borderRadius: index % 2 === 0 ? '12px 12px 12px 4px' : '12px 12px 4px 12px',
                            boxShadow: index % 2 === 0 ? '0 1px 2px rgba(0,0,0,0.1)' : '0 1px 2px rgba(0,0,0,0.2)',
                            position: 'relative',
                            '&:after': {
                                content: '""',
                                position: 'absolute',
                                bottom: 0,
                                left: index % 2 === 0 ? '-8px' : 'auto',
                                right: index % 2 === 0 ? 'auto' : '-8px',
                                width: 0,
                                height: 0,
                                borderStyle: 'solid',
                                borderWidth: '0 8px 8px 0',
                                borderColor: index % 2 === 0 ? `transparent #e0e8f5 transparent transparent` : `transparent transparent transparent #1976d2`
                            }
                        }}
                    >
                        <Typography variant="body1">This is a message content</Typography>
                        <Typography variant="caption" sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            color: index % 2 === 0 ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.8)'
                        }}>
                            12:30 <IconCheck size={14} />
                        </Typography>
                    </Paper>
                    {index % 2 !== 0 && (
                        <Avatar sx={{
                            ml: 1,
                            width: 32,
                            height: 32
                        }} />
                    )}
                </Box>
            ))}
        </Box>
    );
};

export default MessageList;