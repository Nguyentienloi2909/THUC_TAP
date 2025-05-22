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

const DeleteUserInGroup = ({ open, onClose, loggedInUserId, groupId, selectedGroup }) => {
    const theme = useTheme();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const [inputValue, setInputValue] = useState('');

    // Lấy danh sách thành viên trong nhóm
    useEffect(() => {
        const fetchGroupMembers = async () => {
            if (!groupId) {
                console.warn('groupId is undefined, cannot fetch group members.');
                return;
            }

            try {
                console.log('Fetching group members for group:', groupId);
                const groupData = await ApiService.getChatGroupById(groupId); // Giả định API lấy thông tin nhóm
                const groupMembers = groupData?.members?.filter(member => member.id !== loggedInUserId) || [];
                console.log('Group members from API:', groupMembers);
                setUsers(groupMembers.length > 0 ? groupMembers : selectedGroup?.members?.filter(member => member.id !== loggedInUserId) || []);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách thành viên nhóm:', error);
                // Fallback: Sử dụng selectedGroup.members nếu có, hoặc dữ liệu cứng
                const fallbackMembers = selectedGroup?.members?.filter(member => member.id !== loggedInUserId) || [
                    { id: 2, fullName: 'Trần Thị B', avatar: 'https://www.bootdey.com/img/Content/avatar/avatar2.png' },
                    { id: 3, fullName: 'Lê Văn C', avatar: 'https://www.bootdey.com/img/Content/avatar/avatar3.png' },
                ];
                setUsers(fallbackMembers);
            }
        };

        if (groupId) fetchGroupMembers();
    }, [groupId, loggedInUserId, selectedGroup]);

    // Xử lý thay đổi danh sách user được chọn
    const handleUserSelect = (event, newValue) => {
        const userIds = newValue.map(user => user.id);
        setSelectedUsers(userIds);
        console.log('Selected user IDs for deletion:', userIds);
    };

    // Xử lý xóa thành viên khỏi nhóm
    const handleRemoveUsers = async () => {
        if (selectedUsers.length === 0) {
            alert('Vui lòng chọn ít nhất một thành viên để xóa khỏi nhóm.');
            return;
        }
        try {
            console.log('Removing users from group:', { groupId, userIds: selectedUsers });
            await ApiService.removeGroupMember(groupId, selectedUsers); // Giả định API xóa thành viên
            onClose();
            window.location.reload(); // Tải lại trang để cập nhật danh sách nhóm
        } catch (error) {
            console.error('Lỗi khi xóa thành viên:', error);
            alert('Xóa thành viên thất bại. Vui lòng thử lại.');
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
            aria-labelledby="delete-user-in-group-modal"
            aria-describedby="modal-to-delete-users-from-group"
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
                <Typography id="delete-user-in-group-modal" variant="h6" component="h2" gutterBottom>
                    Xóa thành viên khỏi nhóm
                </Typography>

                {/* Chọn thành viên bằng Autocomplete */}
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                    Chọn thành viên để xóa:
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
                        />
                    )}
                    sx={{ mb: 2 }}
                    disabled={users.length === 0}
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
                    <Button variant="contained" color="error" onClick={handleRemoveUsers} disabled={users.length === 0}>
                        Xóa thành viên
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

DeleteUserInGroup.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    loggedInUserId: PropTypes.number.isRequired,
    groupId: PropTypes.number,
    selectedGroup: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        members: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number,
                fullName: PropTypes.string,
                avatar: PropTypes.string,
            })
        ),
    }),
};

DeleteUserInGroup.defaultProps = {
    groupId: null,
    selectedGroup: null,
};

export default DeleteUserInGroup;