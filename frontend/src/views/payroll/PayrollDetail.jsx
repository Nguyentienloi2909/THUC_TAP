import React, { useState, useEffect } from 'react';
import {
    Paper,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Box,
    Card,
    CardContent,
    Divider,
    Button,
    Stack,
    useTheme,
    CircularProgress
} from '@mui/material';
import { IconPrinter, IconDownload, IconArrowBack } from '@tabler/icons-react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from 'src/service/ApiService';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';

const PayrollDetail = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { userId, month, year } = useParams();
    const [payroll, setPayroll] = useState(null);
    const [employee, setEmployee] = useState(null);
    const [noteData, setNoteData] = useState({ lateDays: 0, absentDays: 0, deductions: [] });
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Validate params
                if (!userId || !month || !year || isNaN(month) || isNaN(year)) {
                    throw new Error('Thông tin đầu vào không hợp lệ');
                }

                const payrollData = await ApiService.getSalaryById(userId, month, year);
                const employeeData = await ApiService.getUser(userId);
                const departmentData = await ApiService.getAllDepartments();

                console.log('Fetched payroll:', payrollData);
                console.log('Fetched employee:', employeeData);
                console.log('Fetched departments:', departmentData);

                setPayroll(payrollData);
                setEmployee(employeeData);
                setDepartments(departmentData);

                const parsedNote = parseNote(payrollData.note);
                setNoteData(parsedNote);
            } catch (err) {
                setError(err.message || 'Không thể tải dữ liệu lương. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId, month, year]);

    const getDepartmentName = (departmentId) => {
        const department = departments.find(dep => dep.id === departmentId);
        return department ? department.departmentName : 'N/A';
    };

    const parseNote = (note) => {
        if (!note) return { lateDays: 0, absentDays: 0, deductions: [] };
        const regex = /(Trễ): (\d+), (Vắng): (\d+), (Số tiền trừ): ([\d,]+)/;
        const match = note.match(regex);
        if (match) {
            const lateDays = parseInt(match[2]);
            const absentDays = parseInt(match[4]);
            const deductionAmount = parseInt(match[6].replace(/,/g, ''));
            return {
                lateDays,
                absentDays,
                deductions: [{ title: 'Khấu trừ (Trễ/Vắng)', amount: deductionAmount }]
            };
        }
        return { lateDays: 0, absentDays: 0, deductions: [] };
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const calculateGrossTotal = () => payroll?.monthSalary || 0;
    const calculateDeductionsTotal = () => noteData.deductions.reduce((sum, item) => sum + item.amount, 0);
    const calculateNetTotal = () => payroll?.totalSalary || 0;

    const getDepartmentNameByGroupId = (groupId) => {
        for (const department of departments) {
            const group = department.groups.find(group => group.id === groupId);
            if (group) {
                return department.departmentName;
            }
        }
        return 'Không có thông tin';
    };

    if (loading) {
        return (
            <PageContainer>
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                </Box>
            </PageContainer>
        );
    }

    if (error || !payroll || !employee) {
        return (
            <PageContainer>
                <Box sx={{ p: 3, textAlign: 'center', color: 'error.main' }}>
                    <Typography variant="h6">{error || 'Không tìm thấy dữ liệu lương'}</Typography>
                </Box>
            </PageContainer>
        );
    }

    return (
        <PageContainer title="Payroll Detail" description="Employee payroll details">
            <DashboardCard>
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4" fontWeight="bold">
                        Phiếu lương tháng {payroll.month}/{payroll.year}
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <Button variant="outlined" startIcon={<IconPrinter />}>In phiếu lương</Button>
                        <Button variant="outlined" startIcon={<IconDownload />}>Tải xuống</Button>
                        <Button
                            variant="contained"
                            startIcon={<IconArrowBack />}
                            onClick={() => navigate('/manage/payroll/list')}
                        >
                            Quay lại
                        </Button>
                    </Stack>
                </Box>

                <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                    <Grid container spacing={3}>
                        {/* Header with company info */}
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Box>
                                    <Typography variant="h5" fontWeight="bold">CÔNG TY TNHH LD TECHNOLOGY</Typography>
                                    <Typography variant="body2">Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM</Typography>
                                    <Typography variant="body2">Điện thoại: (028) 1234 5678</Typography>
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography variant="h6" fontWeight="bold" color="primary">PHIẾU LƯƠNG</Typography>
                                    <Typography variant="body2">Kỳ lương: Tháng {payroll.month}/{payroll.year}</Typography>
                                    <Typography variant="body2">Mã phiếu: PL{payroll.month.toString().padStart(2, '0')}{payroll.year}-{employee.id}</Typography>
                                </Box>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                        </Grid>

                        {/* Employee Information */}
                        <Grid item xs={12} md={6}>
                            <Card sx={{ height: '100%', backgroundColor: theme.palette.background.default }}>
                                <CardContent>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        THÔNG TIN NHÂN VIÊN
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" color="text.secondary">Họ và tên:</Typography>
                                            <Typography variant="body1" fontWeight="medium">{employee.fullName || 'N/A'}</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" color="text.secondary">Phòng ban:</Typography>
                                            <Typography variant="body1">
                                                {getDepartmentNameByGroupId(employee.groupId)}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" color="text.secondary">Nhóm:</Typography>
                                            <Typography variant="body1">{employee.groupName || 'N/A'}</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" color="text.secondary">Số tài khoản ngân hàng:</Typography>
                                            <Typography variant="body1">{employee.bankNumber || 'N/A'}</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" color="text.secondary">Tên ngân hàng:</Typography>
                                            <Typography variant="body1">{employee.bankName || 'N/A'}</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" color="text.secondary">Số điện thoại:</Typography>
                                            <Typography variant="body1">{employee.phoneNumber || 'N/A'}</Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Working Information */}
                        <Grid item xs={12} md={6}>
                            <Card sx={{ height: '100%', backgroundColor: theme.palette.background.default }}>
                                <CardContent>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        THÔNG TIN CÔNG VIỆC
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" color="text.secondary">Số ngày làm:</Typography>
                                            <Typography variant="body1">{payroll.numberOfWorkingDays || 'N/A'} ngày</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" color="text.secondary">Trạng thái lương:</Typography>
                                            <Typography variant="body1">
                                                {payroll.note === 'Tiền lương đang được điều chỉnh' ? 'Điều chỉnh' : 'Ổn định'}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" color="text.secondary">Số ngày trễ:</Typography>
                                            <Typography variant="body1">{noteData.lateDays} ngày</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" color="text.secondary">Số ngày vắng:</Typography>
                                            <Typography variant="body1">{noteData.absentDays} ngày</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="body2" color="text.secondary">Ghi chú:</Typography>
                                            <Typography variant="body1">{payroll.note || 'Không có'}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="body2" color="text.secondary">Khoản khấu trừ:</Typography>
                                            <Typography variant="body1">
                                                {noteData.deductions.length > 0 ? formatCurrency(noteData.deductions[0].amount) : 'Không có'}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Salary Details */}
                        <Grid item xs={12}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
                                CHI TIẾT LƯƠNG
                            </Typography>
                            <TableContainer>
                                <Table sx={{ minWidth: 650 }}>
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: theme.palette.primary.light + '20' }}>
                                            <TableCell width="60%"><Typography fontWeight="bold">Khoản mục</Typography></TableCell>
                                            <TableCell align="right"><Typography fontWeight="bold">Số tiền (VNĐ)</Typography></TableCell>
                                            <TableCell align="right"><Typography fontWeight="bold">Ghi chú</Typography></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {/* Income section */}
                                        <TableRow sx={{ backgroundColor: theme.palette.background.default }}>
                                            <TableCell colSpan={3}>
                                                <Typography fontWeight="bold">I. TỔNG THU NHẬP</Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>1. Lương cơ bản</TableCell>
                                            <TableCell align="right">{formatCurrency(payroll.monthSalary)}</TableCell>
                                            <TableCell align="right"></TableCell>
                                        </TableRow>
                                        <TableRow sx={{ backgroundColor: theme.palette.success.light + '20' }}>
                                            <TableCell><Typography fontWeight="bold">TỔNG THU NHẬP (GROSS)</Typography></TableCell>
                                            <TableCell align="right">
                                                <Typography fontWeight="bold">{formatCurrency(calculateGrossTotal())}</Typography>
                                            </TableCell>
                                            <TableCell align="right"></TableCell>
                                        </TableRow>

                                        {/* Deductions section */}
                                        <TableRow sx={{ backgroundColor: theme.palette.background.default }}>
                                            <TableCell colSpan={3}>
                                                <Typography fontWeight="bold">II. CÁC KHOẢN KHẤU TRỪ</Typography>
                                            </TableCell>
                                        </TableRow>
                                        {noteData.deductions.length === 0 ? (
                                            <TableRow>
                                                <TableCell>Không có khấu trừ</TableCell>
                                                <TableCell align="right">0</TableCell>
                                                <TableCell align="right"></TableCell>
                                            </TableRow>
                                        ) : (
                                            noteData.deductions.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{index + 1}. {item.title}</TableCell>
                                                    <TableCell align="right">- {formatCurrency(item.amount)}</TableCell>
                                                    <TableCell align="right">Trễ: {noteData.lateDays}, Vắng: {noteData.absentDays}</TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                        <TableRow sx={{ backgroundColor: theme.palette.error.light + '20' }}>
                                            <TableCell><Typography fontWeight="bold">TỔNG KHẤU TRỪ</Typography></TableCell>
                                            <TableCell align="right">
                                                <Typography fontWeight="bold">- {formatCurrency(calculateDeductionsTotal())}</Typography>
                                            </TableCell>
                                            <TableCell align="right"></TableCell>
                                        </TableRow>

                                        {/* Net Salary */}
                                        <TableRow sx={{ backgroundColor: theme.palette.primary.light + '30' }}>
                                            <TableCell>
                                                <Typography variant="h6" fontWeight="bold">LƯƠNG THỰC LÃNH (NET)</Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography variant="h6" fontWeight="bold" color="primary.main">
                                                    {formatCurrency(calculateNetTotal())}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right"></TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </Paper>
            </DashboardCard>
        </PageContainer>
    );
};

export default PayrollDetail;