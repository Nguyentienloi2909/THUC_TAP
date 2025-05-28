import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Button, Typography, Card, CardContent, CardActions, Grid, CircularProgress, Alert,
    Avatar, Divider, IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { IconUserPlus, IconTrash } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import ApiService from 'src/service/ApiService';
import AddMemberModal from './modal/AddUser';
import Snackbar from '@mui/material/Snackbar';

// Styled components
const StyledContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #e0f7fa 0%, #ffffff 100%)',
        opacity: 0.1,
        zIndex: -1,
    },
}));

const StyledHeader = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(90deg, #1976d2, #42a5f5)',
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(4),
    color: '#fff',
    textShadow: '1px 1px 3px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.3s ease',
    '&:hover': {
        transform: 'scale(1.02)',
    },
}));

const MemberCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius * 2,
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
        transform: 'translateY(-5px)',
        boxShadow: theme.shadows[8],
    },
}));

const GroupById = () => {
    const navigate = useNavigate();
    const [groupData, setGroupData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [groupId, setGroupId] = useState(null);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [removingUserId, setRemovingUserId] = useState(null);
    const [removeError, setRemoveError] = useState('');
    const [removeSuccess, setRemoveSuccess] = useState('');

    // Lấy groupId từ API getUserProfile
    const fetchGroupId = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const userProfile = await ApiService.getUserProfile();
            if (!userProfile?.groupId) throw new Error('Bạn chưa gia nhập vào nhóm nào');
            setGroupId(userProfile.groupId);
        } catch (err) {
            // Nếu là lỗi 404 hoặc lỗi khác, hiển thị thông báo tiếng Việt
            if (err?.response?.status === 404) {
                setError('Bạn chưa gia nhập vào nhóm nào');
            } else {
                setError(err?.message === 'Không tìm thấy ID nhóm trong thông tin người dùng'
                    ? 'Bạn chưa gia nhập vào nhóm nào'
                    : (err?.message || 'Không thể lấy thông tin người dùng'));
            }
            setLoading(false);
        }
    }, []);

    // Lấy thông tin nhóm dựa trên groupId
    const fetchGroup = useCallback(async () => {
        if (!groupId) return;
        try {
            setLoading(true);
            setError('');
            const data = await ApiService.getGroup(groupId);
            if (!data?.id) throw new Error('Dữ liệu nhóm không hợp lệ');
            setGroupData(data);
        } catch (err) {
            // Nếu là lỗi 404 hoặc lỗi khác, hiển thị thông báo tiếng Việt
            if (err?.response?.status === 404) {
                setError('Bạn chưa gia nhập vào nhóm nào');
            } else {
                setError(err?.message === 'Dữ liệu nhóm không hợp lệ'
                    ? 'Bạn chưa gia nhập vào nhóm nào'
                    : (err?.message || 'Không thể tải thông tin nhóm'));
            }
        } finally {
            setLoading(false);
        }
    }, [groupId]);

    useEffect(() => { fetchGroupId(); }, [fetchGroupId]);
    useEffect(() => { fetchGroup(); }, [fetchGroup]);

    const handleAddMember = useCallback(updatedGroup => {
        setGroupData(updatedGroup);
    }, []);

    const handleRemoveMember = useCallback(async (userId) => {
        setRemoveError('');
        setRemoveSuccess('');
        if (!window.confirm('Bạn có chắc chắn muốn xóa thành viên này?')) return;
        setRemovingUserId(userId);
        try {
            // Gọi API xóa thành viên khỏi nhóm
            await ApiService.removeUserFromGroup(groupData.id, userId);

            // Lấy lại thông tin nhóm mới nhất
            const updatedGroup = await ApiService.getGroup(groupData.id);
            setGroupData(updatedGroup);
            setRemoveSuccess('Xóa thành viên thành công!');
        } catch (err) {
            console.error('Lỗi khi xóa thành viên:', err);
            setRemoveError(
                err?.response?.data?.message ||
                err?.message ||
                'Không thể xóa thành viên. Bạn có thể không đủ quyền hoặc có lỗi hệ thống.'
            );
        } finally {
            setRemovingUserId(null);
        }
    }, [groupData]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4, minHeight: '100vh', bgcolor: '#f5f5f5' }} aria-label="Đang tải dữ liệu">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 4, minHeight: '100vh', bgcolor: '#f5f5f5' }}>
                <Alert severity="error" action={
                    <Button color="inherit" size="small" onClick={() => navigate(-1)}>
                        Quay lại
                    </Button>
                }>
                    {error}
                </Alert>
            </Box>
        );
    }

    return (
        <StyledContainer sx={{ p: 4, maxWidth: 1200, mx: 'auto', borderRadius: 2, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
            {/* Header nhóm */}
            <StyledHeader sx={{ mb: 4 }}>
                <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
                    {groupData.groupName}
                </Typography>
                <Typography variant="h5" color="inherit" gutterBottom>
                    {groupData.departmentName} | {groupData.users.length} thành viên
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<IconUserPlus size={20} />}
                    onClick={() => setOpenAddModal(true)}
                    sx={{
                        mt: 2,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 'medium',
                        background: 'linear-gradient(45deg, #2196f3, #21cbf3)',
                        '&:hover': {
                            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                        },
                    }}
                >
                    Thêm thành viên
                </Button>
            </StyledHeader>

            <Divider sx={{ my: 4, borderColor: 'rgba(0, 0, 0, 0.12)' }} />

            {/* Danh sách thành viên */}
            <Typography variant="h4" gutterBottom fontWeight="bold" color="text.primary">
                Danh sách thành viên
            </Typography>
            {removeError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {removeError}
                </Alert>
            )}
            <Snackbar
                open={!!removeSuccess}
                autoHideDuration={3000}
                onClose={() => setRemoveSuccess('')}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                message={removeSuccess}
            />
            <Grid container spacing={4}>
                {groupData.users.map(user => (
                    <Grid item key={user.id} xs={12} sm={6} md={4}>
                        <MemberCard>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Avatar
                                    alt={user.fullName}
                                    src={user.avatar}
                                    sx={{ width: 60, height: 60, mr: 2, border: '2px solid #1976d2' }}
                                />
                                <CardContent sx={{ flexGrow: 1, p: 0 }}>
                                    <Typography variant="h6" fontWeight="bold" color="text.primary">
                                        {user.fullName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {user.email}
                                    </Typography>
                                </CardContent>
                            </Box>
                            <CardActions sx={{ justifyContent: 'center', p: 0 }}>
                                <IconButton color="primary" aria-label="Xem chi tiết">
                                    {/* Thêm logic chi tiết nếu cần */}
                                </IconButton>
                                {/* Ẩn nút xóa nếu user là LEADER */}
                                {user.roleId !== 2 && (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<IconTrash size={18} />}
                                        onClick={() => handleRemoveMember(user.id)}
                                        disabled={removingUserId === user.id}
                                        sx={{
                                            borderRadius: 1,
                                            textTransform: 'none',
                                            '&:hover': {
                                                backgroundColor: '#f44336',
                                                color: '#fff',
                                            },
                                        }}
                                    >
                                        {removingUserId === user.id ? 'Đang xóa...' : 'Xóa'}
                                    </Button>
                                )}
                            </CardActions>
                        </MemberCard>
                    </Grid>
                ))}
            </Grid>

            {/* Modal Thêm thành viên */}
            <AddMemberModal
                open={openAddModal}
                onClose={() => setOpenAddModal(false)}
                groupId={groupData.id}
                onAdd={handleAddMember}
            />
        </StyledContainer>
    );
};

export default React.memo(GroupById);
