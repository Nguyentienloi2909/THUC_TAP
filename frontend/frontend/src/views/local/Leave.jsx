import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Grid,
    Typography,
    MenuItem,
    FormControlLabel,
    Checkbox,
    Paper,
    Divider,
} from '@mui/material';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { useNavigate } from 'react-router-dom';
import { IconArrowLeft } from '@tabler/icons-react';

const Leave = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        department: '',
        startDate: '',
        endDate: '',
        reason: '',
        commitment: false,
        type: 'personal'
    });

    const leaveTypes = [
        { value: 'personal', label: 'Nghỉ phép cá nhân' },
        { value: 'sick', label: 'Nghỉ ốm' },
        { value: 'annual', label: 'Nghỉ phép năm' },
    ];

    const departments = [
        'Phòng Kỹ thuật',
        'Phòng Nhân sự',
        'Phòng Kinh doanh',
        'Phòng Tài chính'
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <PageContainer title="Đơn xin nghỉ phép" description="Tạo đơn xin nghỉ phép">
            <DashboardCard>
                <Paper elevation={0} sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                        <Button
                            startIcon={<IconArrowLeft />}
                            onClick={() => navigate('/nleave')}
                            sx={{ mr: 2 }}
                        >
                            Trở về
                        </Button>

                    </Box>
                    <Box sx={{ textAlign: 'center', alignItems: 'center', mb: 4 }}>
                        <Typography variant="h5">
                            Đơn xin nghỉ phép
                        </Typography>
                    </Box>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Họ và tên"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Phòng ban"
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    required
                                >
                                    {departments.map((dept) => (
                                        <MenuItem key={dept} value={dept}>
                                            {dept}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Loại nghỉ phép"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    required
                                >
                                    {leaveTypes.map((type) => (
                                        <MenuItem key={type.value} value={type.value}>
                                            {type.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Ngày bắt đầu nghỉ"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    InputLabelProps={{ shrink: true }}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Ngày kết thúc nghỉ"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    InputLabelProps={{ shrink: true }}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Lý do nghỉ phép"
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formData.commitment}
                                            onChange={(e) => setFormData({ ...formData, commitment: e.target.checked })}
                                            color="primary"
                                        />
                                    }
                                    label="Tôi cam kết những thông tin trên là đúng sự thật"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => setFormData({
                                            fullName: '',
                                            department: '',
                                            startDate: '',
                                            endDate: '',
                                            reason: '',
                                            commitment: false,
                                            type: 'personal'
                                        })}
                                    >
                                        Làm mới
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        disabled={!formData.commitment}
                                    >
                                        Gửi đơn
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </DashboardCard>
        </PageContainer>
    );
};

export default Leave;