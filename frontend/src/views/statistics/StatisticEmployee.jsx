import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    CircularProgress
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
// Remove the duplicate import of useNavigate
// import { useNavigate } from 'react-router-dom';
import Chart from 'react-apexcharts';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { IconUsers, IconSwitchHorizontal, IconClock, IconArrowLeft, IconDownload } from '@tabler/icons-react';

// Mock data (replace with API call)
const mockData = {
    all: {
        summary: {
            totalEmployees: 150,
            turnoverRate: 8.5, // Percentage
            avgTenure: 3.2, // Years
            genderRatio: '52% Nam / 48% Nữ'
        },
        lineData: [
            { name: 'Số nhân viên', data: [145, 146, 148, 150, 149, 150, 152, 153, 155, 154, 150, 150] }
        ],
        barData: [
            { name: 'Số nhân viên', data: [50, 30, 40, 30] }
        ],
        pieData: [
            { name: 'Nam', value: 78 },
            { name: 'Nữ', value: 72 }
        ]
    },
    department: {
        barCategories: ['Kỹ thuật', 'Nhân sự', 'Kinh doanh', 'Tài chính']
    },
    role: {
        barCategories: ['Quản lý', 'Nhân viên', 'Thực tập sinh']
    }
};

const StatisticEmployee = () => {
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [timeFilter, setTimeFilter] = useState('yearly');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const theme = useTheme();
    const navigate = useNavigate();

    // Simulate API call
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            // Replace with: ApiService.getEmployeeStatistics(categoryFilter, timeFilter)
        }, 500);
    }, [categoryFilter, timeFilter]);

    const handleCategoryFilterChange = (event) => {
        setCategoryFilter(event.target.value);
    };

    const handleTimeFilterChange = (event) => {
        setTimeFilter(event.target.value);
    };

    const handleExport = () => {
        console.log('Exporting employee statistics as CSV/PDF');
        // Implement export logic
    };

    const handleBack = () => {
        navigate('/manage/statistics');
    };

    // Chart configurations
    const lineChartOptions = {
        chart: {
            type: 'line',
            toolbar: { show: true },
            animations: { enabled: true }
        },
        colors: [theme.palette.primary.main],
        xaxis: {
            categories: ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'],
            title: { text: 'Tháng' }
        },
        yaxis: {
            title: { text: 'Số nhân viên' }
        },
        tooltip: {
            theme: theme.palette.mode === 'dark' ? 'dark' : 'light'
        },
        legend: { position: 'top' }
    };

    const barChartOptions = {
        chart: {
            type: 'bar',
            toolbar: { show: true },
            animations: { enabled: true }
        },
        colors: [theme.palette.primary.main],
        xaxis: {
            categories: mockData[categoryFilter].barCategories || ['Kỹ thuật', 'Nhân sự', 'Kinh doanh', 'Tài chính'],
            title: { text: categoryFilter === 'department' ? 'Phòng ban' : 'Vai trò' }
        },
        yaxis: {
            title: { text: 'Số nhân viên' }
        },
        plotOptions: {
            bar: { horizontal: false, columnWidth: '55%' }
        },
        dataLabels: { enabled: false },
        tooltip: {
            theme: theme.palette.mode === 'dark' ? 'dark' : 'light'
        },
        legend: { position: 'top' }
    };

    const pieChartOptions = {
        chart: {
            type: 'pie',
            toolbar: { show: true },
            animations: { enabled: true }
        },
        colors: [theme.palette.primary.main, theme.palette.secondary.main],
        labels: mockData.all.pieData.map(item => item.name),
        legend: { position: 'bottom' },
        tooltip: {
            theme: theme.palette.mode === 'dark' ? 'dark' : 'light'
        }
    };

    const data = mockData.all;

    if (loading) {
        return (
            <PageContainer title="Thống kê nhân viên" description="Xem thống kê nhân viên">
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                    <CircularProgress />
                </Box>
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer title="Thống kê nhân viên" description="Xem thống kê nhân viên">
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                    <Typography variant="h6" color="error">{error}</Typography>
                </Box>
            </PageContainer>
        );
    }

    return (
        <PageContainer title="Thống kê nhân viên" description="Xem thống kê nhân viên">
            <DashboardCard>
                <Box sx={{ p: 4 }}>
                    <Button
                        variant="outlined"
                        startIcon={<IconArrowLeft />}
                        onClick={handleBack}
                        sx={{
                            mb: 5,
                            fontSize: '0.95rem',
                            borderRadius: 1,
                            borderColor: '#1976d2',
                            color: '#1976d2',
                            '&:hover': {
                                backgroundColor: '#e3f2fd',
                                borderColor: '#1565c0'
                            }
                        }}
                    >
                        Trở lại
                    </Button>
                    {/* Header */}
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a202c', mb: 1 }}>
                        Thống kê nhân viên
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 4 }}>
                        Phân tích dữ liệu nhân viên theo phòng ban, vai trò, và các chỉ số nhân sự khác
                    </Typography>

                    {/* Filters */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel>Danh mục</InputLabel>
                            <Select
                                value={categoryFilter}
                                onChange={handleCategoryFilterChange}
                                label="Danh mục"
                            >
                                <MenuItem value="all">Tất cả</MenuItem>
                                <MenuItem value="department">Theo phòng ban</MenuItem>
                                <MenuItem value="role">Theo vai trò</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel>Khoảng thời gian</InputLabel>
                            <Select
                                value={timeFilter}
                                onChange={handleTimeFilterChange}
                                label="Khoảng thời gian"
                            >
                                <MenuItem value="monthly">Hàng tháng</MenuItem>
                                <MenuItem value="quarterly">Hàng quý</MenuItem>
                                <MenuItem value="yearly">Hàng năm</MenuItem>
                            </Select>
                        </FormControl>
                        {/* <Button
                            variant="outlined"
                            startIcon={<IconArrowBackUp />}
                            onClick={handleBack}
                            sx={{ ml: 'auto' }}
                        >
                            Quay lại
                        </Button> */}
                        <Button
                            variant="outlined"
                            startIcon={<IconDownload />}
                            onClick={handleExport}
                        >
                            Xuất dữ liệu
                        </Button>
                    </Box>

                    {/* Summary Cards */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ backgroundColor: theme.palette.primary.main, color: '#fff', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)', boxShadow: theme.shadows[8] } }}>
                                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <IconUsers size={32} />
                                    <Box>
                                        <Typography variant="h6">Tổng số nhân viên</Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 700 }}>{data.summary.totalEmployees}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ backgroundColor: theme.palette.secondary.main, color: '#fff', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)', boxShadow: theme.shadows[8] } }}>
                                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <IconSwitchHorizontal size={32} />
                                    <Box>
                                        <Typography variant="h6">Tỷ lệ nghỉ việc</Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 700 }}>{data.summary.turnoverRate}%</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ backgroundColor: theme.palette.success.main, color: '#fff', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)', boxShadow: theme.shadows[8] } }}>
                                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <IconClock size={32} />
                                    <Box>
                                        <Typography variant="h6">Thâm niên trung bình</Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 700 }}>{data.summary.avgTenure} năm</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ backgroundColor: theme.palette.warning.main, color: '#fff', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)', boxShadow: theme.shadows[8] } }}>
                                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <IconUsers size={32} />
                                    <Box>
                                        <Typography variant="h6">Tỷ lệ giới tính</Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 700 }}>{data.summary.genderRatio}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Charts */}
                    <Grid container spacing={3}>
                        {/* Bar Chart */}
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Số nhân viên theo {categoryFilter === 'department' ? 'phòng ban' : 'vai trò'}
                                    </Typography>
                                    <Chart
                                        options={barChartOptions}
                                        series={data.barData}
                                        type="bar"
                                        height="350"
                                    />
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Pie Chart */}
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Phân bố giới tính
                                    </Typography>
                                    <Chart
                                        options={pieChartOptions}
                                        series={data.pieData.map(item => item.value)}
                                        type="pie"
                                        height="350"
                                    />
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Line Chart */}
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Xu hướng số nhân viên
                                    </Typography>
                                    <Chart
                                        options={lineChartOptions}
                                        series={data.lineData}
                                        type="line"
                                        height="400"
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            </DashboardCard>
        </PageContainer>
    );
};

export default StatisticEmployee;