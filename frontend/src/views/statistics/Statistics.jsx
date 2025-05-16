import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    CircularProgress
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import {
    IconUsers,
    IconCurrencyDollar,
    IconChecklist,
    IconStar,
    IconChartBar,
    IconFileAnalytics,
    IconSchool
} from '@tabler/icons-react';

// Mock data (replace with API call)
const mockData = {
    totalEmployees: 150,
    monthlyPayroll: 750000000, // VND
    attendanceRate: 93.5, // Percentage
    avgPerformance: 85 // Percentage
};

const Statistics = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const theme = useTheme();
    const navigate = useNavigate();

    // Simulate API call (replace with actual ApiService.getOverview)
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            // Mock API response
            // const data = await ApiService.getOverview();
        }, 500);
    }, []);

    const summaryCards = [
        {
            title: 'Tổng số nhân viên',
            value: mockData.totalEmployees,
            icon: <IconUsers size={32} />,
            color: theme.palette.primary.main
        },
        {
            title: 'Bảng lương tháng',
            value: `${(mockData.monthlyPayroll / 1000000).toLocaleString()}M VND`,
            icon: <IconCurrencyDollar size={32} />,
            color: theme.palette.secondary.main
        },
        {
            title: 'Tỷ lệ điểm danh',
            value: `${mockData.attendanceRate}%`,
            icon: <IconChecklist size={32} />,
            color: theme.palette.success.main
        },
        {
            title: 'Hiệu suất công việc',
            value: `${mockData.avgPerformance}%`,
            icon: <IconStar size={32} />,
            color: theme.palette.warning.main
        }
    ];

    const navigationCards = [
        {
            title: 'Thống kê nhân viên',
            description: 'Phân tích nhân viên theo phòng ban, vai trò, và hiệu suất.',
            route: '/manage/statistics/employees',
            icon: <IconUsers size={48} />
        },
        {
            title: 'Thống kê bảng lương',
            description: 'Xem chi tiết lương, thưởng, và các khoản khấu trừ.',
            route: '/manage/statistics/payroll',
            icon: <IconCurrencyDollar size={48} />
        },
        {
            title: 'Thống kê điểm danh',
            description: 'Theo dõi tỷ lệ điểm danh và thời gian làm việc.',
            route: '/manage/statistics/attendance',
            icon: <IconChecklist size={48} />
        },
        {
            title: 'Thống kê hiệu suất',
            description: 'Đánh giá hiệu suất nhân viên và KPI.',
            route: '/manage/statistics/performance',
            icon: <IconStar size={48} />
        }
    ];

    const handleNavigate = (route) => {
        navigate(route);
    };

    if (loading) {
        return (
            <PageContainer title="Tổng quan nhân sự" description="Tổng quan hệ thống quản lý nhân sự">
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                    <CircularProgress />
                </Box>
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer title="Tổng quan nhân sự" description="Tổng quan hệ thống quản lý nhân sự">
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                    <Typography variant="h6" color="error">{error}</Typography>
                </Box>
            </PageContainer>
        );
    }

    return (
        <PageContainer title="Tổng quan nhân sự" description="Tổng quan hệ thống quản lý nhân sự">
            <DashboardCard>
                <Box sx={{ p: 4, backgroundColor: '#f5f5f5' }}>
                    {/* Header */}
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a202c', mb: 2 }}>
                        Tổng quan nhân sự
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 4 }}>
                        Xem các số liệu chính và truy cập các báo cáo chi tiết về nhân sự
                    </Typography>

                    {/* Summary Cards */}
                    <Grid container spacing={3} sx={{ mb: 6 }}>
                        {summaryCards.map((card, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Card
                                    sx={{
                                        backgroundColor: card.color,
                                        color: '#fff',
                                        transition: 'transform 0.3s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            boxShadow: theme.shadows[8]
                                        }
                                    }}
                                >
                                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        {card.icon}
                                        <Box>
                                            <Typography variant="h6">{card.title}</Typography>
                                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                                {card.value}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Navigation Cards */}
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#1a202c' }}>
                        Truy cập thống kê chi tiết
                    </Typography>
                    <Grid container spacing={3}>
                        {navigationCards.map((card, index) => (
                            <Grid item xs={12} md={6} key={index}>
                                <Card
                                    sx={{
                                        transition: 'transform 0.3s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            boxShadow: theme.shadows[8]
                                        }
                                    }}
                                >
                                    <CardContent sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                                        <Box sx={{ color: theme.palette.primary.main }}>
                                            {card.icon}
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                                {card.title}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                                                {card.description}
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                onClick={() => handleNavigate(card.route)}
                                                sx={{
                                                    backgroundColor: theme.palette.primary.main,
                                                    '&:hover': {
                                                        backgroundColor: theme.palette.primary.dark
                                                    }
                                                }}
                                            >
                                                Xem chi tiết
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </DashboardCard>
        </PageContainer>
    );
};

export default Statistics;