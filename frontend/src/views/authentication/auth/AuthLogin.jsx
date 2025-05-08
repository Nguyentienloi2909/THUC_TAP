import React, { useState } from 'react';
import {
    Box,
    Typography,
    FormGroup,
    FormControlLabel,
    Button,
    Stack,
    Checkbox,
    IconButton
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { IconEye, IconEyeOff } from '@tabler/icons-react';

import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import ApiService from '../../../service/ApiService';

const AuthLogin = ({ title, subtitle, subtext }) => {
    const navigate = useNavigate();

    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false); // New state for password visibility

    const handleChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.id]: e.target.value,
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const loginPayload = {
                email: loginData.email,
                passwordHash: loginData.password
            };

            console.log('Attempting to login with payload:', loginPayload);
            console.log('API Endpoint:', ApiService.BASE_URL);

            const res = await ApiService.loginUser(loginPayload);

            if (!res || res.statusCode === 401) {
                throw new Error(res.message || 'Empty response from server');
            }

            console.log('Login response:', res);
            localStorage.setItem('token', res.token);
            localStorage.setItem('role', res.role);

            navigate('/'); // Redirect to home page on successful login
        } catch (err) {
            console.error('Login error details:', {
                message: err.message,
                code: err.code,
                config: err.config,
                stack: err.stack
            });

            if (err.message === 'Invalid password') {
                setError('Mật khẩu không hợp lệ. Vui lòng thử lại.');
            } else if (err.code === 'ERR_NETWORK') {
                setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
            } else {
                setError('Đăng nhập thất bại. Vui lòng thử lại sau.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {title && (
                <Typography fontWeight="700" variant="h2" mb={1}>
                    {title}
                </Typography>
            )}

            {subtext}

            <form onSubmit={handleSubmit}>
                <Stack>
                    <Box>
                        <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="email" mb="5px">
                            Email
                        </Typography>
                        <CustomTextField
                            id="email"
                            variant="outlined"
                            fullWidth
                            value={loginData.email}
                            onChange={handleChange}
                        />
                    </Box>
                    <Box mt="25px">
                        <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="password" mb="5px">
                            Mật khẩu
                        </Typography>
                        <CustomTextField
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            variant="outlined"
                            fullWidth
                            value={loginData.password}
                            onChange={handleChange}
                            InputProps={{
                                endAdornment: (
                                    <IconButton onClick={togglePasswordVisibility} edge="end">
                                        {showPassword ? <IconEyeOff size="20" /> : <IconEye size="20" />}
                                    </IconButton>
                                ),
                            }}
                        />
                    </Box>
                    <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
                        {/* <FormGroup>
                            <FormControlLabel
                                control={<Checkbox defaultChecked />}
                                label="Ghi nhớ lịch sử đăng nhập"
                            />
                        </FormGroup> */}
                        <Typography
                            component={Link}
                            to="/forgot-password"
                            fontWeight="500"
                            sx={{
                                textDecoration: 'none',
                                color: 'primary.main',
                            }}
                        >
                            Quên mật khẩu?
                        </Typography>
                    </Stack>
                </Stack>

                {error && (
                    <Typography color="error" my={2}>
                        {error}
                    </Typography>
                )}

                <Box>
                    <Button
                        color="primary"
                        variant="contained"
                        size="large"
                        fullWidth
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </Button>
                </Box>
            </form>

            {subtitle}
        </>
    );
};

export default AuthLogin;
