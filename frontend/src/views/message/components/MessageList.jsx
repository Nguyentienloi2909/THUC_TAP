import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Avatar, Paper, useTheme } from '@mui/material';
import ApiService from '../../../service/apiservice';

const MessageList = ({ messages = [], selectedUser, selectedGroup }) => {
    const theme = useTheme();
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [hoveredMessageId, setHoveredMessageId] = useState(null);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const userProfile = await ApiService.getUserProfile();
                setLoggedInUserId(userProfile.id);
            } catch (error) {
                console.error('Failed to retrieve user profile:', error);
            }
        };

        fetchUserId();
    }, []);

    const isGroupChat = !!selectedGroup;

    const groupedMessages = useMemo(() => {
        const grouped = [];
        let currentGroup = [];
        let lastSenderId = null;
        let lastDate = null;

        if (Array.isArray(messages)) {
            messages.forEach((msg, index) => {
                const msgDate = new Date(msg.sentAt).toLocaleDateString();
                const isSameSender = msg.senderId === lastSenderId;
                const isSameDate = lastDate === msgDate;

                if (!isSameDate && lastDate) {
                    grouped.push({ type: 'date', date: msgDate });
                }

                if (isSameSender) {
                    currentGroup.push(msg);
                } else {
                    if (currentGroup.length > 0) {
                        grouped.push({ type: 'messageGroup', messages: currentGroup });
                    }
                    currentGroup = [msg];
                }

                lastSenderId = msg.senderId;
                lastDate = msgDate;

                if (index === messages.length - 1 && currentGroup.length > 0) {
                    grouped.push({ type: 'messageGroup', messages: currentGroup });
                }
            });
        }

        return grouped;
    }, [messages]);

    return (
        <Box
            sx={{
                flex: 1,
                overflowY: 'auto',
                p: 2,
                bgcolor: theme.palette.background.default,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
            }}
            role="log"
            aria-label="Chat messages"
        >
            {groupedMessages.map((group, groupIndex) => {
                if (group.type === 'date') {
                    return (
                        <Box
                            key={`date-${group.date}`}
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                my: 2,
                            }}
                        >
                            <Box sx={{ flexGrow: 1, height: '1px', bgcolor: theme.palette.divider }} />
                            <Typography variant="caption" sx={{ mx: 2, color: theme.palette.text.secondary }}>
                                {group.date}
                            </Typography>
                            <Box sx={{ flexGrow: 1, height: '1px', bgcolor: theme.palette.divider }} />
                        </Box>
                    );
                }

                const groupMessages = group.messages || [];
                if (groupMessages.length === 0) return null;

                const isSentByUser = groupMessages[0]?.senderId === loggedInUserId;
                const isLastGroup = groupIndex === groupedMessages.length - 1;

                return (
                    <Box
                        key={`group-${groupMessages[0]?.id || groupIndex}`}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: isSentByUser ? 'flex-end' : 'flex-start',
                            mb: 1,
                        }}
                    >
                        {isGroupChat && !isSentByUser && (
                            <Typography
                                variant="caption"
                                sx={{ color: theme.palette.text.secondary, mb: 0.5, ml: 6 }}
                            >
                                {groupMessages[0]?.senderName || 'Unknown'}
                            </Typography>
                        )}

                        {groupMessages.map((msg, msgIndex) => {
                            const isFirstMessage = msgIndex === 0;
                            const isLastMessage = msgIndex === groupMessages.length - 1;
                            const isHovered = hoveredMessageId === msg.id;
                            const isUser = msg.senderId === loggedInUserId;

                            const borderRadius = isUser
                                ? isFirstMessage && isLastMessage
                                    ? '18px'
                                    : isFirstMessage
                                        ? '18px 18px 4px 18px'
                                        : isLastMessage
                                            ? '4px 18px 18px 18px'
                                            : '4px 18px 4px 18px'
                                : isFirstMessage && isLastMessage
                                    ? '18px'
                                    : isFirstMessage
                                        ? '18px 18px 18px 4px'
                                        : isLastMessage
                                            ? '18px 4px 18px 18px'
                                            : '18px 4px 18px 4px';

                            return (
                                <Box
                                    key={msg.id}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: isUser ? 'flex-end' : 'flex-start',
                                        mb: isLastMessage ? 0 : 0.5,
                                        position: 'relative',
                                    }}
                                    onMouseEnter={() => setHoveredMessageId(msg.id)}
                                    onMouseLeave={() => setHoveredMessageId(null)}
                                >
                                    {!isUser && isFirstMessage && (
                                        <Avatar
                                            src={`https://www.bootdey.com/img/Content/avatar/avatar${msg.senderId}.png`}
                                            alt={msg.senderName || 'Unknown'}
                                            sx={{ width: 32, height: 32, mr: 1, alignSelf: 'flex-end' }}
                                        />
                                    )}

                                    <Box
                                        sx={{
                                            maxWidth: '70%',
                                            ml: !isUser && !isFirstMessage ? '40px' : 0,
                                        }}
                                    >
                                        <Paper
                                            sx={{
                                                p: 1.5,
                                                bgcolor: isUser ? '#0084FF' : '#E9ECEF',
                                                color: isUser ? '#fff' : theme.palette.text.primary,
                                                borderRadius,
                                                boxShadow: isHovered ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                                                transition: 'box-shadow 0.2s ease-in-out',
                                            }}
                                        >
                                            <Typography variant="body1">
                                                {msg.content || 'No content'}
                                            </Typography>
                                        </Paper>
                                    </Box>

                                    {isHovered && (
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                position: 'absolute',
                                                bottom: '-16px',
                                                right: isUser ? 0 : 'auto',
                                                left: isUser ? 'auto' : 0,
                                                color: theme.palette.text.secondary,
                                            }}
                                        >
                                            {new Date(msg.sentAt).toLocaleTimeString()}
                                        </Typography>
                                    )}
                                </Box>
                            );
                        })}

                        {isLastGroup &&
                            groupMessages[groupMessages.length - 1]?.senderId === loggedInUserId && (
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
                                    <Avatar
                                        src={`https://www.bootdey.com/img/Content/avatar/avatar${selectedUser?.id || selectedGroup?.members?.[0]?.id || loggedInUserId
                                            }.png`}
                                        alt="Seen"
                                        sx={{ width: 16, height: 16 }}
                                    />
                                </Box>
                            )}
                    </Box>
                );
            })}
        </Box>
    );
};

export default MessageList;