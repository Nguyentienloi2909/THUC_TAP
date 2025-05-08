import React, { useState, useEffect } from 'react';
import { Box, Button, Stack, Tooltip, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
    IconHistory,
    IconChartBar,
    IconLogin,
    IconLogout
} from '@tabler/icons-react';
import ApiService from '../../../service/ApiService';

const CheckTools = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [attendanceStatus, setAttendanceStatus] = useState(null);
    const [error, setError] = useState(null);

    // Fetch current attendance status
    useEffect(() => {
        const fetchAttendanceStatus = async () => {
            try {
                const userProfile = await ApiService.getUserProfile();
                const attendance = await ApiService.getAttendance(userProfile.id);
                setAttendanceStatus(attendance);
            } catch (err) {
                console.error('Error fetching attendance status:', err);
                setError(err.message);
            }
        };

        fetchAttendanceStatus();
    }, []);

    const handleCheckIn = async () => {
        try {
            setLoading(true);
            const userProfile = await ApiService.getUserProfile();
            await ApiService.checkIn(userProfile.id);
            // Refresh attendance status after check-in
            const newStatus = await ApiService.getAttendance(userProfile.id);
            setAttendanceStatus(newStatus);
        } catch (err) {
            console.error('Check-in error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckOut = async () => {
        try {
            setLoading(true);
            const userProfile = await ApiService.getUserProfile();
            await ApiService.checkOut(userProfile.id);
            // Refresh attendance status after check-out
            const newStatus = await ApiService.getAttendance(userProfile.id);
            setAttendanceStatus(newStatus);
        } catch (err) {
            console.error('Check-out error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const tools = [
        {
            title: 'Lịch sử chấm công',
            icon: <IconHistory size={20} />,
            onClick: () => navigate('/history-checkwork/1'),
            color: 'primary',
            show: true
        },
        {
            title: 'Thống kê chấm công',
            icon: <IconChartBar size={20} />,
            onClick: () => navigate('/tkcheckwork'),
            color: 'secondary',
            show: true
        },
        {
            title: 'Check-in',
            icon: <IconLogin size={20} />,
            onClick: handleCheckIn,
            color: 'success',
            show: !attendanceStatus?.checkIn
        },
        {
            title: 'Check-out',
            icon: <IconLogout size={20} />,
            onClick: handleCheckOut,
            color: 'error',
            show: attendanceStatus?.checkIn && !attendanceStatus?.checkOut
        }
    ];

    return (
        <Box sx={{ p: 1 }}>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                justifyContent="center"
            >
                {tools
                    .filter(tool => tool.show)
                    .map((tool, index) => (
                        <Tooltip key={index} title={tool.title} arrow>
                            <Button
                                variant="contained"
                                color={tool.color}
                                onClick={tool.onClick}
                                startIcon={tool.icon}
                                disabled={loading}
                                size="small"
                                sx={{
                                    minWidth: '150px',
                                    py: 1,
                                    fontSize: '0.875rem',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        transition: 'transform 0.2s'
                                    }
                                }}
                            >
                                {loading ? <CircularProgress size={20} /> : tool.title}
                            </Button>
                        </Tooltip>
                    ))}
            </Stack>
        </Box>
    );
};

export default CheckTools;