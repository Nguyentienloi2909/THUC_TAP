import React, { useState, useEffect } from 'react';
import {
    Grid,
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
    Divider,
    Box,
    IconButton,
    Collapse,
    Modal,
    Card,
    CardContent
} from '@mui/material';
import {
    IconPlus,
    IconEdit,
    IconTrash,
    IconChevronDown,
    IconChevronRight
} from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import ApiService from '../../service/ApiService';
import DCreate from './components/dcreate';
import DUpdate from './components/dupdate';
import GCreate from './components/gcreate';
import GUpdate from './components/GUpdate';

const Department = () => {
    const [departments, setDepartments] = useState([]);
    const [expandedDept, setExpandedDept] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedDept, setSelectedDept] = useState(null);
    const [selectedDeptForGroup, setSelectedDeptForGroup] = useState(null);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                setLoading(true);
                const response = await ApiService.getAllDepartments();
                console.log('Departments data from API:', response);
                setDepartments(response);
            } catch (error) {
                console.error('Error fetching departments:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDepartments();
    }, []);

    const handleExpandDepartment = (deptId) => {
        setExpandedDept(prev => ({
            ...prev,
            [deptId]: !prev[deptId]
        }));
    };

    const handleExpandGroup = (groupId) => {
        setExpandedDept(prev => ({
            ...prev,
            [groupId]: !prev[groupId]
        }));
    };

    const handleOpenCreateDeptModal = () => {
        setSelectedDept(null);
        setSelectedDeptForGroup(null);
        setCreateModalOpen(true);
    };

    const handleOpenCreateGroupModal = (dept) => {
        console.log('Opening create group modal for department:', dept);
        setSelectedDept(null);
        setSelectedDeptForGroup(dept);
        setCreateModalOpen(true);
    };

    const handleOpenEditModal = (item) => {
        // Nếu là group, tìm lại departmentId và departmentName đúng từ danh sách departments
        if (item.groupName && (!item.departmentId || !item.departmentName)) {
            // Tìm department chứa group này
            const foundDept = departments.find(dept =>
                dept.groups && dept.groups.some(g => g.id === item.id)
            );
            if (foundDept) {
                item = {
                    ...item,
                    departmentId: foundDept.id,
                    departmentName: foundDept.departmentName // Thêm dòng này
                };
            }
        }
        console.log('Opening edit modal for item:', item);
        setSelectedDept(item);
        setEditModalOpen(true);
    };

    const handleOpenDeleteModal = (dept) => {
        setSelectedDept(dept);
        setDeleteModalOpen(true);
    };

    const handleCloseModal = () => {
        setCreateModalOpen(false);
        setEditModalOpen(false);
        setDeleteModalOpen(false);
    };

    const handleDepartmentCreated = () => {
        handleCloseModal();
        fetchDepartments();
    };

    const handleItemUpdated = () => {
        handleCloseModal();
        fetchDepartments();
    };

    const handleDeleteItem = async () => {
        try {
            console.log('Attempting to delete item:', selectedDept);
            if (selectedDept?.departmentName) {
                // Delete department
                const response = await ApiService.deleteDepartment(selectedDept.id);
                console.log('Department deletion response:', response);
            } else {
                // Delete group
                const response = await ApiService.deleteGroup(selectedDept.id);
                console.log('Group deletion response:', response);
            }
            handleCloseModal();
            fetchDepartments();
        } catch (error) {
            console.error("Error deleting item:", error);
            // Optionally show error message to user
        }
    };

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            const response = await ApiService.getAllDepartments();
            console.log('Refreshed departments data:', response);
            setDepartments(response);
        } catch (error) {
            console.error('Error refreshing departments:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <PageContainer title="Quản lý phòng ban" description="Danh sách phòng ban và nhóm">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <DashboardCard
                        title="Danh sách phòng ban"
                        action={
                            <Button
                                variant="contained"
                                startIcon={<IconPlus />}
                                color="primary"
                                onClick={handleOpenCreateDeptModal}
                            >
                                Thêm phòng ban
                            </Button>
                        }
                    >
                        <Box sx={{ p: 2 }}>
                            {departments.map((dept) => (
                                <Card
                                    key={dept.id}
                                    sx={{
                                        mb: 3,
                                        boxShadow: 3,
                                        borderRadius: 2,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        overflow: 'visible'
                                    }}
                                >
                                    <CardContent sx={{ p: 0 }}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                p: 2,
                                                bgcolor: 'primary.main',
                                                color: 'white',
                                                borderTopLeftRadius: 8,
                                                borderTopRightRadius: 8
                                            }}
                                        >
                                            <IconButton
                                                onClick={() => handleExpandDepartment(dept.id)}
                                                size="small"
                                                sx={{ color: 'white', mr: 1 }}
                                            >
                                                {expandedDept[dept.id] ?
                                                    <IconChevronDown /> :
                                                    <IconChevronRight />
                                                }
                                            </IconButton>
                                            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                                {dept.departmentName}
                                            </Typography>
                                            <Box>
                                                <IconButton color="inherit" size="small" onClick={() => handleOpenEditModal(dept)}>
                                                    <IconEdit />
                                                </IconButton>
                                                <IconButton color="inherit" size="small" onClick={() => handleOpenDeleteModal(dept)}>
                                                    <IconTrash />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                        <Collapse in={expandedDept[dept.id]} timeout="auto">
                                            <Box sx={{ p: 2 }}>
                                                <Grid container spacing={2}>
                                                    {dept.groups?.map((group) => (
                                                        <Grid item xs={12} md={6} lg={4} key={group.id}>
                                                            <Card
                                                                sx={{
                                                                    boxShadow: 2,
                                                                    borderRadius: 2,
                                                                    height: '100%',
                                                                    display: 'flex',
                                                                    flexDirection: 'column'
                                                                }}
                                                            >
                                                                <Box
                                                                    sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        p: 2,
                                                                        bgcolor: 'grey.100',
                                                                        borderTopLeftRadius: 8,
                                                                        borderTopRightRadius: 8
                                                                    }}
                                                                >
                                                                    <IconButton
                                                                        onClick={() => handleExpandGroup(group.id)}
                                                                        size="small"
                                                                        sx={{ mr: 1 }}
                                                                    >
                                                                        {/* {expandedDept[group.id] ?
                                                                            <IconChevronDown /> :
                                                                            <IconChevronRight />
                                                                        } */}
                                                                    </IconButton>
                                                                    <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                                                                        {group.groupName}
                                                                    </Typography>
                                                                    <Box>
                                                                        <IconButton color="primary" size="small" onClick={() => handleOpenEditModal(group)}>
                                                                            <IconEdit />
                                                                        </IconButton>
                                                                        <IconButton color="error" size="small" onClick={() => handleOpenDeleteModal(group)}>
                                                                            <IconTrash />
                                                                        </IconButton>
                                                                    </Box>
                                                                </Box>
                                                                <CardContent>
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {group.users?.length || 0} thành viên
                                                                    </Typography>
                                                                    {/* Removed member list display */}
                                                                </CardContent>
                                                            </Card>
                                                        </Grid>
                                                    ))}
                                                    <Grid item xs={12} md={6} lg={4}>
                                                        <Card
                                                            sx={{
                                                                boxShadow: 1,
                                                                borderRadius: 2,
                                                                height: '100%',
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                p: 2,
                                                                bgcolor: 'success.lighter',
                                                                border: '1px dashed success.light',
                                                                transition: 'all 0.3s',
                                                                '&:hover': {
                                                                    bgcolor: 'success.light',
                                                                    transform: 'scale(1.02)'
                                                                }
                                                            }}
                                                        >
                                                            <Button
                                                                startIcon={<IconPlus />}
                                                                color="success"
                                                                onClick={() => handleOpenCreateGroupModal(dept)}
                                                                sx={{ textTransform: 'none', fontWeight: 'bold' }}
                                                            >
                                                                Thêm nhóm
                                                            </Button>
                                                        </Card>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </Collapse>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </DashboardCard>
                </Grid>
            </Grid>

            <Modal
                open={createModalOpen}
                onClose={handleCloseModal}
                aria-labelledby="create-modal-title"
                aria-describedby="create-modal-description"
            >
                <Box sx={{ width: '50%', p: 4, bgcolor: 'background.paper', borderRadius: 1, margin: 'auto' }}>
                    {selectedDeptForGroup ? (
                        <GCreate
                            departmentId={selectedDeptForGroup.id}
                            departmentName={selectedDeptForGroup.departmentName}
                            onCreated={handleDepartmentCreated}
                            onCancel={handleCloseModal}
                        />
                    ) : (
                        <DCreate onCreated={handleDepartmentCreated} onCancel={handleCloseModal} />
                    )}
                </Box>
            </Modal>

            <Modal
                open={editModalOpen}
                onClose={handleCloseModal}
                aria-labelledby="edit-modal-title"
                aria-describedby="edit-modal-description"
            >
                <Box sx={{ width: '50%', p: 4, bgcolor: 'background.paper', borderRadius: 1, margin: 'auto', mt: '10%' }}>
                    {selectedDept?.departmentName && !selectedDept?.groupName ? (
                        <DUpdate department={selectedDept} onUpdated={handleItemUpdated} onCancel={handleCloseModal} />
                    ) : (
                        <GUpdate
                            group={selectedDept}
                            departmentId={selectedDept?.departmentId}
                            onUpdated={handleItemUpdated}
                            onCancel={handleCloseModal}
                        />
                    )}
                </Box>
            </Modal>

            <Modal
                open={deleteModalOpen}
                onClose={handleCloseModal}
                aria-labelledby="delete-modal-title"
                aria-describedby="delete-modal-description"
            >
                <Box sx={{ width: '50%', p: 4, bgcolor: 'background.paper', borderRadius: 1, margin: 'auto', mt: '10%' }}>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                        Xác nhận xóa {selectedDept?.departmentName || selectedDept?.groupName}?
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button onClick={handleCloseModal} variant="outlined">
                            Hủy
                        </Button>
                        <Button onClick={handleDeleteItem} variant="contained" color="error">
                            Xóa
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </PageContainer>
    );
};

export default Department;