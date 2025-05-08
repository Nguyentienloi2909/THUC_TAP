import React, { useState } from 'react';
import {
    Box,
    Grid,
    Button,
    TextField,
    Typography,
    IconButton,
    InputAdornment,
    Alert,
    Stack
} from '@mui/material';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from 'src/components/shared/DashboardCard'; // Import DashboardCard
import ApiService from 'src/service/ApiService'; // Import ApiService
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const ChangePassword = () => {
    const navigate = useNavigate(); // Initialize navigate
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleTogglePassword = (field) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
            setError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (formData.newPassword.length < 6) {
            setError('Mật khẩu mới phải có ít nhất 6 ký tự');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Mật khẩu mới không khớp');
            return;
        }

        try {
            // Call the changePassword API
            await ApiService.changePassword({
                oldPassword: formData.currentPassword,
                newPassword: formData.newPassword,
                againNewPassword: formData.confirmPassword
            });
            setSuccess('Đổi mật khẩu thành công!');
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });

            // Automatically log out and redirect to login page
            setTimeout(() => {
                ApiService.logout(); // Assuming logout function exists in ApiService
                navigate('/auth/login'); // Redirect to login page
            }, 2000); // Delay for 2 seconds to show success message
        } catch (err) {
            setError('Có lỗi xảy ra khi thay đổi mật khẩu');
        }
    };

    return (
        <PageContainer title="Đổi mật khẩu" description="Thay đổi mật khẩu tài khoản">
            <Box sx={{ minHeight: '100%', p: 3 }}>
                <Grid container justifyContent="center">
                    <Grid item xs={12} sm={6} md={4}>
                        <DashboardCard> {/* Wrap the form with DashboardCard */}
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h5" color="primary" fontWeight={500} align='center'>
                                    Đổi mật khẩu
                                </Typography>
                            </Box>

                            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                            <form onSubmit={handleSubmit}>
                                <Stack spacing={3}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Mật khẩu cũ"
                                        name="currentPassword"
                                        type={showPassword.current ? 'text' : 'password'}
                                        value={formData.currentPassword}
                                        onChange={handleChange}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton size="small" onClick={() => handleTogglePassword('current')}>
                                                        {showPassword.current ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Mật khẩu mới"
                                        name="newPassword"
                                        type={showPassword.new ? 'text' : 'password'}
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton size="small" onClick={() => handleTogglePassword('new')}>
                                                        {showPassword.new ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Nhập lại mật khẩu mới"
                                        name="confirmPassword"
                                        type={showPassword.confirm ? 'text' : 'password'}
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton size="small" onClick={() => handleTogglePassword('confirm')}>
                                                        {showPassword.confirm ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <Button
                                        fullWidth
                                        type="submit"
                                        variant="contained"
                                        sx={{
                                            py: 1,
                                            textTransform: 'none',
                                            fontSize: '0.875rem'
                                        }}
                                    >
                                        Xác nhận
                                    </Button>
                                </Stack>
                            </form>
                        </DashboardCard>
                    </Grid>
                </Grid>
            </Box>
        </PageContainer>
    );
};

export default ChangePassword;