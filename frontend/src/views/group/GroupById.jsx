import React, { useState, useEffect } from 'react';
import {
    Grid, Typography, Box, Avatar, Card, CardContent,
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Chip, CircularProgress
} from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import ApiService from '../../service/ApiService';

const GroupById = () => {
    const [groupData, setGroupData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGroupData = async () => {
            setLoading(true);
            try {
                // Get current user's profile to get groupId
                const userProfile = await ApiService.getUserProfile();
                if (!userProfile.groupId) {
                    throw new Error('User is not assigned to any group');
                }

                // Get group details using groupId
                const response = await ApiService.getGroup(userProfile.groupId);
                setGroupData(response);
                setError(null);
            } catch (err) {
                console.error('Error fetching group data:', err);
                setError('Failed to load group data');
            } finally {
                setLoading(false);
            }
        };

        fetchGroupData();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <PageContainer title="Chi tiết nhóm" description="Thông tin chi tiết về nhóm và thành viên">
            <Grid container spacing={3}>
                {/* Group Information Card */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                {groupData?.groupName}
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Phòng ban
                                </Typography>
                                <Typography variant="body1">
                                    {groupData?.departmentName}
                                </Typography>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Trưởng nhóm
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                    {(() => {
                                        const leader = groupData?.users?.find(user => user.roleId === 3);
                                        return leader ? (
                                            <>
                                                <Avatar src={leader.avatar}>
                                                    {leader.fullName[0]}
                                                </Avatar>
                                                <Typography variant="body1">
                                                    {leader.fullName}
                                                </Typography>
                                            </>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">
                                                Chưa có trưởng nhóm
                                            </Typography>
                                        );
                                    })()}
                                </Box>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Số lượng thành viên
                                </Typography>
                                <Typography variant="body1">
                                    {groupData?.users?.length || 0} thành viên
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Members Table */}
                <Grid item xs={12} md={8}>
                    <DashboardCard title="Danh sách thành viên">
                        <TableContainer component={Paper} variant="outlined">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Thành viên</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Chức vụ</TableCell>
                                        <TableCell>Trạng thái</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {groupData?.users?.map((member) => (
                                        <TableRow key={member.id}>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar src={member.avatar}>
                                                        {member.fullName[0]}
                                                    </Avatar>
                                                    <Typography variant="body2">
                                                        {member.fullName}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>{member.email}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={member.roleId === 3 ? "Leader" : "Member"}
                                                    color={member.roleId === 3 ? "primary" : "default"}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={member.status === "Active" ? "Đang làm việc" : "Đã nghỉ việc"}
                                                    color={member.status === "Active" ? "success" : "error"}
                                                    size="small"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </DashboardCard>
                </Grid>

                {/* Statistics Cards */}
                <Grid item xs={12}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Tổng số nhiệm vụ
                                    </Typography>
                                    <Typography variant="h4">
                                        {groupData?.statistics?.totalTasks || 0}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Nhiệm vụ hoàn thành
                                    </Typography>
                                    <Typography variant="h4">
                                        {groupData?.statistics?.completedTasks || 0}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Đang thực hiện
                                    </Typography>
                                    <Typography variant="h4">
                                        {groupData?.statistics?.inProgressTasks || 0}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Tỷ lệ hoàn thành
                                    </Typography>
                                    <Typography variant="h4">
                                        {groupData?.statistics?.completionRate || 0}%
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </PageContainer>
    );
};

export default GroupById;