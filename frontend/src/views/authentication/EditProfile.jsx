import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    TextField,
    Button,
    MenuItem,
    Typography,
    Card,
    CardContent,
    Avatar,
    CircularProgress
} from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import ApiService from 'src/service/ApiService';
import { useNavigate } from 'react-router-dom';

const genders = [
    { label: 'Nam', value: 'true' },
    { label: 'Nữ', value: 'false' }
];

const EditProfile = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        id: '',
        fullName: '',
        birthDate: '',
        email: '',
        address: '',
        gender: '',
        bankNumber: '',
        bankName: '',
        avatar: '',
        phoneNumber: ''
    });
    const [bankList, setBankList] = useState([]);
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const userData = await ApiService.getUserProfile();
                // Ensure userData.id is present and valid
                if (!userData.id) {
                    setError('Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.');
                    setLoading(false);
                    return;
                }
                setForm({
                    id: userData.id || '',
                    fullName: userData.fullName || '',
                    birthDate: userData.birthDate ? userData.birthDate.substring(0, 10) : '',
                    email: userData.email || '',
                    address: userData.address || '',
                    gender: userData.gender !== undefined ? userData.gender.toString() : '',
                    bankNumber: userData.bankNumber || '',
                    bankName: userData.bankName || '',
                    avatar: userData.avatar || '',
                    phoneNumber: userData.phoneNumber || ''
                });
                setAvatarPreview(userData.avatar || '');

                // Fetch banks after user profile to ensure bankName is available
                const banks = await ApiService.getBankList?.() || [];
                const hasUserBank = banks.some(
                    bank => bank.name === userData.bankName
                );
                if (userData.bankName && !hasUserBank) {
                    setBankList([{ name: userData.bankName }, ...banks]);
                } else {
                    setBankList(banks);
                }
            } catch (error) {
                setError(error.response?.data?.message || error.message || 'Failed to load profile');
            } finally {
                setLoading(false);
            }
        };
        fetchUserProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCancel = () => {
        navigate('/profile');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate user ID before submit
        if (!form.id) {
            setError('Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.');
            return;
        }
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('Id', String(form.id)); // Capital "I", ensure string
            formData.append('fullName', form.fullName || '');
            formData.append('phoneNumber', form.phoneNumber || '');
            formData.append('email', form.email || '');
            formData.append('gender', form.gender || '');
            formData.append('address', form.address || '');
            formData.append('birthDay', form.birthDate || ''); // Use "birthDay"
            formData.append('bankNumber', form.bankNumber || '');
            formData.append('bankName', form.bankName || '');
            if (avatarFile) {
                formData.append('FileImage', avatarFile); // Use "FileImage"
            }
            await ApiService.updateUser(form.id, formData);
            navigate('/profile');
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                style={{ minHeight: '100vh' }}
            >
                <CircularProgress />
            </Grid>
        );
    }

    return (
        <PageContainer
            title='Sửa hồ sơ cá nhân'
            description='Cập nhật thông tin cá nhân'
        >
            <Card>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                        <Typography variant="h5">
                            Sửa hồ sơ cá nhân
                        </Typography>
                        <Button color="inherit" variant="outlined" size="small" onClick={handleCancel}>
                            Hủy
                        </Button>
                    </Box>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sx={{ textAlign: 'center' }}>
                                <Box sx={{ mb: 2 }}>
                                    <Avatar
                                        src={avatarPreview || form.avatar}
                                        sx={{ width: 120, height: 120, margin: '0 auto', mb: 2 }}
                                    />
                                    <Button variant="contained" component="label" size="small">
                                        Đổi ảnh đại diện
                                        <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
                                    </Button>
                                </Box>
                            </Grid>
                            <input type="hidden" name="id" value={form.id} />
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Họ và tên"
                                    name="fullName"
                                    value={form.fullName}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Ngày sinh"
                                    name="birthDate"
                                    type="date"
                                    value={form.birthDate}
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Số điện thoại"
                                    name="phoneNumber"
                                    value={form.phoneNumber}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Địa chỉ"
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Giới tính"
                                    name="gender"
                                    value={form.gender}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="">Chọn giới tính</MenuItem>
                                    {genders.map((g) => (
                                        <MenuItem key={g.value} value={g.value}>
                                            {g.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Số tài khoản"
                                    name="bankNumber"
                                    value={form.bankNumber}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Ngân hàng"
                                    name="bankName"
                                    value={form.bankName}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="">Chọn ngân hàng</MenuItem>
                                    {bankList.map((bank) => (
                                        <MenuItem key={bank.id || bank.code || bank.name} value={bank.name}>
                                            {bank.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    size="large"
                                    disabled={saving}
                                >
                                    Lưu thay đổi
                                </Button>
                            </Grid>
                            {error && (
                                <Grid item xs={12}>
                                    <Typography color="error" align="center">{error}</Typography>
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
        </PageContainer>
    );
};

export default EditProfile;