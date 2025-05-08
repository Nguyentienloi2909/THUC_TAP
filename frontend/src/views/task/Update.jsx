import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Typography,
    Card,
    CardContent,
    Grid,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ApiService from '../../service/ApiService';
import PageContainer from 'src/components/container/PageContainer'; // Import PageContainer

const UpdateTaskPage = () => {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState({
        title: '',
        description: '',
        urlFile: '',
        file: null,
        startTime: '',
        endTime: '',
        status: '',
        assignedToId: '',
        assignedToName: '',
    });
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTaskAndEmployees = async () => {
            try {
                setLoading(true);
                const [taskResponse, employeesResponse] = await Promise.all([
                    ApiService.getTaskById(taskId),
                    ApiService.getAllUsers()
                ]);

                if (taskResponse) {
                    // Format dates for datetime-local input
                    const formattedTask = {
                        ...taskResponse,
                        startTime: taskResponse.startTime.slice(0, 16),
                        endTime: taskResponse.endTime.slice(0, 16)
                    };
                    setTask(formattedTask);
                }

                if (employeesResponse && Array.isArray(employeesResponse)) {
                    setEmployees(employeesResponse);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Không thể tải thông tin nhiệm vụ');
            } finally {
                setLoading(false);
            }
        };

        if (taskId) {
            fetchTaskAndEmployees();
        }
    }, [taskId]);

    const handleUpdate = async () => {
        try {
            if (!task.title || !task.assignedToId || !task.startTime || !task.endTime) {
                alert('Vui lòng điền đầy đủ thông tin bắt buộc');
                return;
            }

            await ApiService.updateTask(taskId, task);
            alert('Cập nhật nhiệm vụ thành công');
            navigate('/manage/task');
        } catch (error) {
            console.error('Failed to update task:', error);
            alert('Cập nhật nhiệm vụ thất bại');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(`Changing ${name} to`, value); // Log input changes
        setTask((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCancel = () => {
        console.log('Cancel update, navigating back to task list'); // Log cancel action
        navigate('/manage/task');
    };

    return (
        <PageContainer title="Cập nhật nhiệm vụ" description="Giao diện cập nhật nhiệm vụ">
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
                <Card sx={{ maxWidth: 800, width: '100%', boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h4" gutterBottom>
                            Cập nhật nhiệm vụ
                        </Typography>

                        <Box component="form" sx={{ mt: 2 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Tiêu đề"
                                        name="title"
                                        value={task.title}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        label="Mô tả"
                                        name="description"
                                        value={task.description}
                                        onChange={handleChange}
                                        fullWidth
                                        multiline
                                        rows={4}
                                        sx={{ mt: 2 }}
                                    />
                                    <TextField
                                        label="Tài liệu"
                                        name="urlFile"
                                        value={task.urlFile}
                                        onChange={handleChange}
                                        fullWidth
                                        sx={{ mt: 2 }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Thời gian bắt đầu"
                                        name="startTime"
                                        type="datetime-local"
                                        value={task.startTime}
                                        onChange={handleChange}
                                        InputLabelProps={{ shrink: true }}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Thời gian kết thúc"
                                        name="endTime"
                                        type="datetime-local"
                                        value={task.endTime}
                                        onChange={handleChange}
                                        InputLabelProps={{ shrink: true }}
                                        fullWidth
                                        sx={{ mt: 2 }}
                                    />
                                    <FormControl fullWidth sx={{ mt: 2 }}>
                                        <InputLabel>Trạng thái</InputLabel>
                                        <Select
                                            name="status"
                                            value={task.status}
                                            onChange={handleChange}
                                            label="Status"
                                        >
                                            <MenuItem value="Pending">Pending</MenuItem>
                                            <MenuItem value="In Progress">In Progress</MenuItem>
                                            <MenuItem value="Completed">Completed</MenuItem>
                                            <MenuItem value="Late">Late</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth sx={{ mt: 2 }}>
                                        <InputLabel>Người nhận</InputLabel>
                                        <Select
                                            name="assignedToId"
                                            value={task.assignedToId}
                                            onChange={handleChange}
                                            label="Người nhận"
                                        >
                                            {employees.map((emp) => (
                                                <MenuItem key={emp.id} value={emp.id}>
                                                    {emp.fullName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12}>
                                    <Box display="flex" justifyContent="center" mt={3} gap={2}>
                                        <Button variant="contained" color="primary" onClick={handleUpdate}>
                                            Cập nhật
                                        </Button>
                                        <Button variant="outlined" color="secondary" onClick={handleCancel}>
                                            Hủy
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </PageContainer>
    );
};

export default UpdateTaskPage;