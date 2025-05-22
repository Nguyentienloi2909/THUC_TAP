import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Modal,
    Typography,
    TextField,
    Button,
    useTheme,
    Autocomplete,
    Checkbox,
    TextField as MuiTextField,
    Chip,
} from '@mui/material';
import ApiService from 'src/service/ApiService';

const AddUserToGroup = ({ open, onClose, loggedInUserId, groupId, selectedGroup }) => {
    const theme = useTheme();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const [inputValue, setInputValue] = useState('');

    // Lấy danh sách người dùng chưa có trong nhóm
    useEffect(() => {
        const fetchUsers = async () => {
            if (!groupId || !selectedGroup) {
                console.warn('groupId or selectedGroup is undefined, cannot fetch users for group.');
                return;
            }

            try {
                console.log('Fetching users for group:', groupId);
                const allUsers = await ApiService.getAllUsers();
                const groupMemberIds = selectedGroup.members.map(member => member.userId || member.id);
                console.log('Group member IDs:', groupMemberIds);

                const filteredUsers = allUsers.filter(
                    user => user.id !== loggedInUserId && !groupMemberIds.includes(user.id)
                );
                console.log('Filtered users for adding:', filteredUsers);
                setUsers(filteredUsers);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách người dùng:', error);
                // Fallback dữ liệu khi API thất bại
                setUsers([
                    { id: 2, fullName: 'Trần Thị B', avatar: 'https://www.bootdey.com/img/Content/avatar/avatar2.png' },
                    { id: 3, fullName: 'Lê Văn C', avatar: 'https://www.bootdey.com/img/Content/avatar/avatar3.png' },
                ]);
            }
        };

        if (groupId && selectedGroup) fetchUsers();
    }, [groupId, loggedInUserId, selectedGroup]);

    // Xử lý thay đổi danh sách user được chọn
    const handleUserSelect = (event, newValue) => {
        const userIds = newValue.map(user => user.id);
        setSelectedUsers(userIds);
        console.log('Selected user IDs:', userIds);
    };

    // Xử lý thêm thành viên vào nhóm
    const handleAddUsers = async () => {
        if (selectedUsers.length === 0) {
            alert('Vui lòng chọn ít nhất một thành viên để thêm vào nhóm.');
            return;
        }
        try {
            console.log('Adding users to group:', { groupId, userIds: selectedUsers });
            await ApiService.addGroupMember(groupId, selectedUsers); // Giả định API thêm thành viên
            onClose();
            window.location.reload(); // Tải lại trang để cập nhật danh sách nhóm
        } catch (error) {
            console.error('Lỗi khi thêm thành viên:', error);
            alert('Thêm thành viên thất bại. Vui lòng thử lại.');
        }
    };

    // Lấy tên hiển thị của user đã chọn
    const getSelectedUserNames = () => {
        return selectedUsers.map(userId => {
            const user = users.find(u => u.id === userId) || { fullName: 'Unknown' };
            return user.fullName || 'Unknown';
        }).join(', ');
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="add-user-to-group-modal"
            aria-describedby="modal-to-add-users-to-group"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: theme.palette.background.paper,
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Typography id="add-user-to-group-modal" variant="h6" component="h2" gutterBottom>
                    Thêm thành viên vào nhóm
                </Typography>

                {/* Chọn thành viên bằng Autocomplete */}
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                    Chọn thành viên:
                </Typography>
                <Autocomplete
                    multiple
                    options={users}
                    getOptionLabel={(option) => option.fullName || option.name || 'Unknown'}
                    value={users.filter(user => selectedUsers.includes(user.id))}
                    onChange={handleUserSelect}
                    inputValue={inputValue}
                    onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
                    renderOption={(props, option, { selected }) => (
                        <li {...props}>
                            <Checkbox
                                checked={selected}
                                sx={{ mr: 1 }}
                            />
                            {option.fullName || option.name}
                        </li>
                    )}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip
                                label={option.fullName || option.name || 'Unknown'}
                                {...getTagProps({ index })}
                                sx={{ m: 0.5 }}
                            />
                        ))
                    }
                    renderInput={(params) => (
                        <MuiTextField
                            {...params}
                            variant="outlined"
                            label="Chọn người dùng"
                            placeholder="Tìm kiếm người dùng..."
                            disabled={users.length === 0}
                        />
                    )}
                    sx={{ mb: 2 }}
                />

                {/* Hiển thị danh sách thành viên đã chọn */}
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                    Danh sách thành viên được chọn:
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    {getSelectedUserNames() || 'Chưa chọn thành viên nào'}
                </Typography>

                {/* Nút xác nhận và hủy */}
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button variant="outlined" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleAddUsers} disabled={users.length === 0}>
                        Thêm thành viên
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

AddUserToGroup.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    loggedInUserId: PropTypes.number.isRequired,
    groupId: PropTypes.number,
    selectedGroup: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        members: PropTypes.arrayOf(
            PropTypes.shape({
                userId: PropTypes.number,
                id: PropTypes.number,
                fullName: PropTypes.string,
                avatar: PropTypes.string,
            })
        ),
    }),
};

AddUserToGroup.defaultProps = {
    groupId: null,
    selectedGroup: null,
};

export default AddUserToGroup;