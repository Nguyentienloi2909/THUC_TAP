import React, { useState, useEffect } from 'react';
import {
    Grid, Typography, Button, List, ListItem, IconButton,
    Divider, Box, TextField, Chip, Stack, Dialog,
    DialogTitle, DialogContent, DialogActions, Avatar,
    AvatarGroup, Card, CardContent
} from '@mui/material';
import { IconPlus, IconEdit, IconTrash, IconUsers, IconUserPlus } from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import ApiService from '../../service/ApiService';
import CreateGroupModal from './modal/Create';
import UpdateGroupModal from './modal/Update';
import AddMemberModal from './modal/Add';

const Group = () => {
    // Sample user data - replace with actual user data from authentication
    const currentUser = {
        id: 1,
        name: 'John Doe',
        role: 'leader', // 'admin', 'leader', or 'user'
        groupId: 1 // for regular users
    };

    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [openMemberDialog, setOpenMemberDialog] = useState(false);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [groupToUpdate, setGroupToUpdate] = useState(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [groupToDelete, setGroupToDelete] = useState(null);
    const [openAddMemberModal, setOpenAddMemberModal] = useState(false);
    const [groupIdToAddMember, setGroupIdToAddMember] = useState(null);
    const [fetchError, setFetchError] = useState(false); // State to track fetch errors

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGroups = async () => {
            setLoading(true);
            try {
                const groupData = await ApiService.getAllGroups();
                console.log('Groups:', groupData);
                setGroups(groupData);
                setFetchError(false);
            } catch (error) {
                console.error('Failed to fetch groups:', error);
                setFetchError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, []);

    const handleOpenMembers = (group) => {
        setSelectedGroup(group);
        setOpenMemberDialog(true);
    };

    const isAdminOrLeader = currentUser.role === 'admin' || currentUser.role === 'leader';
    const userGroup = groups.find(g => g.id === currentUser.groupId);

    const renderMemberList = (members) => (
        <List>
            {members.map((member) => (
                <React.Fragment key={member.id}>
                    <ListItem
                        secondaryAction={
                            isAdminOrLeader && (
                                <IconButton edge="end" color="error">
                                    <IconTrash />
                                </IconButton>
                            )
                        }
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar src={member.avatar}>{member.fullName[0]}</Avatar>
                            <Box>
                                <Typography variant="subtitle2">
                                    {member.fullName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {member.roleName || 'Member'}
                                </Typography>
                                <Typography variant="caption" display="block" color="text.secondary">
                                    {member.email}
                                </Typography>
                            </Box>
                        </Box>
                    </ListItem>
                    <Divider />
                </React.Fragment>
            ))}
        </List>
    );

    const handleCreateGroup = async (data) => {
        try {
            await ApiService.createGroup(data);
            setOpenCreateModal(false);
            // Refresh group list
            const groupData = await ApiService.getAllGroups();
            setGroups(groupData);
        } catch (error) {
            console.error('Failed to create group:', error);
        }
    };

    const handleUpdateGroup = async (data) => {
        try {
            await ApiService.updateGroup(data.id, data);
            setOpenUpdateModal(false);
            setGroupToUpdate(null);
            // Refresh group list
            const groupData = await ApiService.getAllGroups();
            setGroups(groupData);
        } catch (error) {
            console.error('Failed to update group:', error);
        }
    };

    const handleDeleteGroup = (groupId) => {
        console.log('Open delete modal for groupId:', groupId);
        setGroupToDelete(groupId);
        setOpenDeleteModal(true);
    };

    const confirmDeleteGroup = async () => {
        if (!groupToDelete) return;
        console.log('Confirm delete for groupId:', groupToDelete);
        try {
            await ApiService.deleteGroup(groupToDelete);
            console.log('Deleted groupId:', groupToDelete);
            setOpenDeleteModal(false);
            setGroupToDelete(null);
            // Refresh group list
            const groupData = await ApiService.getAllGroups();
            console.log('Groups after delete:', groupData);
            setGroups(groupData);
        } catch (error) {
            console.error('Failed to delete group:', error);
            setOpenDeleteModal(false);
            setGroupToDelete(null);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }


    return (
        <PageContainer title="Quản lý nhóm" description="Quản lý nhóm và thành viên">
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                </Box>
            ) : groups.length === 0 ? (
                <Box sx={{ padding: '20px', textAlign: 'center' }}>
                    Không tìm thấy bản ghi nào
                </Box>
            ) : (
                isAdminOrLeader ? (
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <DashboardCard
                                title="Danh sách nhóm"
                                action={
                                    <Button
                                        variant="contained"
                                        startIcon={<IconPlus />}
                                        size="small"
                                        onClick={() => setOpenCreateModal(true)}
                                    >
                                        Thêm nhóm
                                    </Button>
                                }
                            >
                                <Grid container spacing={3}>
                                    {groups.map((group) => (
                                        <Grid item xs={12} md={4} key={group.id}>
                                            <Card variant="outlined">
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                        <Typography variant="h6">{group.groupName}</Typography>
                                                        <Box>
                                                            <IconButton size="small" color="primary" onClick={() => { setGroupToUpdate(group); setOpenUpdateModal(true); }}>
                                                                <IconEdit />
                                                            </IconButton>
                                                            <IconButton size="small" color="error" onClick={() => handleDeleteGroup(group.id)}>
                                                                <IconTrash />
                                                            </IconButton>
                                                        </Box>
                                                    </Box>

                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                        {group.departmentName}
                                                    </Typography>

                                                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                                                        Trưởng nhóm: {group.users.find(user => user.roleId === 3)?.fullName || 'N/A'}
                                                    </Typography>

                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <AvatarGroup max={3}>
                                                            {group.users.map((member) => (
                                                                <Avatar key={member.id} src={member.avatar}>{member.fullName[0]}</Avatar>
                                                            ))}
                                                        </AvatarGroup>
                                                        <Button
                                                            variant="outlined"
                                                            startIcon={<IconUsers />}
                                                            size="small"
                                                            onClick={() => handleOpenMembers(group)}
                                                        >
                                                            Quản lý
                                                        </Button>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </DashboardCard>
                        </Grid>
                    </Grid>
                ) : (
                    // Regular user view - Show only their group
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <DashboardCard title={`Nhóm: ${userGroup?.groupName}`}>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        {userGroup?.departmentName}
                                    </Typography>
                                    <Typography variant="subtitle2" sx={{ mt: 1 }}>
                                        Trưởng nhóm: {userGroup?.users.find(user => user.roleId === 3)?.fullName || 'N/A'}
                                    </Typography>
                                </Box>
                                {userGroup && renderMemberList(userGroup.users)}
                            </DashboardCard>
                        </Grid>
                    </Grid>
                )
            )}

            {/* Member Management Dialog */}
            {isAdminOrLeader && (
                <Dialog
                    open={openMemberDialog}
                    onClose={() => setOpenMemberDialog(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6">
                                Quản lý thành viên - {selectedGroup?.groupName}
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<IconUserPlus />}
                                size="small"
                                onClick={() => {
                                    setGroupIdToAddMember(selectedGroup?.id);
                                    setOpenAddMemberModal(true);
                                }}
                            >
                                Thêm thành viên
                            </Button>
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        <List>
                            {selectedGroup?.users.map((member) => (
                                <React.Fragment key={member.id}>
                                    <ListItem
                                        secondaryAction={
                                            member.roleId !== 3 && (
                                                <Stack direction="row" spacing={1}>
                                                    <Chip
                                                        label={
                                                            member.roleId === 3
                                                                ? "Trưởng nhóm"
                                                                : "Thành viên"
                                                        }
                                                        size="small"
                                                        color={member.roleId === 3 ? 'primary' : 'default'}
                                                    />
                                                    <IconButton color="error">
                                                        <IconTrash size={18} />
                                                    </IconButton>
                                                </Stack>
                                            )
                                        }
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar src={member.avatar}>{member.fullName[0]}</Avatar>
                                            <Box>
                                                <Typography variant="subtitle2">
                                                    {member.fullName}
                                                    {member.roleId === 3 && (
                                                        <Chip
                                                            label="Trưởng nhóm"
                                                            size="small"
                                                            color="primary"
                                                            sx={{ ml: 1 }}
                                                        />
                                                    )}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {member.email}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            ))}
                        </List>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenMemberDialog(false)}>
                            Đóng
                        </Button>
                    </DialogActions>
                </Dialog>
            )}


            <CreateGroupModal
                open={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
                onCreate={handleCreateGroup}
            />


            <UpdateGroupModal
                open={openUpdateModal}
                onClose={() => { setOpenUpdateModal(false); setGroupToUpdate(null); }}
                group={groupToUpdate}
                onUpdate={handleUpdateGroup}
            />

            <Dialog
                open={openDeleteModal}
                onClose={() => { setOpenDeleteModal(false); setGroupToDelete(null); }}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        backgroundColor: '#fff',
                        boxShadow: 24
                    }
                }}
            >
                <DialogTitle>Xác nhận xóa nhóm</DialogTitle>
                <DialogContent>
                    <Typography>Bạn có chắc chắn muốn xóa nhóm này?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setOpenDeleteModal(false); setGroupToDelete(null); }}>
                        Hủy
                    </Button>
                    <Button onClick={confirmDeleteGroup} variant="contained" color="error">
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>

            <AddMemberModal
                open={openAddMemberModal}
                onClose={() => setOpenAddMemberModal(false)}
                groupId={groupIdToAddMember}
                onAdd={async () => {
                    setOpenAddMemberModal(false);
                    // Refresh group list after adding member
                    const groupData = await ApiService.getAllGroups();
                    setGroups(groupData);
                    // Optionally, update selectedGroup if needed
                    if (groupIdToAddMember) {
                        const updatedGroup = groupData.find(g => g.id === groupIdToAddMember);
                        setSelectedGroup(updatedGroup);
                    }
                }}
            />
        </PageContainer>
    );
};

export default Group;