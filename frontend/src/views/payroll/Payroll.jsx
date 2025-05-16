import React, { useState } from 'react';
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
    Chip,
    Stack,
    useTheme
} from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { IconPrinter, IconDownload, IconMail } from '@tabler/icons-react';

// Mock data for employee salary
const employeeSalary = {
    personalInfo: {
        name: "Nguyễn Văn A",
        employeeId: "NV001",
        department: "Development Team",
        position: "Senior Developer",
        bankAccount: "19034857102",
        bankName: "Vietcombank",
        taxCode: "8721956302",
        joinDate: "01/06/2020"
    },
    salaryDetails: {
        month: 2,
        year: 2024,
        baseSalary: 15000000,
        workingDays: {
            standard: 22,
            actual: 21,
            overtime: 5,
            leave: 1
        },
        performance: {
            rating: "A",
            bonus: 3000000
        },
        additions: [
            { title: "Phụ cấp ăn trưa", amount: 1200000 },
            { title: "Phụ cấp xăng xe", amount: 500000 },
            { title: "Thưởng KPI", amount: 2000000 },
            { title: "Overtime (5 ngày)", amount: 1500000 },
        ],
        deductions: [
            { title: "Bảo hiểm xã hội (8%)", amount: 1200000 },
            { title: "Bảo hiểm y tế (1.5%)", amount: 225000 },
            { title: "Bảo hiểm thất nghiệp (1%)", amount: 150000 },
            { title: "Thuế thu nhập cá nhân", amount: 750000 },
        ],
    }
};

const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(value);
};

const Payroll = () => {
    const theme = useTheme();

    const calculateTotal = () => {
        const { baseSalary, additions, deductions, performance } = employeeSalary.salaryDetails;
        const additionsTotal = additions.reduce((sum, item) => sum + item.amount, 0);
        const deductionsTotal = deductions.reduce((sum, item) => sum + item.amount, 0);
        return baseSalary + performance.bonus + additionsTotal - deductionsTotal;
    };

    const calculateGrossTotal = () => {
        const { baseSalary, additions, performance } = employeeSalary.salaryDetails;
        const additionsTotal = additions.reduce((sum, item) => sum + item.amount, 0);
        return baseSalary + performance.bonus + additionsTotal;
    };

    const calculateDeductionsTotal = () => {
        const { deductions } = employeeSalary.salaryDetails;
        return deductions.reduce((sum, item) => sum + item.amount, 0);
    };

    return (
        <PageContainer title="Payslip" description="Monthly Salary Details">
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" fontWeight="bold">
                    Phiếu lương tháng {employeeSalary.salaryDetails.month}/{employeeSalary.salaryDetails.year}
                </Typography>
                <Stack direction="row" spacing={2}>
                    <Button variant="outlined" startIcon={<IconPrinter />}>
                        In phiếu lương
                    </Button>
                    <Button variant="outlined" startIcon={<IconDownload />}>
                        Tải xuống
                    </Button>
                    <Button variant="contained" startIcon={<IconMail />}>
                        Gửi email
                    </Button>
                </Stack>
            </Box>

            <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
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
                                <Typography variant="body2">Kỳ lương: Tháng {employeeSalary.salaryDetails.month}/{employeeSalary.salaryDetails.year}</Typography>
                                <Typography variant="body2">Mã phiếu: PL{employeeSalary.salaryDetails.month}{employeeSalary.salaryDetails.year}-{employeeSalary.personalInfo.employeeId}</Typography>
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
                                        <Typography variant="body1" fontWeight="medium">{employeeSalary.personalInfo.name}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Mã nhân viên:</Typography>
                                        <Typography variant="body1" fontWeight="medium">{employeeSalary.personalInfo.employeeId}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Phòng ban:</Typography>
                                        <Typography variant="body1">{employeeSalary.personalInfo.department}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Chức vụ:</Typography>
                                        <Typography variant="body1">{employeeSalary.personalInfo.position}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Mã số thuế:</Typography>
                                        <Typography variant="body1">{employeeSalary.personalInfo.taxCode}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Ngày vào công ty:</Typography>
                                        <Typography variant="body1">{employeeSalary.personalInfo.joinDate}</Typography>
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
                                        <Typography variant="body2" color="text.secondary">Số ngày công chuẩn:</Typography>
                                        <Typography variant="body1">{employeeSalary.salaryDetails.workingDays.standard} ngày</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Số ngày công thực tế:</Typography>
                                        <Typography variant="body1">{employeeSalary.salaryDetails.workingDays.actual} ngày</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Số ngày nghỉ phép:</Typography>
                                        <Typography variant="body1">{employeeSalary.salaryDetails.workingDays.leave} ngày</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Số ngày làm thêm:</Typography>
                                        <Typography variant="body1">{employeeSalary.salaryDetails.workingDays.overtime} ngày</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Xếp loại hiệu suất:</Typography>
                                        <Chip
                                            label={employeeSalary.salaryDetails.performance.rating}
                                            color="success"
                                            size="small"
                                            sx={{ fontWeight: 'bold' }}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Tài khoản ngân hàng:</Typography>
                                        <Typography variant="body1">{employeeSalary.personalInfo.bankAccount}</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="body2" color="text.secondary">Ngân hàng:</Typography>
                                        <Typography variant="body1">{employeeSalary.personalInfo.bankName}</Typography>
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
                                    {/* I. Income section */}
                                    <TableRow sx={{ backgroundColor: theme.palette.background.default }}>
                                        <TableCell colSpan={3}>
                                            <Typography fontWeight="bold">I. TỔNG THU NHẬP</Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>1. Lương cơ bản</TableCell>
                                        <TableCell align="right">{formatCurrency(employeeSalary.salaryDetails.baseSalary)}</TableCell>
                                        <TableCell align="right">
                                            {employeeSalary.salaryDetails.workingDays.actual}/{employeeSalary.salaryDetails.workingDays.standard} ngày
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>2. Thưởng hiệu suất</TableCell>
                                        <TableCell align="right">{formatCurrency(employeeSalary.salaryDetails.performance.bonus)}</TableCell>
                                        <TableCell align="right">Xếp loại {employeeSalary.salaryDetails.performance.rating}</TableCell>
                                    </TableRow>

                                    {/* Additions */}
                                    <TableRow>
                                        <TableCell>3. Các khoản phụ cấp</TableCell>
                                        <TableCell align="right"></TableCell>
                                        <TableCell align="right"></TableCell>
                                    </TableRow>
                                    {employeeSalary.salaryDetails.additions.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell sx={{ pl: 4 }}>{item.title}</TableCell>
                                            <TableCell align="right">{formatCurrency(item.amount)}</TableCell>
                                            <TableCell align="right"></TableCell>
                                        </TableRow>
                                    ))}

                                    {/* Gross total */}
                                    <TableRow sx={{ backgroundColor: theme.palette.success.light + '20' }}>
                                        <TableCell><Typography fontWeight="bold">TỔNG THU NHẬP (GROSS)</Typography></TableCell>
                                        <TableCell align="right">
                                            <Typography fontWeight="bold">{formatCurrency(calculateGrossTotal())}</Typography>
                                        </TableCell>
                                        <TableCell align="right"></TableCell>
                                    </TableRow>

                                    {/* II. Deductions section */}
                                    <TableRow sx={{ backgroundColor: theme.palette.background.default }}>
                                        <TableCell colSpan={3}>
                                            <Typography fontWeight="bold">II. CÁC KHOẢN KHẤU TRỪ</Typography>
                                        </TableCell>
                                    </TableRow>

                                    {/* Deductions */}
                                    {employeeSalary.salaryDetails.deductions.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}. {item.title}</TableCell>
                                            <TableCell align="right">- {formatCurrency(item.amount)}</TableCell>
                                            <TableCell align="right"></TableCell>
                                        </TableRow>
                                    ))}

                                    {/* Deductions total */}
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
                                                {formatCurrency(calculateTotal())}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right"></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>

                    {/* Signature section */}
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 2 }}>
                            <Box sx={{ textAlign: 'center', width: '30%' }}>
                                <Typography fontWeight="medium">NGƯỜI LẬP BẢNG</Typography>
                                <Typography variant="body2" color="text.secondary">(Ký, họ tên)</Typography>
                                <Box sx={{ height: 80 }}></Box>
                                <Typography>Nguyễn Thị B</Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center', width: '30%' }}>
                                <Typography fontWeight="medium">KẾ TOÁN TRƯỞNG</Typography>
                                <Typography variant="body2" color="text.secondary">(Ký, họ tên)</Typography>
                                <Box sx={{ height: 80 }}></Box>
                                <Typography>Trần Văn C</Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center', width: '30%' }}>
                                <Typography fontWeight="medium">GIÁM ĐỐC</Typography>
                                <Typography variant="body2" color="text.secondary">(Ký, họ tên, đóng dấu)</Typography>
                                <Box sx={{ height: 80 }}></Box>
                                <Typography>Lê Thị D</Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </PageContainer>
    );
};

export default Payroll;
