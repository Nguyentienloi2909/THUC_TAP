import React, { useState, useEffect } from 'react';
import {
    Typography,
    IconButton,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    CircularProgress,
    Alert
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { format, addMonths, subMonths } from 'date-fns';
import { vi } from 'date-fns/locale';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import CheckTools from './components/CheckTools';
import ApiService from '../../service/ApiService';

const HistoryCheckwork = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [pageSize, setPageSize] = useState(10);
    const [openDialog, setOpenDialog] = useState(false);
    const [actionType, setActionType] = useState('');
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch attendance data
    useEffect(() => {
        const fetchAttendanceData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Get current user profile
                const userProfile = await ApiService.getUserProfile();

                if (!userProfile?.id) {
                    throw new Error('Không thể xác định người dùng');
                }

                // Get attendance data
                const response = await ApiService.getAttendance(userProfile.id);

                // Ensure response is an array
                const attendanceArray = Array.isArray(response) ? response : [response];
                console.log('Attendance array:', attendanceArray);

                // Transform data for DataGrid
                const formattedData = attendanceArray.map((item, index) => ({
                    id: item.id || index,
                    date: new Date(item.workday).toLocaleDateString('vi-VN'),
                    checkIn: item.checkIn ? new Date(item.checkIn).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit'
                    }) : '--:--',
                    checkOut: item.checkOut ? new Date(item.checkOut).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit'
                    }) : '--:--',
                    status: transformStatus(item.status),
                    note: item.note || '--',
                    workHours: calculateWorkHours(item.checkIn, item.checkOut),
                    userFullName: item.userFullName
                }));

                setAttendanceData(formattedData);
            } catch (err) {
                console.error('Error fetching attendance:', err);
                setError('Không thể tải dữ liệu chấm công');
            } finally {
                setLoading(false);
            }
        };

        fetchAttendanceData();
    }, [currentDate]);

    // Helper function to calculate work hours
    const calculateWorkHours = (checkIn, checkOut) => {
        if (!checkIn || !checkOut) return '--:--';
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diff = end - start;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}:${minutes.toString().padStart(2, '0')}`;
    };

    // Add status transformation function
    const transformStatus = (status) => {
        switch (status) {
            case 'Pending':
                return 'pending';
            case 'Present':
                return 'onTime';
            case 'Late':
                return 'late';
            case 'Early':
                return 'early';
            default:
                return 'pending';
        }
    };

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

    const columns = [
        {
            field: 'date',
            headerName: 'Ngày',
            width: 130,
            valueFormatter: (params) => format(new Date(params.value), 'dd/MM/yyyy')
        },
        { field: 'checkIn', headerName: 'Giờ vào', width: 130 },
        { field: 'checkOut', headerName: 'Giờ ra', width: 130 },
        {
            field: 'status',
            headerName: 'Trạng thái',
            width: 130,
            renderCell: (params) => (
                <Typography
                    sx={{
                        color: params.value === 'onTime' ? '#4caf50' :
                            params.value === 'late' ? '#f44336' :
                                params.value === 'early' ? '#ff9800' :
                                    params.value === 'pending' ? '#757575' : '#757575',
                        fontWeight: 500
                    }}
                >
                    {params.value === 'onTime' ? 'Có mặt' :
                        params.value === 'late' ? 'Đi muộn' :
                            params.value === 'early' ? 'Về sớm' :
                                'Chưa chấm công'}
                </Typography>
            )
        },
        { field: 'note', headerName: 'Ghi chú', width: 200 },
        { field: 'workHours', headerName: 'Số giờ làm', width: 130 }
    ];

    return (
        <PageContainer title="Lịch sử chấm công" description="Xem lịch sử chấm công">
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

                {/* Error Alert */}
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box sx={{ backgroundColor: '#f5f5f5', borderRadius: 4, p: 3, mt: 2 }}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 3
                    }}>
                        <Typography variant="h6" sx={{ color: '#2c3e50' }}>
                            Lịch sử chấm công
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

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <DataGrid
                            rows={attendanceData}
                            columns={columns}
                            pageSize={pageSize}
                            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                            rowsPerPageOptions={[5, 10, 20]}
                            autoHeight
                            disableSelectionOnClick
                            sx={{
                                backgroundColor: 'white',
                                borderRadius: 2,
                                '& .MuiDataGrid-cell': {
                                    borderColor: '#f0f0f0'
                                },
                                '& .MuiDataGrid-columnHeaders': {
                                    backgroundColor: '#f8f9fa',
                                    borderColor: '#f0f0f0'
                                },
                                border: 'none',
                                '& .MuiDataGrid-cell:focus': {
                                    outline: 'none'
                                }
                            }}
                        />
                    )}
                </Box>
            </DashboardCard>
        </PageContainer>
    );
};

export default HistoryCheckwork;