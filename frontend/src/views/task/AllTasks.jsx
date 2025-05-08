import React, { useState, useEffect } from 'react';
import {
    Grid, Card, CardContent, Typography, Button, List, ListItem,
    ListItemText, ListItemSecondaryAction, IconButton, Divider,
    Box, TextField, Chip, Stack, MenuItem, Select, FormControl,
    InputLabel
} from '@mui/material';
import { IconPlus, IconEdit, IconTrash, IconDownload, IconCalendar, IconUpload } from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import {
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Tooltip,
    Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import ApiService from '../../service/ApiService';
import Info from './Info';
import { useNavigate } from 'react-router-dom';
import AddTaskPage from './Add';

const Tasks = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openAddModal, setOpenAddModal] = useState(false);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const data = await ApiService.getAllTasks();
            setTasks(data);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleAddTask = async (newTask) => {
        try {
            const token = localStorage.getItem('token');
            console.log('Token:', token);
            console.log('Task data being sent:', newTask);

            if (!token) {
                console.log('No token found, redirecting to login');
                alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                navigate('/auth/login');
                return;
            }

            const response = await ApiService.createTask(newTask);
            console.log('Server response:', response);

            if (response) {
                console.log('Task created successfully, fetching updated list');
                await fetchTasks();
                setOpenAddModal(false);
                alert('Tạo nhiệm vụ thành công!');
            }
        } catch (error) {
            console.error('Error details:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            
            if (error.response?.status === 403) {
                alert('Bạn không có quyền thực hiện thao tác này. Vui lòng liên hệ quản trị viên.');
                return;
            }
            alert('Không thể tạo nhiệm vụ. Vui lòng thử lại sau.');
        }
    };

    const handleEdit = async (taskId, e) => {
        e?.stopPropagation();
        navigate(`/manage/task/update/${taskId}`);
    };

    const handleDelete = async (taskId, e) => {
        e?.stopPropagation();
        if (window.confirm('Bạn có chắc chắn muốn xóa nhiệm vụ này?')) {
            try {
                await ApiService.deleteTask(taskId);
                await fetchTasks();
            } catch (error) {
                console.error('Failed to delete task:', error);
                alert('Không thể xóa nhiệm vụ. Vui lòng thử lại.');
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'completed': return 'success';
            case 'in progress': return 'info';
            case 'pending': return 'warning';
            case 'late': return 'error';
            default: return 'default';
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <PageContainer title="Quản lý công việc" description="Danh sách và quản lý công việc">
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<IconPlus />}
                    onClick={() => setOpenAddModal(true)}
                >
                    Giao nhiệm vụ
                </Button>
            </Box>

            <Card elevation={0} sx={{ borderRadius: 2 }}>
                <TableContainer>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                            <CircularProgress />
                        </Box>
                    ) : tasks.length === 0 ? (
                        <Box sx={{ padding: '20px', textAlign: 'center' }}>
                            Không tìm thấy bản ghi nào
                        </Box>
                    ) : (
                        <Table sx={{ minWidth: 800 }}>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: 'background.default' }}>
                                    <TableCell sx={{ fontWeight: 600 }}>Tiêu đề</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Mô tả</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Tài liệu</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Ngày bắt đầu</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Ngày kết thúc</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Người nhận</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 600 }}>Thao tác</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tasks.map((task) => (
                                    <TableRow
                                        key={task.id}
                                        hover
                                        sx={{ cursor: 'pointer' }}
                                        onClick={() => navigate(`/manage/task/${task.id}`)} // Updated to navigate
                                    >
                                        <TableCell>{task.title}</TableCell>
                                        <TableCell>{task.description}</TableCell>
                                        <TableCell>
                                            {task.urlFile && (
                                                <Tooltip title="Tải xuống">
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        component="a"
                                                        href={task.urlFile}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={e => e.stopPropagation()}
                                                    >
                                                        <IconDownload />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                size="small"
                                                label={task.status}
                                                color={getStatusColor(task.status)}
                                                sx={{ borderRadius: 1 }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {new Date(task.startTime).toLocaleDateString('vi-VN')}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(task.endTime).toLocaleDateString('vi-VN')}
                                        </TableCell>
                                        <TableCell>
                                            {task.assignedToName ? (
                                                <Chip
                                                    size="small"
                                                    label={task.assignedToName}
                                                    variant="outlined"
                                                    sx={{ borderRadius: 1 }}
                                                />
                                            ) : (
                                                <Typography variant="caption" color="text.secondary">
                                                    N/A
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Tooltip title="Chỉnh sửa">
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={e => { e.stopPropagation(); handleEdit(task.id); }}
                                                    >
                                                        <IconEdit />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Xóa">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={e => { e.stopPropagation(); handleDelete(task.id); }}
                                                    >
                                                        <IconTrash />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </TableContainer>
            </Card>

            <AddTaskPage 
                open={openAddModal}
                onClose={() => setOpenAddModal(false)}
                onAdd={handleAddTask}
            />
        </PageContainer>
    );
};

export default Tasks;