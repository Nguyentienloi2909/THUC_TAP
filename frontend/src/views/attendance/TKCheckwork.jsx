import React, { useState } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Grid,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
} from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer
} from 'recharts';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { format, addMonths, subMonths } from 'date-fns';
import { vi } from 'date-fns/locale';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import CheckTools from './components/CheckTools';

// Mock data for the current month
const monthlyStats = {
    totalDays: 22,
    workDays: 18,
    lateDays: 2,
    earlyLeaveDays: 1,
    absentDays: 1,
    onTimeDays: 15,
    workHours: 144
};

const COLORS = ['#4caf50', '#f44336', '#ff9800', '#2196f3'];

const TKCheckwork = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [openDialog, setOpenDialog] = useState(false);
    const [actionType, setActionType] = useState('');

    const handleMonthChange = (direction) => {
        setCurrentDate(direction === 'next' ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
    };

    const handleCheckIn = () => {
        setActionType('Check-in');
        setOpenDialog(true);
    };

    const handleCheckOut = () => {
        setActionType('Check-out');
        setOpenDialog(true);
    };

    const handleConfirm = () => {
        setOpenDialog(false);
        console.log(`${actionType} confirmed`);
        // Implement check-in or check-out logic here
    };

    const pieData = [
        { name: 'Đúng giờ', value: monthlyStats.onTimeDays },
        { name: 'Đi muộn', value: monthlyStats.lateDays },
        { name: 'Về sớm', value: monthlyStats.earlyLeaveDays },
        { name: 'Nghỉ', value: monthlyStats.absentDays }
    ];

    const barData = [
        { name: 'Tuần 1', onTime: 4, late: 1, early: 0, absent: 0 },
        { name: 'Tuần 2', onTime: 3, late: 1, early: 1, absent: 0 },
        { name: 'Tuần 3', onTime: 4, late: 0, early: 0, absent: 1 },
        { name: 'Tuần 4', onTime: 4, late: 0, early: 0, absent: 0 }
    ];

    return (
        <PageContainer title="Thống kê chấm công" description="Xem thống kê chấm công">
            <DashboardCard>
                <Box mb={2}>
                    <CheckTools onCheckIn={handleCheckIn} onCheckOut={handleCheckOut} />
                </Box>

                {/* Confirmation Dialog */}
                <Dialog
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                >
                    <DialogTitle>
                        Xác nhận {actionType}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Bạn có muốn thực hiện thao tác {actionType}?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>
                            Hủy
                        </Button>
                        <Button onClick={handleConfirm} color="primary" variant="contained">
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>

                <Box sx={{ p: 3, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 3
                    }}>
                        <Typography variant="h6" sx={{ color: '#2c3e50' }}>
                            Thống kê chấm công tháng
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <IconButton onClick={() => handleMonthChange('prev')}>
                                <IconChevronLeft />
                            </IconButton>
                            <Typography variant="h6" sx={{ minWidth: 200, textAlign: 'center' }}>
                                {format(currentDate, 'MMMM yyyy', { locale: vi })}
                            </Typography>
                            <IconButton onClick={() => handleMonthChange('next')}>
                                <IconChevronRight />
                            </IconButton>
                        </Box>
                    </Box>

                    <Grid container spacing={3}>
                        {/* Summary Cards */}
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Tổng quan
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        <Typography>Tổng số ngày làm việc: {monthlyStats.workDays}/{monthlyStats.totalDays}</Typography>
                                        <Typography>Tổng số giờ làm việc: {monthlyStats.workHours}h</Typography>
                                        <Typography color="success.main">Số ngày đúng giờ: {monthlyStats.onTimeDays}</Typography>
                                        <Typography color="error.main">Số ngày đi muộn: {monthlyStats.lateDays}</Typography>
                                        <Typography color="warning.main">Số ngày về sớm: {monthlyStats.earlyLeaveDays}</Typography>
                                        <Typography color="info.main">Số ngày nghỉ: {monthlyStats.absentDays}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Pie Chart */}
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Tỷ lệ chấm công
                                    </Typography>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                fill="#8884d8"
                                                paddingAngle={5}
                                                dataKey="value"
                                                label
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Bar Chart */}
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Thống kê theo tuần
                                    </Typography>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={barData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="onTime" name="Đúng giờ" fill="#4caf50" />
                                            <Bar dataKey="late" name="Đi muộn" fill="#f44336" />
                                            <Bar dataKey="early" name="Về sớm" fill="#ff9800" />
                                            <Bar dataKey="absent" name="Nghỉ" fill="#2196f3" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            </DashboardCard>
        </PageContainer>
    );
};

export default TKCheckwork;