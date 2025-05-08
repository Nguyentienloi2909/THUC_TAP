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
} from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';

// Mock data for employee salary
const employeeSalary = {
    personalInfo: {
        name: "Nguyễn Văn A",
        employeeId: "NV001",
        department: "Development Team",
        position: "Senior Developer",
    },
    salaryDetails: {
        month: 2,
        year: 2024,
        baseSalary: 15000000,
        workingDays: {
            standard: 22,
            actual: 21,
            overtime: 5
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
            { title: "Bảo hiểm xã hội", amount: 1200000 },
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
    const calculateTotal = () => {
        const { baseSalary, additions, deductions, performance } = employeeSalary.salaryDetails;
        const additionsTotal = additions.reduce((sum, item) => sum + item.amount, 0);
        const deductionsTotal = deductions.reduce((sum, item) => sum + item.amount, 0);
        return baseSalary + performance.bonus + additionsTotal - deductionsTotal;
    };

    return (
        <PageContainer title="Payslip" description="Monthly Salary Details">
            <DashboardCard>
                <Grid container spacing={3}>
                    {/* Employee Information Card */}
                    <Grid item xs={12}>
                        <Card sx={{ mb: 3, backgroundColor: '#f8f9fa' }}>
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="h6" gutterBottom>Thông tin nhân viên</Typography>
                                        <Typography>Họ và tên: {employeeSalary.personalInfo.name}</Typography>
                                        <Typography>ID: {employeeSalary.personalInfo.employeeId}</Typography>
                                        <Typography>Performance Rating: {employeeSalary.salaryDetails.performance.rating}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="h6" gutterBottom>Thông tin công việc</Typography>
                                        <Typography>Team: {employeeSalary.personalInfo.department}</Typography>
                                        <Typography>Vị trí: {employeeSalary.personalInfo.position}</Typography>
                                        <Typography>Số ngày làm việc: {employeeSalary.salaryDetails.workingDays.actual}/{employeeSalary.salaryDetails.workingDays.standard}</Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Salary Details */}
                    <Grid item xs={12}>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#f1f8ff' }}>
                                        <TableCell colSpan={2}>
                                            <Typography variant="h6">
                                                Payslip - {employeeSalary.salaryDetails.month}/{employeeSalary.salaryDetails.year}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Lương cơ bản (Gross)</TableCell>
                                        <TableCell align="right">{formatCurrency(employeeSalary.salaryDetails.baseSalary)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Performance Bonus</TableCell>
                                        <TableCell align="right">{formatCurrency(employeeSalary.salaryDetails.performance.bonus)}</TableCell>
                                    </TableRow>

                                    {/* Additions */}
                                    <TableRow sx={{ backgroundColor: '#f1f8ff' }}>
                                        <TableCell colSpan={2}><Typography variant="subtitle1">Các khoản cộng thêm</Typography></TableCell>
                                    </TableRow>
                                    {employeeSalary.salaryDetails.additions.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{item.title}</TableCell>
                                            <TableCell align="right">{formatCurrency(item.amount)}</TableCell>
                                        </TableRow>
                                    ))}

                                    {/* Deductions */}
                                    <TableRow sx={{ backgroundColor: '#fff4f4' }}>
                                        <TableCell colSpan={2}><Typography variant="subtitle1">Các khoản khấu trừ</Typography></TableCell>
                                    </TableRow>
                                    {employeeSalary.salaryDetails.deductions.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{item.title}</TableCell>
                                            <TableCell align="right">- {formatCurrency(item.amount)}</TableCell>
                                        </TableRow>
                                    ))}

                                    {/* Net Salary */}
                                    <TableRow sx={{ backgroundColor: '#f1f8ff' }}>
                                        <TableCell><Typography variant="subtitle1">Lương thực lãnh (Net)</Typography></TableCell>
                                        <TableCell align="right">
                                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                                                {formatCurrency(calculateTotal())}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </DashboardCard>
        </PageContainer>
    );
};

export default Payroll;
