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
    CircularProgress,
    Grid, // Import Grid component
} from '@mui/material';
import { IconUpload } from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import ApiService from '../../service/ApiService';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const AddTaskPage = ({ open = false, onClose, onAdd }) => {  // Add default value
    const getCurrentDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };

    const initialTaskState = {
        title: '',
        description: '',
        file: null,
        startTime: getCurrentDateTime(),
        endTime: '',
        status: 'Pending',
        assignedToId: '',
        assignedToName: '',
    };

    const [newTask, setNewTask] = useState(initialTaskState);
    const [fileInfo, setFileInfo] = useState({ name: '', size: '' });
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statusList, setStatusList] = useState([]);

    useEffect(() => {
        fetchUsers();
        fetchStatusList();
    }, []);

    const fetchStatusList = async () => {
        try {
            const statuses = await ApiService.getStatusTask();
            setStatusList(statuses);
        } catch (error) {
            console.error('Error fetching status list:', error);
            alert('Không thể tải danh sách trạng thái');
        }
    };

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await ApiService.getAllUsers();
            if (response && Array.isArray(response)) {
                setEmployees(response);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
            alert('Không thể tải danh sách nhân viên');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewTask(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                alert('File không được vượt quá 5MB');
                return;
            }
            setNewTask(prev => ({ ...prev, file }));
            setFileInfo({
                name: file.name,
                size: `${(file.size / 1024).toFixed(2)} KB`,
            });
        }
        e.target.value = null;
    };

    const handleEmployeeSelect = (e) => {
        const selected = employees.find(emp => emp.id === e.target.value);
        setNewTask(prev => ({
            ...prev,
            assignedToId: e.target.value,
            assignedToName: selected?.fullName || '',
        }));
    };

    const validateForm = () => {
        if (!newTask.title) return 'Vui lòng nhập tiêu đề nhiệm vụ';
        if (!newTask.assignedToId) return 'Vui lòng chọn người thực hiện';
        if (!newTask.startTime) return 'Vui lòng chọn thời gian bắt đầu';
        if (!newTask.endTime) return 'Vui lòng chọn thời gian kết thúc';
        if (new Date(newTask.endTime) <= new Date(newTask.startTime)) {
            return 'Thời gian kết thúc phải sau thời gian bắt đầu';
        }
        return null;
    };

    const handleAdd = () => {
        const error = validateForm();
        if (error) {
            alert(error);
            return;
        }

        onAdd(newTask);
        setNewTask(initialTaskState);
        setFileInfo({ name: '', size: '' });
    };

    return (
        <Dialog
            open={Boolean(open)}  // Ensure open prop is passed and converted to boolean
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>
                Giao nhiệm vụ mới
            </DialogTitle>
            <DialogContent>
                <Box component="form" sx={{ mt: 2 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                label="Tiêu đề nhiệm vụ"
                                name="title"
                                value={newTask.title}
                                onChange={handleChange}
                                fullWidth
                                required
                                variant="outlined"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Mô tả chi tiết"
                                name="description"
                                value={newTask.description}
                                onChange={handleChange}
                                fullWidth
                                multiline
                                rows={4}
                                variant="outlined"
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Thời gian bắt đầu"
                                name="startTime"
                                type="datetime-local"
                                value={newTask.startTime}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                variant="outlined"
                                inputProps={{
                                    min: getCurrentDateTime()
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Thời gian kết thúc"
                                name="endTime"
                                type="datetime-local"
                                value={newTask.endTime}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                variant="outlined"
                                inputProps={{
                                    min: newTask.startTime
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Người thực hiện</InputLabel>
                                <Select
                                    name="assignedToId"
                                    value={newTask.assignedToId}
                                    onChange={handleEmployeeSelect}
                                    label="Người thực hiện"
                                >
                                    {loading ? (
                                        <MenuItem disabled>
                                            <CircularProgress size={20} sx={{ mr: 1 }} /> Đang tải...
                                        </MenuItem>
                                    ) : employees.map((emp) => (
                                        <MenuItem key={emp.id} value={emp.id}>
                                            {emp.fullName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Trạng thái</InputLabel>
                                <Select
                                    name="status"
                                    value={newTask.status}
                                    onChange={handleChange}
                                    label="Trạng thái"
                                >
                                    {statusList.map((status) => (
                                        <MenuItem key={status.id} value={status.name}>
                                            {status.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Button
                                    variant="outlined"
                                    component="label"
                                    startIcon={<IconUpload />}
                                >
                                    Tải lên tài liệu
                                    <input type="file" hidden onChange={handleFileChange} />
                                </Button>
                                {fileInfo.name && (
                                    <Typography variant="body2" color="textSecondary">
                                        {fileInfo.name} ({fileInfo.size})
                                    </Typography>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button variant="outlined" onClick={onClose}>
                    Hủy
                </Button>
                <Button variant="contained" onClick={handleAdd}>
                    Giao nhiệm vụ
                </Button>
            </DialogActions>
        </Dialog>
    );
};

AddTaskPage.defaultProps = {
    open: false,
    onClose: () => { },
    onAdd: () => { },
};

export default AddTaskPage;