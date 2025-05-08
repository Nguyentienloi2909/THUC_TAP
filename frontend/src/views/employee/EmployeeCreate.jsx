import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Grid,
    TextField,
    Button,
    MenuItem,
    Typography,
    Card,
    CardContent,
    Avatar
} from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import ApiService from 'src/service/ApiService';

const genders = [
    { label: 'Nam', value: true },
    { label: 'Nữ', value: false }
];

const EmployeeCreate = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        avatar: '',
        address: '',
        gender: true,
        birthDate: '',
        bankNumber: '',
        bankName: '',
        status: 'Active',
        roleId: '',
        roleName: '',
        groupId: '',
        groupName: '',
        baseSalary: '', // Add baseSalary field
        salaryCoefficient: '', // Add salaryCoefficient field
    });

    const [departments, setDepartments] = useState([]);
    const [errors, setErrors] = useState({});
    const [avatar, setAvatar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [banks, setBanks] = useState([]);
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const data = await ApiService.getAllDepartments();
                const groupList = data.flatMap(dept =>
                    (dept.groups || []).map(group => ({
                        groupId: group.id.toString(),
                        groupName: `${group.groupName} (${dept.departmentName})`
                    }))
                );
                setDepartments(groupList);
            } catch (err) {
                console.error("Error loading departments", err);
                setDepartments([]);
            }
        };
        fetchDepartments();

        const fetchBanks = async () => {
            if (typeof ApiService.getBankList === 'function') {
                try {
                    const bankList = await ApiService.getBankList();
                    setBanks(Array.isArray(bankList) ? bankList : []);
                } catch (err) {
                    console.error("Error loading banks", err);
                    setBanks([]);
                }
            }
        };
        fetchBanks();

        const fetchRoles = async () => {
            if (typeof ApiService.getAllRoles === 'function') {
                try {
                    const roleList = await ApiService.getAllRoles();
                    setRoles(Array.isArray(roleList) ? roleList : []);
                } catch (err) {
                    console.error("Error loading roles", err);
                    setRoles([]);
                }
            }
        };
        fetchRoles();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
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
        } else {
            setForm(prev => ({
                ...prev,
                [name]: name === 'gender' ? value === 'true' : value
            }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!form.fullName) newErrors.fullName = 'Vui lòng nhập họ tên';
        if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Email không hợp lệ';
        if (!form.phoneNumber) newErrors.phoneNumber = 'Vui lòng nhập số điện thoại';
        if (!form.groupId) newErrors.groupName = 'Vui lòng chọn phòng ban';
        if (!form.roleId) newErrors.roleName = 'Vui lòng chọn chức vụ';
        if (!form.birthDate) newErrors.birthDate = 'Vui lòng chọn ngày sinh';
        if (form.gender === undefined || form.gender === null) newErrors.gender = 'Vui lòng chọn giới tính';
        if (!form.address) newErrors.address = 'Vui lòng nhập địa chỉ';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                setLoading(true);

                const formData = new FormData();

                // Gửi đúng tên trường và kiểu dữ liệu backend yêu cầu
                formData.append('email', form.email);
                formData.append('fullName', form.fullName);
                formData.append('phoneNumber', form.phoneNumber);
                formData.append('address', form.address);
                formData.append('gender', form.gender === true || form.gender === 'true' ? 'true' : 'false');
                formData.append('birthDate', form.birthDate); // yyyy-MM-dd
                formData.append('bankNumber', form.bankNumber);
                formData.append('bankName', form.bankName);
                formData.append('baseSalary', form.baseSalary);
                formData.append('salaryCoefficient', form.salaryCoefficient);
                formData.append('status', form.status);
                formData.append('roleId', Number(form.roleId));
                formData.append('groupId', Number(form.groupId));

                // Thêm file ảnh nếu có
                if (avatar) {
                    const avatarFile = await fetch(avatar).then(res => res.blob());
                    formData.append('FileImage', avatarFile, 'avatar.png');
                }

                await ApiService.createUser(formData);
                navigate('/manage/employee/list');
            } catch (error) {
                // Hiển thị lỗi chi tiết từ backend nếu có
                if (error.response && error.response.data) {
                    alert('Lỗi: ' + JSON.stringify(error.response.data));
                } else {
                    alert('Có lỗi khi tạo nhân viên mới!');
                }
                console.error('Error creating employee:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleCancel = () => {
        navigate('/manage/employee/list');
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <PageContainer
            title='Thêm nhân viên mới'
            description='Tạo mới nhân viên'
        >
            <Card>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                        <Typography variant="h5">
                            Thêm nhân viên mới
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
                                        src={avatar}
                                        sx={{ width: 200, height: 200, margin: '0 auto', mb: 2 }}
                                    />
                                    <Button variant="contained" component="label" size="small">
                                        Tải lên ảnh đại diện
                                        <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
                                    </Button>
                                </Box>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="fullName"
                                    name="fullName"
                                    label="Họ và tên"
                                    value={form.fullName}
                                    onChange={handleChange}
                                    error={!!errors.fullName}
                                    helperText={errors.fullName}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="email"
                                    name="email"
                                    label="Email"
                                    value={form.email}
                                    onChange={handleChange}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    label="Số điện thoại"
                                    value={form.phoneNumber}
                                    onChange={handleChange}
                                    error={!!errors.phoneNumber}
                                    helperText={errors.phoneNumber}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    select
                                    fullWidth
                                    id="groupId"
                                    name="groupId"
                                    label="Phòng ban"
                                    value={form.groupId}
                                    onChange={handleChange}
                                    error={!!errors.groupName}
                                    helperText={errors.groupName}
                                >
                                    {departments.length === 0 ? (
                                        <MenuItem disabled>Đang tải nhóm...</MenuItem>
                                    ) : (
                                        departments
                                            .filter(dept => dept.groupId)
                                            .map((dept) => (
                                                <MenuItem key={`dept-${dept.groupId}`} value={dept.groupId}>
                                                    {dept.groupName}
                                                </MenuItem>
                                            ))
                                    )}
                                </TextField>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    select
                                    fullWidth
                                    id="roleId"
                                    name="roleId"
                                    label="Chức vụ"
                                    value={form.roleId}
                                    onChange={handleChange}
                                    error={!!errors.roleName}
                                    helperText={errors.roleName}
                                >
                                    {roles && roles.length === 0 ? (
                                        <MenuItem disabled>Đang tải chức vụ...</MenuItem>
                                    ) : (
                                        roles && roles.map((role) => (
                                            <MenuItem key={role.id} value={role.id}>
                                                {role.roleName}
                                            </MenuItem>
                                        ))
                                    )}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="baseSalary"
                                    name="baseSalary"
                                    label="Lương cơ bản"
                                    type="number"
                                    value={form.baseSalary}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="salaryCoefficient"
                                    name="salaryCoefficient"
                                    label="Hệ số lương"
                                    type="number"
                                    value={form.salaryCoefficient}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="birthDate"
                                    name="birthDate"
                                    label="Ngày sinh"
                                    type="date"
                                    value={form.birthDate}
                                    onChange={handleChange}
                                    error={!!errors.birthDate}
                                    helperText={errors.birthDate}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    select
                                    fullWidth
                                    id="gender"
                                    name="gender"
                                    label="Giới tính"
                                    value={form.gender.toString()}
                                    onChange={handleChange}
                                    error={!!errors.gender}
                                    helperText={errors.gender}
                                >
                                    {genders.map((g) => (
                                        <MenuItem key={g.value.toString()} value={g.value.toString()}>
                                            {g.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="address"
                                    name="address"
                                    label="Địa chỉ"
                                    value={form.address}
                                    onChange={handleChange}
                                    error={!!errors.address}
                                    helperText={errors.address}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="bankNumber"
                                    name="bankNumber"
                                    label="Số tài khoản"
                                    value={form.bankNumber}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    select
                                    fullWidth
                                    id="bankName"
                                    name="bankName"
                                    label="Ngân hàng"
                                    value={form.bankName}
                                    onChange={handleChange}
                                >
                                    {banks && banks.length === 0 ? (
                                        <MenuItem disabled>Đang tải ngân hàng...</MenuItem>
                                    ) : (
                                        banks && banks.map((bank) => (
                                            <MenuItem key={bank.id} value={bank.shortName || bank.name}>
                                                {bank.name}
                                            </MenuItem>
                                        ))
                                    )}
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        disabled={loading}
                                    >
                                        Thêm mới
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
        </PageContainer>
    );
};

export default EmployeeCreate;