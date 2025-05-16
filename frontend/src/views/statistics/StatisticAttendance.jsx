import React, { useState, useEffect, useMemo } from 'react';
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
import Chart from 'react-apexcharts';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { IconDownload, IconArrowLeft } from '@tabler/icons-react';
import ApiService from '../../service/ApiService';

// Custom function to convert array to CSV string
const arrayToCSV = (data) => {
    return data
        .map(row =>
            row
                .map(value => {
                    const stringValue = String(value ?? '');
                    if (stringValue.includes(',') || stringValue.includes('"')) {
                        return `"${stringValue.replace(/"/g, '""')}"`;
                    }
                    return stringValue;
                })
                .join(',')
        )
        .join('\n');
};

const StatisticAttendance = () => {
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [timeFilter, setTimeFilter] = useState('yearly');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const navigate = useNavigate();
    const theme = useTheme();
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                let response;
                if (timeFilter === 'yearly') {
                    response = await ApiService.getTKAttendanceToYear(new Date().getFullYear());
                } else if (timeFilter === 'monthly') {
                    response = await ApiService.getTKAttendanceToMonth(new Date().getMonth() + 1, new Date().getFullYear());
                } else if (timeFilter === 'weekly') {
                    response = await ApiService.getTKAttendanceToWeek();
                } else {
                    throw new Error('Unsupported time filter');
                }
                setData(response);
            } catch (err) {
                setError(err.message || 'Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [timeFilter]);

    const handleCategoryFilterChange = (event) => {
        setCategoryFilter(event.target.value);
    };

    const handleTimeFilterChange = (event) => {
        setTimeFilter(event.target.value);
    };

    const handleExport = () => {
        if (!data) return;

        const csvData = [
            ['Metric', 'Value'],
            ['Total Employees', data.summary?.totalEmployees || 'N/A'],
            ['Present Today', data.summary?.presentToday || 'N/A'],
            ['Absent Today', data.summary?.absentToday || 'N/A'],
            ['Average Performance', data.summary?.avgPerformance || 'N/A']
        ];

        const csv = arrayToCSV(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'attendance_statistics.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleBack = () => {
        navigate('/manage/statistics');
    };

    const lineChartOptions = useMemo(() => ({
        chart: {
            type: 'line',
            toolbar: { show: true },
            animations: { enabled: true }
        },
        colors: [primary, secondary],
        xaxis: {
            categories: data?.lineData?.[0]?.xaxisCategories || [],
            title: { text: timeFilter === 'yearly' ? 'Tháng' : timeFilter === 'monthly' ? 'Ngày' : 'Ngày trong tuần' }
        },
        yaxis: {
            title: { text: 'Số nhân viên' }
        },
        tooltip: {
            theme: theme.palette.mode === 'dark' ? 'dark' : 'light'
        },
        legend: { position: 'top' }
    }), [data, timeFilter, theme, primary, secondary]);

    const barChartOptions = useMemo(() => ({
        chart: {
            type: 'bar',
            toolbar: { show: true },
            animations: { enabled: true }
        },
        colors: [primary, secondary],
        xaxis: {
            categories: data?.barData?.categories || [],
            title: { text: categoryFilter === 'department' ? 'Phòng ban' : categoryFilter === 'role' ? 'Vai trò' : 'Danh mục' }
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
    }), [data, categoryFilter, theme, primary, secondary]);

    const pieChartOptions = useMemo(() => ({
        chart: {
            type: 'pie',
            toolbar: { show: true },
            animations: { enabled: true }
        },
        colors: [primary, secondary, theme.palette.warning.main, theme.palette.success.main],
        labels: data?.pieData?.map(item => item.name) || [],
        legend: { position: 'bottom' },
        tooltip: {
            theme: theme.palette.mode === 'dark' ? 'dark' : 'light'
        }
    }), [data, theme, primary, secondary]);

    if (loading) {
        return (
            <PageContainer title="Thống kê nhân sự" description="Xem thống kê nhân sự">
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                    <CircularProgress />
                </Box>
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer title="Thống kê nhân sự" description="Xem thống kê nhân sự">
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                    <Typography variant="h6" color="error">{error}</Typography>
                </Box>
            </PageContainer>
        );
    }

    return (
        <PageContainer title="Thống kê nhân sự" description="Xem thống kê nhân sự">
            <DashboardCard>
                <Box sx={{ p: 3 }}>
                    <Button
                        variant="outlined"
                        startIcon={<IconArrowLeft aria-label="back icon" />}
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
                        aria-label="Go back"
                    >
                        Trở lại
                    </Button>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a202c', mb: 1 }}>
                        Thống kê nhân sự
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 4 }}>
                        Phân tích dữ liệu nhân sự theo phòng ban, vai trò và thời gian
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
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
                                <MenuItem value="weekly">Hàng tuần</MenuItem>
                                <MenuItem value="yearly">Hàng năm</MenuItem>
                            </Select>
                        </FormControl>
                        <Button
                            variant="outlined"
                            startIcon={<IconDownload aria-label="download icon" />}
                            onClick={handleExport}
                            sx={{ ml: 'auto' }}
                            aria-label="Export data"
                        >
                            Xuất dữ liệu
                        </Button>
                    </Box>

                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ backgroundColor: primary, color: '#fff' }}>
                                <CardContent>
                                    <Typography variant="h6">Tổng số nhân viên</Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                        {data?.summary?.totalEmployees || 'N/A'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ backgroundColor: secondary, color: '#fff' }}>
                                <CardContent>
                                    <Typography variant="h6">Có mặt hôm nay</Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                        {data?.summary?.presentToday || 'N/A'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ backgroundColor: theme.palette.warning.main, color: '#fff' }}>
                                <CardContent>
                                    <Typography variant="h6">Vắng hôm nay</Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                        {data?.summary?.absentToday || 'N/A'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ backgroundColor: theme.palette.success.main, color: '#fff' }}>
                                <CardContent>
                                    <Typography variant="h6">Điểm hiệu suất TB</Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                        {data?.summary?.avgPerformance || 'N/A'}%
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Xu hướng điểm danh
                                    </Typography>
                                    <Chart
                                        options={lineChartOptions}
                                        series={data?.lineData || []}
                                        type="line"
                                        height="350"
                                    />
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Điểm danh theo {categoryFilter === 'department' ? 'phòng ban' : categoryFilter === 'role' ? 'vai trò' : 'danh mục'}
                                    </Typography>
                                    <Chart
                                        options={barChartOptions}
                                        series={data?.barData?.series || []}
                                        type="bar"
                                        height="350"
                                    />
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Phân bố nhân viên
                                    </Typography>
                                    <Chart
                                        options={pieChartOptions}
                                        series={data?.pieData?.map(item => item.value) || []}
                                        type="pie"
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

export default StatisticAttendance;