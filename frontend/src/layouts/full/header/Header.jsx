// src/layouts/header/Header.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Box, AppBar, Toolbar, styled, Stack, IconButton, Badge } from '@mui/material';
import PropTypes from 'prop-types';
import { IconBellRinging, IconMenu, IconMessage } from '@tabler/icons-react';
import ListMessage from './ListMessage';
import Profile from './Profile';
import ListNotification from './ListNotification';
import { NotificationContext } from '../../../contexts/NotificationContext';
import { useSignalR } from 'src/contexts/SignalRContext';
import { useUser } from 'src/contexts/UserContext';

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  background: theme.palette.background.paper,
  justifyContent: 'center',
  backdropFilter: 'blur(4px)',
  [theme.breakpoints.up('lg')]: {
    minHeight: '70px',
  },
}));

const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
  width: '100%',
  color: theme.palette.text.secondary,
}));

const StyledIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})(({ theme, isActive }) => ({
  marginRight: theme.spacing(1),
  ...(isActive && {
    color: theme.palette.primary.main,
  }),
}));

const HeaderStack = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(0.5),
  },
}));

const Header = ({ toggleMobileSidebar }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationEl, setNotificationEl] = useState(null);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const { notifications } = useContext(NotificationContext);
  const { chatConnection, connectionState } = useSignalR();
  const { user } = useUser();

  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  // Cập nhật trạng thái hasNewMessage khi nhận tin nhắn mới từ SignalR
  useEffect(() => {
    if (!chatConnection || connectionState !== 'Connected') return;

    const handleReceiveGroupMessage = (messageDto) => {
      setHasNewMessage(true);
    };

    const handleReceiveMessage = (messageDto) => {
      setHasNewMessage(true);
    };

    chatConnection.on('ReceiveGroupMessage', handleReceiveGroupMessage);
    chatConnection.on('ReceiveMessage', handleReceiveMessage);

    return () => {
      chatConnection.off('ReceiveGroupMessage', handleReceiveGroupMessage);
      chatConnection.off('ReceiveMessage', handleReceiveMessage);
    };
  }, [chatConnection, connectionState]);

  const handleMessageClick = (event) => {
    setAnchorEl(event.currentTarget);
    setHasNewMessage(false);
  };

  const handleMessageClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (event) => {
    setNotificationEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationEl(null);
  };

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={toggleMobileSidebar}
          sx={{ display: { lg: 'none', xs: 'inline' } }}
        >
          <IconMenu width="20" height="20" />
        </IconButton>

        <Box flexGrow={1} />

        <Box sx={{ position: 'relative' }}>
          <StyledIconButton
            size="large"
            aria-label="show messages"
            aria-controls={Boolean(anchorEl) ? 'message-menu' : undefined}
            aria-haspopup="true"
            color="inherit"
            isActive={Boolean(anchorEl)}
            onClick={handleMessageClick}
          >
            <Badge
              variant="dot"
              color="error"
              invisible={!hasNewMessage}
            >
              <IconMessage size="30" stroke="1.5" />
            </Badge>
          </StyledIconButton>

          <ListMessage
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMessageClose}
            user={user}
          />
        </Box>

        <StyledIconButton
          size="large"
          aria-label="show notifications"
          aria-controls={Boolean(notificationEl) ? 'notification-menu' : undefined}
          aria-haspopup="true"
          color="inherit"
          isActive={Boolean(notificationEl)}
          onClick={handleNotificationClick}
        >
          <Badge badgeContent={unreadNotificationCount} color="error">
            <IconBellRinging size="30" stroke="1.5" />
          </Badge>
        </StyledIconButton>

        <ListNotification
          anchorEl={notificationEl}
          open={Boolean(notificationEl)}
          onClose={handleNotificationClose}
          user={user}
        />

        <HeaderStack>
          <Profile user={user} />
        </HeaderStack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
  toggleMobileSidebar: PropTypes.func,
};

export default Header;