import React, { useState } from 'react';
import { Box, TextField, IconButton, useTheme } from '@mui/material';
import { IconSend, IconPaperclip } from '@tabler/icons-react';

const MessageInput = () => {
    const [message, setMessage] = useState('');
    const theme = useTheme();

    const handleSend = () => {
        if (message.trim()) {
            // Handle send message logic
            console.log('Sending message:', message);
            setMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <Box sx={{
            display: 'flex',
            gap: 1,
            p: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.background.paper
        }}>
            {/* <IconButton color="primary">
                <IconPaperclip />
            </IconButton> */}
            <TextField
                fullWidth
                placeholder="Type a message..."
                variant="outlined"
                size="small"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                multiline
                maxRows={4}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '20px',
                        bgcolor: theme.palette.background.default
                    }
                }}
            />
            <IconButton
                color="primary"
                onClick={handleSend}
                disabled={!message.trim()}
                sx={{
                    '&:disabled': {
                        color: theme.palette.text.disabled
                    }
                }}
            >
                <IconSend />
            </IconButton>
        </Box>
    );
};

export default MessageInput;
