import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

const genders = [
    { label: 'Nam', value: 'true' },
    { label: 'Nữ', value: 'false' }
];

const formatCurrency = (value) => {
    const number = Number(value);
    if (isNaN(number)) return '';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(number);
};

const parseCurrency = (formattedValue) => {
    return formattedValue.replace(/[^0-9]/g, '');
};

const EmployeeEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        id: '',
        fullName: '',
        email: '',
        phoneNumber: '',
        avatar: '',
        address: '',
        gender: '',
        birthDate: '',
        bankNumber: '',
        bankName: '',
        status: 'Active',
        roleId: '',
        groupId: '',
        startDate: '',
        monthSalary: ''
    });
    const [formInitial, setFormInitial] = useState({});
    const [departments, setDepartments] = useState([]);
    const [errors, setErrors] = useState({});
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [banks, setBanks] = useState([]);
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const deptData = await ApiService.getAllDepartments();
                const groupList = deptData.flatMap(dept =>
                    (dept.groups || []).map(group => ({
                        groupId: group.id.toString(),
                        groupName: `${group.groupName} (${dept.departmentName})`
                    }))
                );
                setDepartments(groupList);

                const bankList = await ApiService.getBankList();
                setBanks(Array.isArray(bankList) ? bankList : []);

                const roleList = await ApiService.getAllRoles();
                setRoles(Array.isArray(roleList) ? roleList : []);

                if (id) {
                    const user = await ApiService.getUser(id);
                    if (!user.id) {
                        setErrors({ general: 'Không tìm thấy nhân viên.' });
                        setLoading(false);
                        return;
                    }
                    const matchingBank = bankList.find(bank =>
                        bank.code === user.bankName || bank.name === user.bankName
                    );

                    const initialData = {
                        id: user.id || '',
                        fullName: user.fullName || '',
                        email: user.email || '',
                        phoneNumber: user.phoneNumber || '',
                        avatar: user.avatar || '',
                        address: user.address || '',
                        gender: user.gender !== undefined ? user.gender.toString() : '',
                        birthDate: user.birthDate?.substring(0, 10) || '',
                        bankNumber: user.bankNumber || '',
                        bankName: matchingBank ? matchingBank.name : user.bankName || '',
                        status: user.status || 'Active',
                        roleId: user.roleId ? user.roleId.toString() : '',
                        groupId: user.groupId ? user.groupId.toString() : '',
                        startDate: user.startDate?.substring(0, 10) || '',
                        monthSalary: user.monthSalary ? user.monthSalary.toString() : ''
                    };
                    setFormInitial(initialData);
                    setForm(initialData);
                    setAvatarPreview(user.avatar || null);
                }
            } catch (err) {
                setErrors({ general: 'Không thể tải dữ liệu nhân viên.' });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setErrors(prev => ({ ...prev, [name]: '' }));

        if (name === 'groupId') {
            const selected = departments.find(d => d.groupId === value);
            setForm(prev => ({
                ...prev,
                groupId: value,
                groupName: selected?.groupName || ''
            }));
        } else if (name === 'roleId') {
            const selected = roles.find(r => r.id.toString() === value);
            setForm(prev => ({
                ...prev,
                roleId: value,
                roleName: selected?.roleName || ''
            }));
        } else if (name === 'monthSalary') {
            const raw = parseCurrency(value);
            setForm(prev => ({ ...prev, monthSalary: raw }));
        } else {
            setForm(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!form.groupId) newErrors.groupId = 'Vui lòng chọn phòng ban';
        if (!form.roleId) newErrors.roleId = 'Vui lòng chọn chức vụ';
        if (!form.startDate) newErrors.startDate = 'Vui lòng chọn ngày bắt đầu';
        if (form.monthSalary && (isNaN(form.monthSalary) || Number(form.monthSalary) <= 0))
            newErrors.monthSalary = 'Lương tháng phải là số dương';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setSaving(true);
        try {
            const updatedData = {
                ...formInitial, // Keep original data for disabled fields
                groupId: Number(form.groupId),
                roleId: Number(form.roleId),
                startDate: form.startDate,
                monthSalary: form.monthSalary || '0'
            };

            const formData = new FormData();
            Object.entries(updatedData).forEach(([key, value]) => {
                if (key !== 'groupName' && key !== 'roleName' && key !== 'avatar') {
                    formData.append(key, value);
                }
            });

            await ApiService.updateUser(id, formData);
            navigate('/manage/employee/list', { state: { success: 'Cập nhật nhân viên thành công!' } });
        } catch (error) {
            setErrors({
                general: error.response?.data?.message || 'Lỗi khi cập nhật thông tin nhân viên.'
            });
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (window.confirm('Bạn có chắc muốn hủy? Các thay đổi sẽ không được lưu.')) {
            navigate(`/manage/employee/info/${id}`);
        }
    };

    if (loading) {
        return (
            <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
                <CircularProgress />
            </Grid>
        );
    }

    return (
        <PageContainer title="Cập nhật thông tin nhân viên" description="Chỉnh sửa thông tin nhân viên">
            <Card>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                        <Typography variant="h5">Cập nhật thông tin nhân viên</Typography>
                    </Box>
                    {errors.general && (
                        <Typography color="error" sx={{ mb: 2 }}>{errors.general}</Typography>
                    )}
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Thông tin cá nhân</Typography>
                        <Grid container justifyContent="center" sx={{ mb: 2 }}>
                            <Grid item>
                                <Avatar
                                    src={avatarPreview}
                                    alt="Employee Avatar"
                                    sx={{ width: 200, height: 200, mb: 2 }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Họ và tên"
                                    name="fullName"
                                    value={form.fullName}
                                    onChange={handleChange}
                                    error={!!errors.fullName}
                                    helperText={errors.fullName}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    error={!!errors.email}
                                    helperText={errors.email}
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
                                    error={!!errors.phoneNumber}
                                    helperText={errors.phoneNumber}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Địa chỉ"
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    error={!!errors.address}
                                    helperText={errors.address}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Ngày sinh"
                                    name="birthDate"
                                    value={form.birthDate}
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                    error={!!errors.birthDate}
                                    helperText={errors.birthDate}
                                    disabled
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
                                    error={!!errors.gender}
                                    helperText={errors.gender}
                                    disabled
                                >
                                    <MenuItem value="">Chọn giới tính</MenuItem>
                                    {genders.map(g => (
                                        <MenuItem key={g.value} value={g.value}>{g.label}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>

                        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Thông tin ngân hàng</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Số tài khoản"
                                    name="bankNumber"
                                    value={form.bankNumber}
                                    onChange={handleChange}
                                    error={!!errors.bankNumber}
                                    helperText={errors.bankNumber}
                                    disabled
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
                                    error={!!errors.bankName}
                                    helperText={errors.bankName}
                                    disabled
                                >
                                    <MenuItem value="">Chọn ngân hàng</MenuItem>
                                    {banks.length > 0 ? (
                                        banks.map(bank => (
                                            <MenuItem key={bank.code} value={bank.name}>{bank.name}</MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>Không có ngân hàng</MenuItem>
                                    )}
                                </TextField>
                            </Grid>
                        </Grid>

                        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Thông tin công việc</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Phòng ban"
                                    name="groupId"
                                    value={form.groupId}
                                    onChange={handleChange}
                                    error={!!errors.groupId}
                                    helperText={errors.groupId}
                                >
                                    <MenuItem value="">Chọn phòng ban</MenuItem>
                                    {departments.length > 0 ? (
                                        departments.map(dept => (
                                            <MenuItem key={dept.groupId} value={dept.groupId}>{dept.groupName}</MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>Không có phòng ban</MenuItem>
                                    )}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Chức vụ"
                                    name="roleId"
                                    value={form.roleId}
                                    onChange={handleChange}
                                    error={!!errors.roleId}
                                    helperText={errors.roleId}
                                >
                                    <MenuItem value="">Chọn chức vụ</MenuItem>
                                    {roles.length > 0 ? (
                                        roles.map(role => (
                                            <MenuItem key={role.id} value={role.id}>{role.roleName}</MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>Không có chức vụ</MenuItem>
                                    )}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Ngày bắt đầu"
                                    name="startDate"
                                    value={form.startDate}
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                    error={!!errors.startDate}
                                    helperText={errors.startDate}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Lương tháng"
                                    name="monthSalary"
                                    value={form.monthSalary ? formatCurrency(form.monthSalary) : ''}
                                    onChange={handleChange}
                                    error={!!errors.monthSalary}
                                    helperText={errors.monthSalary || 'Nhập số tiền (VND)'}
                                />
                            </Grid>
                        </Grid>

                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={saving}
                                sx={{ mr: 2 }}
                            >
                                {saving ? 'Đang cập nhật...' : 'Cập nhật'}
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={handleCancel}
                                disabled={saving}
                            >
                                Hủy
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </PageContainer>
    );
};

export default EmployeeEdit;