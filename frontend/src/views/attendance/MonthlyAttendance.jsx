import React, { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    IconButton, Box, Typography, Chip, CircularProgress, Alert, TablePagination
} from '@mui/material';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import AttendanceMiniTools from './components/AttendanceMiniTools';
import ApiService from '../../service/ApiService';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const MonthlyAttendance = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(10);

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log('Fetching attendance data for:', { month: currentMonth + 1, year: currentYear });
                
                const response = await ApiService.getAttendance(currentMonth + 1, currentYear);
                console.log('API Response:', response);
                
                if (!Array.isArray(response)) {
                    throw new Error('Dữ liệu chấm công không hợp lệ');
                }

                // Group data by user
                const groupedData = response.reduce((acc, item) => {
                    if (!acc[item.userFullName]) {
                        acc[item.userFullName] = { userId: item.userId, days: {} };
                    }
                    const date = new Date(item.workday).getDate();
                    console.log('Processing workday:', item.workday, 'for user:', item.userFullName, 'date:', date, 'status:', item.status);
                    
                    acc[item.userFullName].days[date] = item.status;
                    return acc;
                }, {});

                console.log('Grouped attendance data:', groupedData);
                console.log('Final attendance data array:', Object.entries(groupedData));
                
                setAttendanceData(Object.entries(groupedData));
            } catch (err) {
                console.error('Error in fetchAttendance:', err);
                setError(err.message || 'Không thể tải dữ liệu chấm công');
            } finally {
                setLoading(false);
            }
        };

        if (ApiService.isAdmin()) {
            console.log('User is admin, fetching attendance data');
            fetchAttendance();
        } else {
            console.log('User is not admin, showing error');
            setError('Bạn không có quyền xem dữ liệu chấm công của tất cả nhân viên');
            setLoading(false);
        }
    }, [currentMonth, currentYear]);

    const handleMonthChange = (direction) => {
        console.log('Changing month:', direction);
        setCurrentMonth((prevMonth) => {
            let newMonth = direction === 'next' ? prevMonth + 1 : prevMonth - 1;
            if (newMonth < 0) {
                newMonth = 11;
                console.log('Year decreased, new year:', currentYear - 1);
                setCurrentYear((prevYear) => prevYear - 1);
            } else if (newMonth > 11) {
                newMonth = 0;
                console.log('Year increased, new year:', currentYear + 1);
                setCurrentYear((prevYear) => prevYear + 1);
            }
            console.log('New month:', newMonth + 1);
            return newMonth;
        });
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        console.log('Changing page to:', newPage);
        setPage(newPage);
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'Present': return 'Có mặt';
            case 'Late': return 'Đi muộn';
            case 'Pending': return 'Nghỉ';
            case 'Leave': return 'Nghỉ có phép';
            default: return 'N/A';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Present': return 'success';
            case 'Late': return 'error';
            case 'Pending': return 'default';
            case 'Leave': return 'warning';
            default: return 'default';
        }
    };

    if (loading) {
        return (
            <PageContainer title="Lịch sử chấm công tháng" description="Lịch sử chấm công tháng">
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                    <CircularProgress />
                </Box>
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer title="Lịch sử chấm công tháng" description="Lịch sử chấm công tháng">
                <Box sx={{ p: 3 }}>
                    <Alert severity="error">{error}</Alert>
                </Box>
            </PageContainer>
        );
    }

    return (
        <PageContainer title="Lịch sử chấm công tháng" description="Lịch sử chấm công tháng">
            <DashboardCard title="Lịch sử chấm công tháng">
                <AttendanceMiniTools />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <IconButton onClick={() => handleMonthChange('prev')}>
                        <IconChevronLeft />
                    </IconButton>
                    <Typography variant="h6">
                        Tháng {currentMonth + 1} Năm {currentYear}
                    </Typography>
                    <IconButton onClick={() => handleMonthChange('next')}>
                        <IconChevronRight />
                    </IconButton>
                </Box>
                <TableContainer component={Paper}>
                    <Table sx={{
                        minWidth: 650,
                        '& .MuiTableCell-root': {
                            border: '1px solid rgba(224, 224, 224, 1)',
                            padding: '8px'
                        },
                        '& .MuiTableHead-root': {
                            '& .MuiTableRow-root': {
                                backgroundColor: '#e3f2fd'
                            }
                        }
                    }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nhân viên</TableCell>
                                {Array.from({ length: daysInMonth }, (_, i) => (
                                    <TableCell key={i} align="center">{i + 1}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {attendanceData
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map(([user, data]) => (
                                    <TableRow key={user}>
                                        <TableCell>{user}</TableCell>
                                        {Array.from({ length: daysInMonth }, (_, i) => (
                                            <TableCell key={i} align="center">
                                                {data.days[i + 1] ? (
                                                    <Chip
                                                        label={getStatusLabel(data.days[i + 1])}
                                                        color={getStatusColor(data.days[i + 1])}
                                                        size="small"
                                                    />
                                                ) : (
                                                    '.'
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        component="div"
                        count={attendanceData.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        rowsPerPageOptions={[10]}
                        labelDisplayedRows={({ from, to, count }) => `${from}-${to} trên ${count}`}
                    />
                </TableContainer>
            </DashboardCard>
        </PageContainer>
    );
};

export default MonthlyAttendance;