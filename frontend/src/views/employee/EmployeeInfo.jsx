import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Grid, Card, CardContent, Typography, Avatar, Divider, Box,
    Stack, Chip, Button, ButtonGroup, Dialog, DialogActions,
    DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import ApiService from '../../service/ApiService';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import {
    IconPhone, IconMail, IconMapPin, IconArrowLeft, IconEdit, IconTrash,
    IconCalendar, IconGenderBigender, IconBuildingBank, IconUsers
} from '@tabler/icons-react';
import ProfileImg from 'src/assets/images/profile/user-1.jpg';


const InfoItem = ({ icon, label, value }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {icon}
        <Box sx={{ ml: 2 }}>
            <Typography component="div" variant="caption" color="textSecondary">{label}</Typography>
            <Typography component="div" variant="body2">{value}</Typography>
        </Box>
    </Box>
);

const EmployeesInfo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                setLoading(true);
                const response = await ApiService.getUser(id);
                console.log("Fetched employee data:", response); // Log the fetched employee data
                setEmployee(response);
            } catch (error) {
                setError(error.response?.data?.message || error.message || 'Failed to load employee');
            } finally {
                setLoading(false);
            }
        };

        fetchEmployee();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!employee) {
        return <div>Employee not found</div>;
    }

    // Add handlers
    const handleEdit = () => {
        // Will implement edit functionality later
        console.log('Edit employee:', id);
        navigate(`/manage/employee/edit/${id}`);
    };

    const handleBack = () => {
        navigate('/manage/employee/list');
    };

    const handleDelete = async () => {
        try {
            await ApiService.deleteUser(id);
            setOpenDialog(false);
            navigate('/manage/employee/list');
        } catch (error) {
            console.error('Error deleting employee:', error);
            setError(error.response?.data?.message || error.message || 'Failed to delete employee');
        }
    };

    const handleDeleteClick = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const getAvatarSrc = () => {
        if (employee.avatar && typeof employee.avatar === 'string') {
            const trimmed = employee.avatar.trim();
            return trimmed.startsWith('http')
                ? trimmed
                : `/${trimmed}`;
        }
        return ProfileImg;
    };

    return (
        <PageContainer title="Thông tin nhân viên" description="Chi tiết thông tin nhân viên">
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="outlined" startIcon={<IconArrowLeft />} onClick={handleBack}>
                    Trở lại
                </Button>
                <ButtonGroup variant="contained">
                    <Button color="primary" startIcon={<IconEdit />} onClick={handleEdit}>
                        Sửa
                    </Button>
                    <Button color="error" startIcon={<IconTrash />} onClick={handleDeleteClick}>
                        Xóa
                    </Button>
                </ButtonGroup>
            </Box>

            <Card sx={{ p: 3 }}>
                {/* Avatar Section */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Avatar
                        src={getAvatarSrc()}
                        alt={employee.fullName || 'Employee Avatar'}
                        sx={{
                            width: 150,
                            height: 150,
                            margin: '0 auto',
                            mb: 2,
                            boxShadow: 3
                        }}
                    />
                    <Typography variant="h5" gutterBottom>
                        {employee.fullName}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                        CHỨC VỤ:  {employee.roleName}
                    </Typography>
                    <Chip
                        label={employee.status}
                        color="success"
                        size="small"
                        sx={{ borderRadius: 1 }}
                    />
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Information Grid */}
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Stack spacing={3}>
                            <InfoItem
                                icon={<IconPhone size={20} />}
                                label="Số điện thoại"
                                value={employee.phoneNumber}
                            />
                            <InfoItem
                                icon={<IconMail size={20} />}
                                label="Email"
                                value={employee.email}
                            />
                            <InfoItem
                                icon={<IconCalendar size={20} />}
                                label="Ngày sinh"
                                value={employee.birthDate ? new Date(employee.birthDate).toLocaleDateString('en-GB') : 'N/A'}
                            />
                            <InfoItem
                                icon={<IconGenderBigender size={20} />}
                                label="Giới tính"
                                value={employee.gender === true ? 'Nam' : 'Nữ'}
                            />
                        </Stack>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Stack spacing={3}>
                            <InfoItem
                                icon={<IconMapPin size={20} />}
                                label="Địa chỉ"
                                value={employee.address}
                            />
                            <InfoItem
                                icon={<IconMapPin size={20} />}
                                label="Hệ số lương"
                                value={employee.salaryCoefficient}
                            />
                            <InfoItem
                                icon={<IconMapPin size={20} />}
                                label="Lương cơ bản"
                                value={employee.baseSalary}
                            />
                            <InfoItem
                                icon={<IconUsers size={20} />}
                                label="Phòng ban - Nhóm"
                                value={employee.groupName}
                            />
                            <InfoItem
                                icon={<IconBuildingBank size={20} />}
                                label="Tài khoản ngân hàng"
                                value={employee.bankNumber && employee.bankName
                                    ? `${employee.bankNumber} - ${employee.bankName}`
                                    : 'N/A'}
                            />
                        </Stack>
                    </Grid>
                </Grid>
            </Card>

            {/* Dialog xác nhận xóa */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
            >
                <DialogTitle>Xác nhận xóa nhân viên</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có chắc chắn muốn xóa nhân viên này không? Hành động này không thể hoàn tác.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleDelete} color="error" variant="contained">
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </PageContainer>
    );
};

export default EmployeesInfo;
