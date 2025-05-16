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
    CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Chart from 'react-apexcharts';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import {
    IconArrowLeft,
    IconDownload,
    IconCurrencyDollar,
    IconTrendingUp,
    IconTrendingDown,
    IconUsers,
} from '@tabler/icons-react';

// 👉 Mock data
const mockData = {
    all: {
        summary: {
            totalPayroll: 120000000,
            avgSalary: 8000000,
            highestSalary: 20000000,
            lowestSalary: 4500000,
        },
        lineData: [
            {
                name: 'Quỹ lương',
                data: [100000000, 105000000, 108000000, 115000000, 118000000, 120000000],
            },
        ],
        barData: [
            {
                name: 'Lương trung bình',
                data: [10000000, 9000000, 7500000, 8500000],
            },
        ],
        topDepartmentPayroll: [
            { name: 'Kỹ thuật', value: 45000000 },
            { name: 'Kinh doanh', value: 30000000 },
            { name: 'Tài chính', value: 25000000 },
            { name: 'Nhân sự', value: 20000000 },
        ],
    },
    department: {
        barCategories: ['Kỹ thuật', 'Nhân sự', 'Kinh doanh', 'Tài chính'],
    },
    role: {
        barCategories: ['Quản lý', 'Nhân viên', 'Thực tập sinh'],
    },
};

const StatisticPayroll = () => {
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [timeFilter, setTimeFilter] = useState('yearly');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const theme = useTheme();
    const navigate = useNavigate();

    const data = mockData.all;

    const currencyFormat = (num) =>
        num.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [categoryFilter, timeFilter]);

    const handleCategoryFilterChange = (e) => {
        setCategoryFilter(e.target.value);
    };

    const handleTimeFilterChange = (e) => {
        setTimeFilter(e.target.value);
    };

    const handleExport = () => {
        console.log('Exporting payroll statistics...');
    };

    const handleBack = () => {
        navigate('/manage/statistics');
    };

    // 👉 Chart Configs
    const lineChartOptions = {
        chart: { type: 'line', toolbar: { show: true }, animations: { enabled: true } },
        stroke: { curve: 'smooth', width: 3 },
        markers: {
            size: 5,
            colors: ['#fff'],
            strokeWidth: 2,
        },
        colors: [theme.palette.primary.main],
        xaxis: {
            categories: ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6'],
            title: { text: 'Tháng' },
        },
        yaxis: {
            labels: { formatter: (val) => `${(val / 1_000_000).toFixed(1)}tr` },
            title: { text: 'Quỹ lương (VNĐ)' },
        },
        tooltip: {
            y: {
                formatter: (val) => currencyFormat(val),
            },
            theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
        },
        legend: { position: 'top' },
    };

    const barChartOptions = {
        chart: { type: 'bar', toolbar: { show: false } },
        colors: [theme.palette.success.main],
        xaxis: {
            categories: mockData[categoryFilter].barCategories || [],
            title: { text: categoryFilter === 'department' ? 'Phòng ban' : 'Vai trò' },
        },
        yaxis: {
            labels: { formatter: (val) => `${(val / 1_000_000).toFixed(1)}tr` },
            title: { text: 'Lương trung bình (VNĐ)' },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                dataLabels: { position: 'top' },
            },
        },
        dataLabels: {
            enabled: true,
            formatter: (val) => `${(val / 1_000_000).toFixed(1)}tr`,
            style: {
                fontSize: '12px',
                colors: ['#333'],
            },
        },
        tooltip: {
            y: {
                formatter: (val) => currencyFormat(val),
            },
            theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
        },
        legend: { show: false },
    };

    const topDeptOptions = {
        chart: { type: 'bar', toolbar: { show: false } },
        colors: [theme.palette.warning.main],
        xaxis: {
            categories: data.topDepartmentPayroll.map((d) => d.name),
            title: { text: 'Phòng ban' },
        },
        plotOptions: {
            bar: {
                horizontal: true,
                barHeight: '60%',
            },
        },
        dataLabels: {
            enabled: true,
            formatter: (val) => currencyFormat(val),
            style: {
                fontSize: '13px',
                colors: ['#000'],
            },
        },
        tooltip: {
            y: {
                formatter: (val) => currencyFormat(val),
            },
        },
        yaxis: {
            title: { text: 'Phòng ban' },
        },
        legend: { show: false },
    };

    if (loading) {
        return (
            <PageContainer title="Thống kê bảng lương" description="Đang tải dữ liệu...">
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
                    <CircularProgress />
                </Box>
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer title="Thống kê bảng lương" description="Lỗi khi tải dữ liệu">
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
                    <Typography color="error">{error}</Typography>
                </Box>
            </PageContainer>
        );
    }

    return (
        <PageContainer title="Thống kê bảng lương" description="Phân tích lương theo danh mục và thời gian">
            <DashboardCard>
                <Box sx={{ p: 4 }}>
                    <Button
                        variant="outlined"
                        startIcon={<IconArrowLeft />}
                        onClick={handleBack}
                        sx={{
                            mb: 4,
                            fontSize: '0.95rem',
                            borderColor: '#1976d2',
                            color: '#1976d2',
                            '&:hover': {
                                backgroundColor: '#e3f2fd',
                                borderColor: '#1565c0',
                            },
                        }}
                    >
                        Trở lại
                    </Button>

                    <Typography variant="h4" fontWeight={700} mb={1}>
                        Thống kê bảng lương
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" mb={4}>
                        Phân tích chi tiết về quỹ lương, lương trung bình và theo phòng ban
                    </Typography>

                    {/* Filters */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel>Danh mục</InputLabel>
                            <Select value={categoryFilter} onChange={handleCategoryFilterChange} label="Danh mục">
                                <MenuItem value="all">Tất cả</MenuItem>
                                <MenuItem value="department">Theo phòng ban</MenuItem>
                                <MenuItem value="role">Theo vai trò</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel>Khoảng thời gian</InputLabel>
                            <Select value={timeFilter} onChange={handleTimeFilterChange} label="Khoảng thời gian">
                                <MenuItem value="monthly">Hàng tháng</MenuItem>
                                <MenuItem value="quarterly">Hàng quý</MenuItem>
                                <MenuItem value="yearly">Hàng năm</MenuItem>
                            </Select>
                        </FormControl>
                        <Button variant="outlined" startIcon={<IconDownload />} onClick={handleExport}>
                            Xuất dữ liệu
                        </Button>
                    </Box>

                    {/* Summary Cards */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ backgroundColor: theme.palette.primary.main, color: '#fff' }}>
                                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <IconCurrencyDollar size={32} />
                                    <Box>
                                        <Typography>Tổng quỹ lương</Typography>
                                        <Typography variant="h5" fontWeight={700}>
                                            {currencyFormat(data.summary.totalPayroll)}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ backgroundColor: theme.palette.secondary.main, color: '#fff' }}>
                                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <IconUsers size={32} />
                                    <Box>
                                        <Typography>Lương trung bình</Typography>
                                        <Typography variant="h5" fontWeight={700}>
                                            {currencyFormat(data.summary.avgSalary)}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ backgroundColor: theme.palette.success.main, color: '#fff' }}>
                                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <IconTrendingUp size={32} />
                                    <Box>
                                        <Typography>Lương cao nhất</Typography>
                                        <Typography variant="h5" fontWeight={700}>
                                            {currencyFormat(data.summary.highestSalary)}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ backgroundColor: theme.palette.error.main, color: '#fff' }}>
                                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <IconTrendingDown size={32} />
                                    <Box>
                                        <Typography>Lương thấp nhất</Typography>
                                        <Typography variant="h5" fontWeight={700}>
                                            {currencyFormat(data.summary.lowestSalary)}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Charts */}
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Lương theo {categoryFilter === 'department' ? 'phòng ban' : 'vai trò'}
                                    </Typography>
                                    <Chart options={barChartOptions} series={data.barData} type="bar" height={350} />
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Top phòng ban có quỹ lương cao nhất
                                    </Typography>
                                    <Chart
                                        options={topDeptOptions}
                                        series={[
                                            {
                                                name: 'Quỹ lương',
                                                data: data.topDepartmentPayroll.map((item) => item.value),
                                            },
                                        ]}
                                        type="bar"
                                        height={350}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Xu hướng quỹ lương
                                    </Typography>
                                    <Chart options={lineChartOptions} series={data.lineData} type="line" height={400} />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            </DashboardCard>
        </PageContainer>
    );
};

export default StatisticPayroll;
