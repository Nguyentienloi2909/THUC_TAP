import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ApiService from '../../../service/ApiService';
import {
  Avatar,
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { IconListCheck, IconUser, IconKey } from '@tabler/icons-react';
import ProfileImg from 'src/assets/images/profile/user-1.jpg';

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const userData = await ApiService.getUserProfile();
        setUser(userData);
      } catch (error) {
        setError(error.response?.data?.message || error.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleClick2 = (event) => setAnchorEl2(event.currentTarget);
  const handleClose2 = () => setAnchorEl2(null);

  const handelClickLogout = async () => {
    try {
      await ApiService.logout();
      navigate('/auth/login');
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const getAvatarSrc = () => {
    if (user.avatar && typeof user.avatar === 'string') {
      const trimmed = user.avatar.trim();
      return trimmed.startsWith('http')
        ? trimmed
        : `/uploads/avatars/${trimmed}`;
    }
    return ProfileImg;
  };

  return (
    <Box>
      <IconButton
        size="large"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        onClick={handleClick2}
        sx={{
          ...(Boolean(anchorEl2) && {
            color: 'primary.main',
          }),
        }}
      >
        <Avatar src={getAvatarSrc()} sx={{ width: 35, height: 35 }} />
      </IconButton>

      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{ '& .MuiMenu-paper': { width: '200px' } }}
      >
        <MenuItem component={Link} to="/profile">
          <ListItemIcon><IconUser width={20} /></ListItemIcon>
          <ListItemText>Thông tin tài khoản</ListItemText>
        </MenuItem>
        <MenuItem component={Link} to="/auth/changepassword">
          <ListItemIcon><IconKey width={20} /></ListItemIcon>
          <ListItemText>Đổi mật khẩu</ListItemText>
        </MenuItem>
        <MenuItem component={Link} to="/manage/task">
          <ListItemIcon><IconListCheck width={20} /></ListItemIcon>
          <ListItemText>Nhiệm vụ</ListItemText>
        </MenuItem>
        <Box mt={1} py={1} px={2}>
          <Button
            onClick={handelClickLogout}
            variant="outlined"
            color="primary"
            fullWidth
          >
            Đăng xuất
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
