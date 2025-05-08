import React, { useState } from 'react';
import { Box, AppBar, Toolbar, styled, Stack, IconButton, Badge, InputBase } from '@mui/material';
import PropTypes from 'prop-types';
import { IconBellRinging, IconMenu, IconSearch, IconMessage } from '@tabler/icons-react';
import ListMessage from './ListMessage';
import Profile from './Profile';
import { useNavigate } from 'react-router-dom';
import { useSearch } from 'src/contexts/SearchContext';
// Add import
import ListNotification from './ListNotification';

const SearchWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.default,
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  border: '1px solid rgba(0, 0, 0, 0.12)',
  '&:hover': {
    border: '1px solid rgba(0, 0, 0, 0.24)',
  },
  '&:focus-within': {
    border: `1px solid ${theme.palette.primary.main}`,
  },
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

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

const Header = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationEl, setNotificationEl] = useState(null);
  const navigate = useNavigate();

  const handleMessageClick = (event) => {
    setAnchorEl(event.currentTarget);
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

  const { search, setSearch } = useSearch();

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={props.toggleMobileSidebar}
          sx={{
            display: {
              lg: "none",
              xs: "inline",
            },
          }}
        >
          <IconMenu width="20" height="20" />
        </IconButton>

        <Box flexGrow={1} />

        <>
          <SearchWrapper>
            <SearchIconWrapper>
              <IconSearch size="20" stroke="1.5" />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Tìm kiếm..."
              inputProps={{ 'aria-label': 'search' }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </SearchWrapper>

          <Box sx={{ position: 'relative' }}>
            <IconButton
              size="large"
              aria-label="show messages"
              color="inherit"
              sx={{
                mr: 1,
                ...(Boolean(anchorEl) && {
                  color: 'primary.main',
                }),
              }}
              onClick={handleMessageClick}
            >
              <Badge badgeContent={4} color="error">
                <IconMessage size="30" stroke="1.5" />
              </Badge>
            </IconButton>

            <ListMessage
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMessageClose}
            />
          </Box>

          <IconButton
            size="large"
            aria-label="show notifications"
            color="inherit"
            onClick={handleNotificationClick}
            sx={{
              ...(Boolean(notificationEl) && {
                color: 'primary.main',
              }),
            }}
          >
            <Badge variant="dot" color="primary">
              <IconBellRinging size="30" stroke="1.5" />
            </Badge>
          </IconButton>

          <ListNotification
            anchorEl={notificationEl}
            open={Boolean(notificationEl)}
            onClose={handleNotificationClose}
          />
        </>

        <Stack spacing={1} direction="row" alignItems="center">
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
  toggleMobileSidebar: PropTypes.func,
};

export default Header;
