import React from 'react';
import {
    Grid,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { Button } from '@mui/material';
import { IconPlus } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer } from 'recharts';

// Move mock data to the top
const leaveRequests = [
    { 
        id: 1, 
        startDate: '2024-02-15', 
        endDate: '2024-02-16', 
        type: 'Nghỉ phép năm', 
        status: 'approved', 
        reason: 'Việc gia đình',
        approver: 'Nguyễn Văn B',
        approvedAt: '2024-02-14',
        duration: 2
    },
    { 
        id: 2, 
        startDate: '2024-02-20', 
        endDate: '2024-02-20', 
        type: 'Nghỉ ốm', 
        status: 'pending', 
        reason: 'Khám sức khỏe định kỳ',
        approver: null,
        approvedAt: null,
        duration: 1
    },
    { 
        id: 3, 
        startDate: '2024-03-01', 
        endDate: '2024-03-02', 
        type: 'Nghỉ không lương', 
        status: 'rejected', 
        reason: 'Du lịch cá nhân',
        approver: 'Trần Thị C',
        approvedAt: '2024-02-28',
        duration: 2
    },
];

const monthlyStats = [
    { month: 'T1', annual: 1, sick: 0, unpaid: 0, total: 1 },
    { month: 'T2', annual: 0, sick: 1, unpaid: 1, total: 2 },
    { month: 'T3', annual: 2, sick: 0, unpaid: 0, total: 2 },
    { month: 'T4', annual: 0, sick: 0, unpaid: 0, total: 0 },
    { month: 'T5', annual: 1, sick: 1, unpaid: 0, total: 2 },
    { month: 'T6', annual: 0, sick: 0, unpaid: 0, total: 0 },
];

const leaveTypesData = [
    { name: 'Nghỉ phép năm', value: 12, color: '#0088FE' },
    { name: 'Nghỉ ốm', value: 3, color: '#00C49F' },
    { name: 'Nghỉ không lương', value: 1, color: '#FFBB28' },
    { name: 'Nghỉ đặc biệt', value: 0, color: '#FF8042' }
];

const COLORS = leaveTypesData.map(item => item.color);

// Helper functions
const getStatusLabel = (status) => {
    switch (status) {
        case 'approved':
            return 'Đã duyệt';
        case 'pending':
            return 'Đang chờ';
        case 'rejected':
            return 'Từ chối';
        default:
            return 'Unknown';
    }
};

const getStatusColor = (status) => {
    switch (status) {
        case 'approved':
            return 'success';
        case 'pending':
            return 'warning';
        case 'rejected':
            return 'error';
        default:
            return 'default';
    }
};

const NLeave = () => {
    const navigate = useNavigate();

    return (
        <PageContainer title="Thống kê nghỉ phép" description="Theo dõi đơn xin nghỉ phép">
            <DashboardCard>
                {/* Header Section */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5">Thống kê nghỉ phép</Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<IconPlus />}
                        onClick={() => navigate('/leave')}
                    >
                        Tạo đơn xin nghỉ phép
                    </Button>
                </Box>

                <Grid container spacing={3}>
                    {/* Summary Section */}
                    <Grid item xs={12}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>Phép năm còn lại</Typography>
                                        <Typography variant="h3" color="primary">12</Typography>
                                        <Typography variant="body2" color="textSecondary">Tổng phép năm: 15 ngày</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>Đã sử dụng tháng này</Typography>
                                        <Typography variant="h3" color="warning.main">2</Typography>
                                        <Typography variant="body2" color="textSecondary">Ngày nghỉ phép</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>Đơn đang chờ duyệt</Typography>
                                        <Typography variant="h3" color="error.main">1</Typography>
                                        <Typography variant="body2" color="textSecondary">Đơn xin phép</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Charts Section */}
                    <Grid item xs={12}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={8}>
                                <Paper sx={{ p: 3, height: '100%' }}>
                                    <Typography variant="h6" gutterBottom>Thống kê nghỉ phép theo tháng</Typography>
                                    <Box sx={{ width: '100%', height: 300, display: 'flex', justifyContent: 'center' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={monthlyStats}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="month" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="annual" name="Nghỉ phép năm" fill="#0088FE" />
                                                <Bar dataKey="sick" name="Nghỉ ốm" fill="#00C49F" />
                                                <Bar dataKey="unpaid" name="Nghỉ không lương" fill="#FFBB28" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Paper sx={{ p: 3, height: '100%' }}>
                                    <Typography variant="h6" gutterBottom>Phân loại nghỉ phép</Typography>
                                    <Box sx={{ width: '100%', height: 300, display: 'flex', justifyContent: 'center' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={leaveTypesData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    outerRadius="80%"
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {leaveTypesData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Table Section */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>Đơn xin nghỉ phép gần đây</Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Ngày bắt đầu</TableCell>
                                            <TableCell>Ngày kết thúc</TableCell>
                                            <TableCell>Số ngày</TableCell>
                                            <TableCell>Loại nghỉ phép</TableCell>
                                            <TableCell>Lý do</TableCell>
                                            <TableCell>Người duyệt</TableCell>
                                            <TableCell>Trạng thái</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {leaveRequests.map((request) => (
                                            <TableRow key={request.id}>
                                                <TableCell>{request.startDate}</TableCell>
                                                <TableCell>{request.endDate}</TableCell>
                                                <TableCell>{request.duration} ngày</TableCell>
                                                <TableCell>{request.type}</TableCell>
                                                <TableCell>{request.reason}</TableCell>
                                                <TableCell>{request.approver || '—'}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={getStatusLabel(request.status)}
                                                        color={getStatusColor(request.status)}
                                                        size="small"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>
                </Grid>
            </DashboardCard>
        </PageContainer>
    );
};

export default NLeave;