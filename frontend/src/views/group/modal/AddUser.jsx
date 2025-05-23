import React, { useState, useEffect, useCallback } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    CircularProgress,
    Alert,
    Box,
    Snackbar
} from '@mui/material';
import ApiService from 'src/service/ApiService';

const AddMemberModal = ({ open, onClose, groupId, onAdd }) => {
    const [users, setUsers] = useState([]);
    const [groupUsers, setGroupUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const fetchData = useCallback(async () => {
        if (!open || !groupId) return;
        setLoading(true);
        setError(null);

        const [allUsersResult, groupResult] = await Promise.allSettled([
            ApiService.getAllUsers(),
            ApiService.getGroup(groupId)
        ]);

        const allUsers = allUsersResult.status === 'fulfilled' ? allUsersResult.value : [];
        const group = groupResult.status === 'fulfilled' ? groupResult.value : { users: [] };

        if (allUsersResult.status === 'rejected' || groupResult.status === 'rejected') {
            setError('Không thể tải danh sách người dùng hoặc thông tin nhóm');
            setLoading(false);
            return;
        }

        const existingIds = (group.users || []).map(u => u.id);
        const availableUsers = allUsers.filter(u => !existingIds.includes(u.id));
        setGroupUsers(group.users || []);
        setUsers(availableUsers);
        setLoading(false);
    }, [open, groupId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAdd = useCallback(async () => {
        if (!selectedUserId) {
            setError('Vui lòng chọn một thành viên');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const newUserIds = [...groupUsers.map(u => u.id), selectedUserId];
            const response = await ApiService.updateGroup(groupId, { users: newUserIds });
            onAdd(response);
            setSuccess(true);
            setSelectedUserId('');
            onClose();
        } catch (err) {
            setError(err.message || 'Không thể thêm thành viên vào nhóm');
        } finally {
            setLoading(false);
        }
    }, [selectedUserId, groupUsers, groupId, onAdd, onClose]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth aria-labelledby="add-member-dialog">
            <DialogTitle id="add-member-dialog">Thêm thành viên vào nhóm</DialogTitle>
            <DialogContent>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }} aria-label="Đang tải danh sách">
                        <CircularProgress size={32} />
                    </Box>
                ) : error ? (
                    <Alert severity="error">{error}</Alert>
                ) : users.length === 0 ? (
                    <Typography>Không còn thành viên nào để thêm.</Typography>
                ) : (
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="select-member-label">Chọn thành viên</InputLabel>
                        <Select
                            labelId="select-member-label"
                            value={selectedUserId}
                            label="Chọn thành viên"
                            onChange={e => {
                                setError(null);
                                setSelectedUserId(e.target.value);
                            }}
                        >
                            {users.map(u => (
                                <MenuItem key={u.id} value={u.id}>
                                    {u.fullName} ({u.email})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading} aria-label="Hủy thêm thành viên">Hủy</Button>
                {users.length > 0 && (
                    <Button
                        onClick={handleAdd}
                        variant="contained"
                        disabled={!selectedUserId || loading}
                        aria-label="Xác nhận thêm thành viên"
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Thêm'}
                    </Button>
                )}
            </DialogActions>
            <Snackbar
                open={success}
                autoHideDuration={3000}
                onClose={() => setSuccess(false)}
                message="Thêm thành viên thành công!"
            />
        </Dialog>
    );
};

export default React.memo(AddMemberModal);