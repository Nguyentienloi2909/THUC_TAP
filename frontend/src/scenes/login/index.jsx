import React from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    useTheme,
    Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const Login = ({ setIsAuthenticated }) => {
    const theme = useTheme();
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        username: Yup.string().required('Tên đăng nhập là bắt buộc'),
        password: Yup.string().required('Mật khẩu là bắt buộc'),
    });

    const handleSubmit = (values, { setSubmitting, setErrors }) => {
        const { username, password } = values;
        if (username === 'dat' && password === 'dat') {
            setIsAuthenticated(true);
            navigate('/');
        } else {
            setErrors({ general: 'Tên đăng nhập hoặc mật khẩu không đúng' });
        }
        setSubmitting(false);
    };

    return (
        <Box
            sx={{
                backgroundColor: `${theme.palette.background.default} !important`,
                minHeight: '100vh !important',
                width: '100% !important',
                display: 'flex !important',
                alignItems: 'center !important',
                justifyContent: 'center !important',
                padding: '16px !important',
                boxSizing: 'border-box !important',
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    width: '100%',
                    maxWidth: '400px',
                    padding: '32px !important',
                    borderRadius: '16px !important',
                    backgroundColor: `#ffffff !important`,
                    boxSizing: 'border-box !important',
                }}
            >
                <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: 'black' }}>
                    ĐĂNG NHẬP
                </Typography>
                <Formik
                    initialValues={{ username: '', password: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched, isSubmitting }) => (
                        <Form>
                            <Field
                                as={TextField}
                                name="username"
                                label="Tên đăng nhập"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                error={touched.username && Boolean(errors.username)}
                                helperText={touched.username && errors.username}
                                autoComplete="username"
                                InputProps={{
                                    style: {
                                        backgroundColor: '#ccc',
                                        color: 'black',
                                    },
                                }}
                                InputLabelProps={{
                                    style: {
                                        color: 'black',
                                    },
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'black',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'black',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'black',
                                        },
                                    },
                                }}
                            />
                            <Field
                                as={TextField}
                                name="password"
                                label="Mật khẩu"
                                type="password"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                error={touched.password && Boolean(errors.password)}
                                helperText={touched.password && errors.password}
                                autoComplete="current-password"
                                InputProps={{
                                    style: {
                                        backgroundColor: '#ccc',
                                        color: 'black',
                                    },
                                }}
                                InputLabelProps={{
                                    style: {
                                        color: 'black',
                                    },
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'black',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'black',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'black',
                                        },
                                    },
                                }}
                            />
                            {errors.general && (
                                <Typography color="error" sx={{ mt: 1 }}>
                                    {errors.general}
                                </Typography>
                            )}
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={isSubmitting}
                                sx={{
                                    mt: 2,
                                    backgroundColor: '#0D1B2A !important',
                                    color: '#fff !important',
                                    fontWeight: 'bold',
                                    '&:hover': {
                                        backgroundColor: '#1B263B !important',
                                    },
                                }}
                            >
                                Đăng Nhập
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </Box>
    );
};

export default Login;
