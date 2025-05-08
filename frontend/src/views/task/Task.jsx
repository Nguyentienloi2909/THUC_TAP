import React, { useState, useEffect } from 'react';
import {
    Grid, Card, Typography, Box, Chip, Tabs, Tab,
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Tooltip, IconButton, CircularProgress,
    Button
} from '@mui/material';
import {
    IconPlus, IconEdit, IconTrash, IconDownload,
    IconCheck, IconClockHour4, IconClock, IconAlertCircle
} from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import { useNavigate } from 'react-router-dom';

const STATUS_CONFIG = {
    completed: {
        label: 'Hoàn thành',
        color: 'success',
        icon: <IconCheck size={16} />
    },
    'in progress': {
        label: 'Đang thực hiện',
        color: 'primary',
        icon: <IconClockHour4 size={16} />
    },
    pending: {
        label: 'Chờ xử lý',
        color: 'warning',
        icon: <IconClock size={16} />
    },
    overdue: {
        label: 'Quá hạn',
        color: 'error',
        icon: <IconAlertCircle size={16} />
    }
};

const TaskStatusChip = ({ status }) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
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

// Mock data
const mockTasks = [
    {
        id: 1,
        title: 'Phát triển tính năng đăng nhập',
        description: 'Xây dựng hệ thống xác thực người dùng',
        status: 'completed',
        startTime: '2024-02-01',
        endTime: '2024-02-15',
        assignedToName: 'Nguyễn Văn A',
        urlFile: 'https://example.com/file1.pdf',
        priority: 'High',
        progress: 100,
        comments: [
            { id: 1, text: 'Đã hoàn thành UI', date: '2024-02-10' }
        ]
    },
    {
        id: 2,
        title: 'Thiết kế giao diện dashboard',
        description: 'Tạo layout và các component cho dashboard',
        status: 'in progress',
        startTime: '2024-02-10',
        endTime: '2024-02-25',
        assignedToName: 'Trần Thị B',
        urlFile: null,
        priority: 'Medium',
        progress: 60,
        comments: []
    },
    {
        id: 3,
        title: 'Tối ưu hiệu suất ứng dụng',
        description: 'Phân tích và cải thiện thời gian tải trang',
        status: 'pending',
        startTime: '2024-02-20',
        endTime: '2024-03-05',
        assignedToName: 'Lê Văn C',
        urlFile: 'https://example.com/file2.pdf',
        priority: 'Low',
        progress: 0,
        comments: []
    },
    {
        id: 4,
        title: 'Sửa lỗi báo cáo',
        description: 'Khắc phục lỗi hiển thị dữ liệu trong báo cáo tháng',
        status: 'overdue',
        startTime: '2024-01-25',
        endTime: '2024-02-01',
        assignedToName: 'Phạm Thị D',
        urlFile: null,
        priority: 'High',
        progress: 80,
        comments: [
            { id: 2, text: 'Đã xác định được nguyên nhân', date: '2024-01-28' }
        ]
    }
];

const Task = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState(mockTasks); // Initialize with mockTasks
    const [loading, setLoading] = useState(false); // Start with false since we have initial data
    const [selectedTab, setSelectedTab] = useState(0);
    const [error, setError] = useState(null);

    // Define tab configuration
    const tabs = [
        { label: "Tất cả", value: "all" },
        { label: "Chờ xử lý", value: "pending" },
        { label: "Đang thực hiện", value: "in progress" },
        { label: "Hoàn thành", value: "completed" },
        { label: "Quá hạn", value: "overdue" }
    ];

    // Update fetchTasks to properly filter based on selected tab
    const fetchTasks = async () => {
        try {
            setLoading(true);
            setError(null);

            const currentStatus = tabs[selectedTab].value;

            // Filter tasks based on selected status
            const filteredTasks = currentStatus === 'all'
                ? mockTasks
                : mockTasks.filter(task => task.status === currentStatus);

            setTasks(filteredTasks);
            setLoading(false);
        } catch (err) {
            setError('Đã xảy ra lỗi khi tải dữ liệu');
            setLoading(false);
        }
    };

    // Update useEffect to depend on selectedTab
    useEffect(() => {
        fetchTasks();
    }, [selectedTab]);

    const handleDelete = async (taskId, event) => {
        event.stopPropagation();
        try {
            // Add confirmation dialog here if needed
            setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        } catch (err) {
            console.error('Error deleting task:', err);
        }
    };

    const handleEdit = (taskId, event) => {
        event.stopPropagation();
        navigate(`/manage/task/edit/${taskId}`);
    };

    const handleTaskClick = (taskId) => {
        navigate(`/manage/task/${taskId}`);
    };

    return (
        <PageContainer title="Nhiệm vụ của tôi" description="Danh sách nhiệm vụ được giao">
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" fontWeight="bold">
                        Quản lý nhiệm vụ
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<IconPlus />}
                        onClick={() => navigate('/manage/task/create')}
                    >
                        Thêm nhiệm vụ
                    </Button>
                </Box>

                <Tabs
                    value={selectedTab}
                    onChange={(e, newValue) => setSelectedTab(newValue)}
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        '& .MuiTab-root': {
                            minWidth: 120,
                            fontWeight: 500
                        }
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
                ) : tasks.length === 0 ? (
                    <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
                        Không có nhiệm vụ nào
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
                                {tasks.map((task) => (
                                    <TableRow
                                        key={task.id}
                                        hover
                                        onClick={() => handleTaskClick(task.id)}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell>
                                            <Typography variant="subtitle2">{task.title}</Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                {task.description}
                                            </Typography>
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
                                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                {task.urlFile && (
                                                    <Tooltip title="Tải tài liệu">
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                window.open(task.urlFile, '_blank');
                                                            }}
                                                        >
                                                            <IconDownload size={18} />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                                <Tooltip title="Chỉnh sửa">
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={(e) => handleEdit(task.id, e)}
                                                    >
                                                        <IconEdit size={18} />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Xóa">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={(e) => handleDelete(task.id, e)}
                                                    >
                                                        <IconTrash size={18} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Card>
        </PageContainer>
    );
};

export default Task;