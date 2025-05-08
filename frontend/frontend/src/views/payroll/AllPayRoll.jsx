import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress
} from '@mui/material';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';

// Mock data for attendance records
const mockAttendanceRecords = [
    { id: 1, name: 'Nguyễn Văn A', checkIn: '08:30', checkOut: '17:45', status: 'onTime', workHours: '9:15' },
    { id: 2, name: 'Trần Thị B', checkIn: '08:15', checkOut: '17:30', status: 'onTime', workHours: '9:15' },
    { id: 3, name: 'Lê Văn C', checkIn: '08:45', checkOut: '17:30', status: 'late', workHours: '8:45' },
    // Add more records as needed
];

const AllPayRoll = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching data
        setTimeout(() => {
            setAttendanceRecords(mockAttendanceRecords);
            setLoading(false);
        }, 1000);
    }, []);

    return (
        <PageContainer title="Danh sách chấm công" description="Hiển thị danh sách chấm công trong ngày">
            <DashboardCard>
                <Box sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                        Danh sách chấm công trong ngày
                    </Typography>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="attendance table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Tên nhân viên</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Giờ vào</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Giờ ra</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Trạng thái</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Số giờ làm</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {attendanceRecords.map((record) => (
                                        <TableRow key={record.id}>
                                            <TableCell>{record.name}</TableCell>
                                            <TableCell>{record.checkIn}</TableCell>
                                            <TableCell>{record.checkOut}</TableCell>
                                            <TableCell>{record.status === 'onTime' ? 'Đúng giờ' : 'Đi muộn'}</TableCell>
                                            <TableCell>{record.workHours}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>
            </DashboardCard>
        </PageContainer>
    );
};

export default AllPayRoll;