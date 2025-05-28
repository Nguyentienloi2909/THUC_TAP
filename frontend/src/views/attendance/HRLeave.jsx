import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    Snackbar,
    Alert,
} from '@mui/material';
import ApiService from '../../service/ApiService'; // Import ApiService
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';

const HRLeave = () => {
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    // Lấy user hiện tại từ sessionStorage
    const sessionUser = JSON.parse(sessionStorage.getItem('userProfile')) || {};
    const isAdmin = sessionUser.roleName === 'ADMIN';
    const isLeader = sessionUser.roleName === 'LEADER';

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                console.log('[HRLeave] User role:', sessionUser.roleName, 'isAdmin:', isAdmin, 'isLeader:', isLeader);
                
                let data = [];
                if (isAdmin) {
                    console.log('[HRLeave] Attempting to fetch data for Admin...');
                    // Gọi API lấy tất cả đơn nghỉ phép cho Admin
                    data = await ApiService.getAllLeaveRequests();
                    console.log('[HRLeave] getAllLeaveRequests data:', data);
                } else if (isLeader) {
                    console.log('[HRLeave] Attempting to fetch data for Leader...');
                    // Lấy danh sách đơn nghỉ phép và thành viên nhóm
                    const groupId = sessionUser.groupId;
                    console.log('[HRLeave] Leader groupId:', groupId);
                    
                    if (groupId) {
                        // Lấy tất cả đơn nghỉ phép
                        const allLeaveRequests = await ApiService.getAllLeaveRequests();
                        console.log('[HRLeave] All leave requests:', allLeaveRequests);
                        
                        // Lấy thông tin nhóm để biết danh sách thành viên
                        const groupInfo = await ApiService.getGroup(groupId);
                        console.log('[HRLeave] Group info:', groupInfo);
                        
                        if (groupInfo && groupInfo.users && Array.isArray(groupInfo.users)) {
                            // Lấy danh sách ID của thành viên trong nhóm
                            const groupMemberIds = groupInfo.users.map(user => user.id);
                            console.log('[HRLeave] Group member IDs:', groupMemberIds);
                            
                            // Lọc đơn nghỉ phép của thành viên trong nhóm
                            data = allLeaveRequests.filter(request => 
                                groupMemberIds.includes(request.senderId) && 
                                request.senderId !== sessionUser.id // Loại trừ đơn của chính leader
                            );
                            
                            console.log('[HRLeave] Filtered leave requests for Leader\'s group members:', data);
                        } else {
                            console.log('[HRLeave] No group members found or invalid group data');
                        }
                    } else {
                        console.log('[HRLeave] Leader has no groupId assigned');
                    }
                } else {
                    console.log('[HRLeave] User is neither Admin nor Leader. Role:', sessionUser.roleName);
                }
                
                console.log('[HRLeave] Data before setting state:', data);
                setLeaveRequests(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('[HRLeave] Error details:', {
                    message: err.message,
                    response: err.response,
                    status: err.response?.status,
                    data: err.response?.data,
                });
                setError(`Không thể tải danh sách đơn nghỉ phép: ${err.response?.data?.message || err.message}`);
            } finally {
                setLoading(false);
            }
        };
        
        console.log('[HRLeave] Component mounted, sessionUser:', sessionUser);
        if (sessionUser.id) {
            fetchData();
        } else {
            setError('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
            setLoading(false);
        }
    }, [isAdmin, isLeader, sessionUser.id]);

    const handleApprove = async (id) => {
        setActionLoading(id);
        setError('');
        try {
            await ApiService.approveLeaveRequest(id);
            setSuccess('Duyệt đơn thành công!');
            setLeaveRequests((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, status: 'Approved' } : item
                )
            );
        } catch (err) {
            console.error('[HRLeave] Approve error details:', err.response || err);
            setError(`Duyệt đơn thất bại: ${err.response?.data?.message || err.message}`);
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (id) => {
        setActionLoading(id);
        setError('');
        try {
            await ApiService.cancelLeaveRequest(id); // Sử dụng cancel thay vì reject
            setSuccess('Từ chối đơn thành công!');
            setLeaveRequests((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, status: 'Rejected' } : item
                )
            );
        } catch (err) {
            console.error('[HRLeave] Reject error details:', err.response || err);
            setError(`Từ chối đơn thất bại: ${err.response?.data?.message || err.message}`);
        } finally {
            setActionLoading(null);
        }
    };

    const getStatusLabel = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved':
                return 'Đã duyệt';
            case 'pending':
                return 'Đang chờ';
            case 'rejected':
                return 'Từ chối';
            default:
                return status || 'Unknown';
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
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

    // Tính số ngày nghỉ
    const calcDays = (start, end) => {
        if (!start || !end) return '';
        const s = new Date(start);
        const e = new Date(end);
        return Math.max(1, Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1);
    };

    console.log('[HRLeave] leaveRequests state:', leaveRequests);

    return (
        <PageContainer title="Quản lý đơn nghỉ phép" description="Duyệt đơn nghỉ phép cho Leader/Admin">
            <DashboardCard>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                    Danh sách đơn nghỉ phép
                </Typography>
                <Paper sx={{ p: 3, mt: 2 }}>
                    {loading ? (
                        <Typography>Đang tải dữ liệu...</Typography>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Người gửi</TableCell>
                                        <TableCell>Nhóm</TableCell>
                                        <TableCell>Ngày bắt đầu</TableCell>
                                        <TableCell>Ngày kết thúc</TableCell>
                                        <TableCell>Lý do</TableCell>
                                        <TableCell>Người duyệt</TableCell>
                                        <TableCell>Số ngày nghỉ</TableCell>
                                        <TableCell>Trạng thái</TableCell>
                                        <TableCell align="center">Hành động</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {leaveRequests.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={9} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                                Chưa có đơn nghỉ phép
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        leaveRequests.map((request) => (
                                            <TableRow key={request.id}>
                                                <TableCell>{request.senderName}</TableCell>
                                                <TableCell>{request.groupName || '—'}</TableCell>
                                                <TableCell>{request.startDate ? new Date(request.startDate).toLocaleDateString('vi-VN') : ''}</TableCell>
                                                <TableCell>{request.endDate ? new Date(request.endDate).toLocaleDateString('vi-VN') : ''}</TableCell>
                                                <TableCell>{request.reason}</TableCell>
                                                <TableCell>{request.acceptorName || '—'}</TableCell>
                                                <TableCell>{calcDays(request.startDate, request.endDate)}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={getStatusLabel(request.status)}
                                                        color={getStatusColor(request.status)}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    {request.status?.toLowerCase() === 'pending' && (
                                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                            <Button
                                                                size="small"
                                                                variant="contained"
                                                                color="success"
                                                                disabled={actionLoading === request.id}
                                                                onClick={() => handleApprove(request.id)}
                                                            >
                                                                Duyệt
                                                            </Button>
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                color="error"
                                                                disabled={actionLoading === request.id}
                                                                onClick={() => handleReject(request.id)}
                                                            >
                                                                Từ chối
                                                            </Button>
                                                        </Box>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>
                <Snackbar
                    open={!!success}
                    autoHideDuration={2500}
                    onClose={() => setSuccess('')}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert severity="success" sx={{ width: '100%' }}>
                        {success}
                    </Alert>
                </Snackbar>
                <Snackbar
                    open={!!error}
                    autoHideDuration={4000}
                    onClose={() => setError('')}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert severity="error" sx={{ width: '100%' }}>
                        {error}
                    </Alert>
                </Snackbar>
            </DashboardCard>
        </PageContainer>
    );
};

export default HRLeave;