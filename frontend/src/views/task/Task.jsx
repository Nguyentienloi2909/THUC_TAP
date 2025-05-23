// src/views/task/task.jsx
import React, { useState, useEffect } from 'react';
import {
    Grid, Card, Typography, Box, Chip, Tabs, Tab,
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Tooltip, IconButton, CircularProgress,
    Button, Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import {
    IconPlus, IconEdit, IconTrash, IconDownload,
    IconCheck, IconClockHour4, IconClock, IconAlertCircle,
} from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import { useNavigate } from 'react-router-dom';
import AddTaskPage from './Add';
import ApiService from '../../service/ApiService';
import TaskActions from './TaskActions';
import { useUser } from 'src/contexts/UserContext'; // Thêm useUser

// Hàm ánh xạ trạng thái từ API sang cấu hình hiển thị
const createStatusConfig = (statusList) => {
    const defaultConfig = {
        pending: {
            label: 'Chờ xử lý',
            color: 'warning',
            icon: <IconClock size={16} />,
        },
        inprogress: {
            label: 'Đang thực hiện',
            color: 'primary',
            icon: <IconClockHour4 size={16} />,
        },
        late: {
            label: 'Muộn',
            color: 'error',
            icon: <IconAlertCircle size={16} />,
        },
        completed: {
            label: 'Hoàn thành',
            color: 'success',
            icon: <IconCheck size={16} />,
        },
        cancelled: {
            label: 'Đã hủy',
            color: 'default',
            icon: <IconAlertCircle size={16} />,
        },
    };

    const config = {};
    statusList.forEach(status => {
        const normalizedStatus = status.name.toLowerCase().replace(/\s+/g, '');
        config[normalizedStatus] = {
            ...defaultConfig[normalizedStatus],
            label: defaultConfig[normalizedStatus]?.label || status.name,
            color: defaultConfig[normalizedStatus]?.color || 'default',
            icon: defaultConfig[normalizedStatus]?.icon || <IconClock size={16} />,
        };
    });

    return config;
};

// Component hiển thị trạng thái
const TaskStatusChip = ({ status }) => {
    const config = status && statusConfig[status.toLowerCase().replace(/\s+/g, '')] || {
        label: 'Không xác định',
        color: 'default',
        icon: <IconClock size={16} />,
    };
    return (
        <Chip
            icon={config.icon}
            label={config.label}
            color={config.color}
            size="small"
            sx={{ minWidth: 120 }}
        />
    );
};

let statusConfig = {};

const Task = () => {
    const navigate = useNavigate();
    const { user } = useUser(); // Lấy user từ UserContext
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);
    const [error, setError] = useState(null);
    const [openAddTaskDialog, setOpenAddTaskDialog] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState({ open: false, action: null, taskId: null });
    const [statusList, setStatusList] = useState([]);

    const fetchStatusList = async () => {
        try {
            const statuses = await ApiService.getStatusTask();
            setStatusList(statuses);
            statusConfig = createStatusConfig(statuses);
        } catch (err) {
            console.error('Error fetching status list:', err);
            setError('Không thể tải danh sách trạng thái.');
        }
    };

    const fetchUserTasks = async () => {
        if (!user.isAuthenticated || !user.userId) return;
        try {
            setLoading(true);
            setError(null);
            const userTasks = await ApiService.getTasksByUser(user.userId);
            setTasks(userTasks);
        } catch (err) {
            console.error('Error fetching tasks:', err);
            if (err.response && err.response.status === 403) {
                setError('Access denied. Please check your permissions.');
            } else {
                setError('Failed to load tasks. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user.isAuthenticated && user.userId) {
            fetchUserTasks();
            fetchStatusList();
        }
    }, [user.isAuthenticated, user.userId]);

    const tabs = [
        { label: "Tất cả", value: "all" },
        ...statusList.map(status => ({
            label: statusConfig[status.name.toLowerCase().replace(/\s+/g, '')]?.label || status.name,
            value: status.name.toLowerCase().replace(/\s+/g, ''),
        })),
    ];

    const getFilteredTasksByStatus = () => {
        const currentStatus = tabs[selectedTab].value;
        const filtered = currentStatus === 'all'
            ? tasks
            : tasks.filter(task => task.status.toLowerCase().replace(/\s+/g, '') === currentStatus);
        return filtered;
    };

    const filteredTasks = getFilteredTasksByStatus();

    const viewTaskDetails = (taskId) => {
        navigate(`/manage/task/${taskId}`);
    };

    const handleDelete = async (taskId, event) => {
        event.stopPropagation();
        setConfirmDialog({ open: true, action: 'delete', taskId });
    };

    const handleEdit = (taskId, event) => {
        event.stopPropagation();
        setConfirmDialog({ open: true, action: 'edit', taskId });
    };

    const confirmAction = async () => {
        const { action, taskId } = confirmDialog;
        if (action === 'delete') {
            try {
                await ApiService.deleteTask(taskId);
                setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
            } catch (err) {
                console.error('Error deleting task:', err);
                alert('Failed to delete task. Please try again.');
            }
        } else if (action === 'edit') {
            navigate(`/manage/task/update/${taskId}`);
        }
        setConfirmDialog({ open: false, action: null, taskId: null });
    };

    const handleAddTask = async (newTask) => {
        try {
            if (!newTask.title || !newTask.description || !newTask.startTime || !newTask.endTime || !newTask.assignedToId) {
                alert('Please fill in all required fields.');
                return;
            }

            const formData = new FormData();
            formData.append('Title', newTask.title);
            formData.append('Description', newTask.description);
            formData.append('File', newTask.file);
            formData.append('StartTime', newTask.startTime);
            formData.append('EndTime', newTask.endTime);
            formData.append('AssignedToId', newTask.assignedToId);

            const createdTask = await ApiService.createTask(formData);
            setTasks([...tasks, createdTask]);
            setOpenAddTaskDialog(false);
            alert('Task added successfully!');
        } catch (err) {
            console.error('Error adding task:', err);
            alert('Failed to add task. Please try again.');
        }
    };

    // Hàm cắt ngắn description
    const truncateDescription = (description, maxLength = 50) => {
        if (!description) return "Không có mô tả";
        if (description.length <= maxLength) return description;
        return description.substring(0, maxLength) + "...";
    };

    return (
        <PageContainer title="Nhiệm vụ của tôi" description="Danh sách nhiệm vụ được giao">
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" fontWeight="bold">
                        Quản lý nhiệm vụ
                    </Typography>
                    {user.role === 'LEADER' && (
                        <Button
                            variant="contained"
                            startIcon={<IconPlus />}
                            onClick={() => setOpenAddTaskDialog(true)}
                        >
                            Thêm nhiệm vụ
                        </Button>
                    )}
                </Box>

                <Tabs
                    value={selectedTab}
                    onChange={(e, newValue) => setSelectedTab(newValue)}
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        '& .MuiTab-root': {
                            minWidth: 120,
                            fontWeight: 500,
                        },
                    }}
                >
                    {tabs.map((tab, index) => (
                        <Tab
                            key={tab.value}
                            label={tab.label}
                            id={`task-tab-${index}`}
                            aria-controls={`task-tabpanel-${index}`}
                        />
                    ))}
                </Tabs>
            </Box>

            <Card sx={{ borderRadius: 2 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Box sx={{ p: 3, textAlign: 'center', color: 'error.main' }}>
                        {error}
                    </Box>
                ) : !user.isAuthenticated ? (
                    <Box sx={{ p: 3, textAlign: 'center', color: 'error.main' }}>
                        Vui lòng đăng nhập để xem nhiệm vụ
                    </Box>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tiêu đề</TableCell>
                                    <TableCell>Người thực hiện</TableCell>
                                    <TableCell align="center">Trạng thái</TableCell>
                                    <TableCell>Ngày bắt đầu</TableCell>
                                    <TableCell>Ngày kết thúc</TableCell>
                                    <TableCell align="center">Thao tác</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredTasks.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            Không có nhiệm vụ nào
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredTasks.map((task) => (
                                        <TableRow
                                            key={task.id}
                                            hover
                                            onClick={() => viewTaskDetails(task.id)}
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            <TableCell>
                                                <Typography variant="subtitle2">{task.title}</Typography>
                                                <Tooltip title={task.description || "Không có mô tả"} placement="top">
                                                    <Typography variant="caption" color="textSecondary">
                                                        {truncateDescription(task.description, 50)}
                                                    </Typography>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>{task.assignedToName}</TableCell>
                                            <TableCell align="center">
                                                <TaskStatusChip status={task.status} />
                                            </TableCell>
                                            <TableCell>
                                                {new Date(task.startTime).toLocaleDateString('vi-VN')}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(task.endTime).toLocaleDateString('vi-VN')}
                                            </TableCell>
                                            <TableCell align="center">
                                                <TaskActions
                                                    task={task}
                                                    onEdit={handleEdit}
                                                    onDelete={handleDelete}
                                                    role={user.role} // Sử dụng user.role
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Card>

            <Dialog
                open={confirmDialog.open}
                onClose={() => setConfirmDialog({ open: false, action: null, taskId: null })}
            >
                <DialogTitle>Xác nhận</DialogTitle>
                <DialogContent>
                    Bạn có chắc chắn muốn {confirmDialog.action === 'delete' ? 'xóa' : 'chỉnh sửa'} nhiệm vụ này?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialog({ open: false, action: null, taskId: null })} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={confirmAction} color="primary" variant="contained">
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>

            <AddTaskPage
                open={openAddTaskDialog}
                onClose={() => setOpenAddTaskDialog(false)}
                onAdd={handleAddTask}
            />
        </PageContainer>
    );
};

export default Task;