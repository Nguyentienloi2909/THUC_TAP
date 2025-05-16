import React, { useState, useEffect } from 'react';
import {
    Grid,
    Typography,
    Button,
    IconButton,
    Collapse,
    Modal,
    Box,
    CircularProgress,
    Alert,
    Card,
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

// ================== DepartmentCard ==================
const DepartmentCard = ({ dept, expanded, onToggle, onEdit, onDelete, onAddGroup, children }) => {
    return (
        <Card
            sx={{
                mb: 3,
                borderRadius: 2,
                boxShadow: 2,
                overflow: 'hidden',
                transition: 'transform 0.2s ease',
                '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                }
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 2,
                    py: 1.5,
                    bgcolor: 'grey.100',
                    borderBottom: '1px solid',
                    borderColor: 'grey.200',
                }}
            >
                <Box display="flex" alignItems="center">
                    <IconButton onClick={() => onToggle(dept.id)} size="small">
                        {expanded ? <IconChevronDown /> : <IconChevronRight />}
                    </IconButton>
                    <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 600, color: 'primary.dark' }}>
                        {dept.departmentName}
                    </Typography>
                </Box>
                <Box>
                    <IconButton onClick={() => onEdit(dept)} size="small"><IconEdit /></IconButton>
                    <IconButton onClick={() => onDelete(dept)} size="small"><IconTrash /></IconButton>
                </Box>
            </Box>
            <Collapse in={expanded} timeout="auto">
                <Box sx={{ px: 2, py: 2, bgcolor: 'grey.50' }}>
                    {children}
                    <Box mt={2}>
                        <Button
                            variant="outlined"
                            startIcon={<IconPlus />}
                            size="small"
                            onClick={() => onAddGroup(dept)}
                        >
                            Thêm nhóm
                        </Button>
                    </Box>
                </Box>
            </Collapse>
        </Card>
    );
};

// ================== GroupCard ==================
const GroupCard = ({ group, onEdit, onDelete }) => (
    <Card
        sx={{
            p: 2,
            borderRadius: 2,
            height: '100%',
            backgroundColor: 'white',
            border: '1px solid',
            borderColor: 'grey.300',
            transition: 'all 0.2s ease',
            boxShadow: 0,
            '&:hover': {
                boxShadow: 2,
                transform: 'translateY(-2px)',
                borderColor: 'primary.light'
            }
        }}
    >
        <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle2" fontWeight="bold" color="text.primary">
                {group.groupName}
            </Typography>
            <Box>
                <IconButton size="small" onClick={() => onEdit(group)}><IconEdit /></IconButton>
                <IconButton size="small" onClick={() => onDelete(group)} color="error"><IconTrash /></IconButton>
            </Box>
        </Box>
        <Typography variant="body2" color="text.secondary" mt={1}>
            👥 {group.users?.length || 0} thành viên
        </Typography>
    </Card>
);

// ================== Main Component ==================
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
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            const response = await ApiService.getAllDepartments();
            setDepartments(response);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleExpandDepartment = (deptId) => {
        setExpandedDept(prev => ({
            ...prev,
            [deptId]: !prev[deptId]
        }));
    };

    const handleOpenCreateDeptModal = () => {
        setSelectedDept(null);
        setSelectedDeptForGroup(null);
        setCreateModalOpen(true);
    };

    const handleOpenCreateGroupModal = (dept) => {
        setSelectedDeptForGroup(dept);
        setSelectedDept(null);
        setCreateModalOpen(true);
    };

    const handleOpenEditModal = (item) => {
        if (item.groupName && (!item.departmentId || !item.departmentName)) {
            const foundDept = departments.find(dept => dept.groups?.some(g => g.id === item.id));
            if (foundDept) {
                item = {
                    ...item,
                    departmentId: foundDept.id,
                    departmentName: foundDept.departmentName
                };
            }
        }
        setSelectedDept(item);
        setEditModalOpen(true);
    };

    const handleOpenDeleteModal = (item) => {
        setSelectedDept(item);
        setDeleteModalOpen(true);
    };

    const handleCloseModal = () => {
        setCreateModalOpen(false);
        setEditModalOpen(false);
        setDeleteModalOpen(false);
        setSelectedDept(null);
        setSelectedDeptForGroup(null);
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
            if (selectedDept?.departmentName) {
                await ApiService.deleteDepartment(selectedDept.id);
            } else {
                await ApiService.deleteGroup(selectedDept.id);
            }
            handleCloseModal();
            fetchDepartments();
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    if (loading) return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <PageContainer title="Quản lý phòng ban" description="Danh sách phòng ban và nhóm">
            <Grid container spacing={3} sx={{ mt: 3 }}>
                <Grid item xs={12}>
                    <DashboardCard
                        title="Danh sách phòng ban"
                        action={
                            <Button
                                variant="contained"
                                startIcon={<IconPlus />}
                                onClick={handleOpenCreateDeptModal}
                            >
                                Thêm phòng ban
                            </Button>
                        }
                    >
                        {departments.map(dept => (
                            <DepartmentCard
                                key={dept.id}
                                dept={dept}
                                expanded={!!expandedDept[dept.id]}
                                onToggle={handleExpandDepartment}
                                onEdit={handleOpenEditModal}
                                onDelete={handleOpenDeleteModal}
                                onAddGroup={handleOpenCreateGroupModal}
                            >
                                <Grid container spacing={2}>
                                    {dept.groups?.map(group => (
                                        <Grid item xs={12} md={6} lg={4} key={group.id}>
                                            <GroupCard
                                                group={group}
                                                onEdit={handleOpenEditModal}
                                                onDelete={handleOpenDeleteModal}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </DepartmentCard>
                        ))}
                    </DashboardCard>
                </Grid>
            </Grid>

            {/* Create Modal */}
            <Modal open={createModalOpen} onClose={handleCloseModal}>
                <Box sx={{ width: '50%', p: 4, bgcolor: 'background.paper', borderRadius: 2, mx: 'auto', mt: '10%' }}>
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

            {/* Edit Modal */}
            <Modal open={editModalOpen} onClose={handleCloseModal}>
                <Box sx={{ width: '50%', p: 4, bgcolor: 'background.paper', borderRadius: 2, mx: 'auto', mt: '10%' }}>
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

            {/* Delete Modal */}
            <Modal open={deleteModalOpen} onClose={handleCloseModal}>
                <Box sx={{ width: '40%', p: 4, bgcolor: 'background.paper', borderRadius: 2, mx: 'auto', mt: '10%' }}>
                    <Typography variant="h6" mb={3}>
                        Xác nhận xóa {selectedDept?.departmentName || selectedDept?.groupName}?
                    </Typography>
                    <Box display="flex" justifyContent="flex-end" gap={2}>
                        <Button onClick={handleCloseModal} variant="outlined">Hủy</Button>
                        <Button onClick={handleDeleteItem} variant="contained" color="error">Xóa</Button>
                    </Box>
                </Box>
            </Modal>
        </PageContainer>
    );
};

export default Department;
