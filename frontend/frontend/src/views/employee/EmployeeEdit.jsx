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
    Avatar
} from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import ApiService from 'src/service/ApiService';

const genders = [
    { label: 'Nam', value: true },
    { label: 'Nữ', value: false }
];

const EmployeeEdit = () => {
    const { id } = useParams();
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
        baseSalary: '',
        salaryCoefficient: '',
    });

    const [departments, setDepartments] = useState([]);
    const [errors, setErrors] = useState({});
    const [avatar, setAvatar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [banks, setBanks] = useState([]);
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Fetching data for user ID:", id); // Debugging line
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
                    console.log("Fetched user data:", user); // Debugging line

                    // Update bank name handling
                    const userBankName = user.bankName;
                    const matchingBank = bankList.find(bank =>
                        bank.shortName === userBankName ||
                        bank.name === userBankName
                    );

                    setForm({
                        fullName: user.fullName || '',
                        email: user.email || '',
                        phoneNumber: user.phoneNumber || '',
                        avatar: user.avatar || '',
                        address: user.address || '',
                        gender: user.gender,
                        birthDate: user.birthDate?.substring(0, 10) || '',
                        bankNumber: user.bankNumber || '',
                        bankName: matchingBank ? matchingBank.name : userBankName || '', // Use updated bank name handling
                        status: user.status || '',
                        roleId: user.roleId ? user.roleId.toString() : '',
                        groupId: user.groupId ? user.groupId.toString() : '',
                        baseSalary: user.baseSalary || '',
                        salaryCoefficient: user.salaryCoefficient || '',
                    });
                }
            } catch (err) {
                console.error("Error loading data", err);
            }
        };
        fetchData();
    }, [id]);

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
        console.log("Form data:", form); // Log the form data for inspection
        if (validate()) {
            try {
                setLoading(true);

                const formData = new FormData();
                formData.append('id', id); // Add the employee ID to the form data
                formData.append('email', form.email);
                formData.append('fullName', form.fullName);
                formData.append('phoneNumber', form.phoneNumber);
                formData.append('address', form.address);
                formData.append('gender', form.gender === true || form.gender === 'true' ? 'true' : 'false');
                formData.append('birthDate', form.birthDate);
                formData.append('bankNumber', form.bankNumber);
                formData.append('bankName', form.bankName);
                formData.append('status', form.status);
                formData.append('roleId', Number(form.roleId));
                formData.append('groupId', Number(form.groupId));
                formData.append('baseSalary', form.baseSalary);
                formData.append('salaryCoefficient', form.salaryCoefficient);

                if (avatar) {
                    const avatarFile = await fetch(avatar).then(res => res.blob());
                    formData.append('FileImage', avatarFile, 'avatar.png');
                }

                // Debugging: Log each key-value pair in FormData
                for (let [key, value] of formData.entries()) {
                    console.log(`${key}: ${value}`);
                }

                await ApiService.updateUser(id, formData);
                navigate('/manage/employee/list');
            } catch (error) {
                if (error.response && error.response.data) {
                    alert('Lỗi: ' + JSON.stringify(error.response.data));
                } else {
                    alert('Có lỗi khi cập nhật thông tin nhân viên!');
                }
                console.error('Error updating employee:', error);
            } finally {
                setLoading(false);
            }
        }
    };


    const handleCancel = () => {
        navigate(`/manage/employee/info/${id}`);
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
            title='Cập nhật thông tin nhân viên'
            description='Chỉnh sửa thông tin nhân viên'
        >
            <Card>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                        <Typography variant="h5">
                            Cập nhật thông tin nhân viên
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
                                        src={avatar || form.avatar}
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
                                    InputProps={{
                                        readOnly: true, // Make email read-only
                                    }}
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
                                    InputProps={{
                                        readOnly: true, // Make email read-only
                                    }}
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
                                    InputProps={{
                                        readOnly: true, // Make phone number read-only
                                    }}
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
                                    InputProps={{
                                        readOnly: true, // Make birth date read-only
                                    }}
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
                                    InputProps={{
                                        readOnly: true, // Make gender read-only
                                    }}
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
                                    InputProps={{
                                        readOnly: true, // Make address read-only
                                    }}
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
                                    InputProps={{
                                        readOnly: true, // Make bank number read-only
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="bankName"
                                    name="bankName"
                                    label="Ngân hàng"
                                    value={form.bankName || ''} // Add fallback for empty value
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        disabled={loading}
                                    >
                                        Cập nhật
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

export default EmployeeEdit;