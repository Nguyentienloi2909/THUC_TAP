import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, Button, Tooltip } from '@mui/material';
import {
    IconCalendarTime,
    IconCalendarStats,
    IconClockCheck,
    IconReportAnalytics,
    IconClockPause,
    IconClockEdit
} from '@tabler/icons-react';

const AttendanceMiniTools = () => {
    const navigate = useNavigate();
    const tools = [
        // { icon: IconCalendarTime, label: 'Chấm công', color: 'primary', path: '/manage/attendance/checkwork' },
        // { icon: IconCalendarStats, label: 'Thống kê', color: 'secondary' },
        { icon: IconClockCheck, label: 'Duyệt công', color: 'success' },
        // { icon: IconReportAnalytics, label: 'Báo cáo', color: 'info' },
        { icon: IconClockPause, label: 'Nghỉ phép', color: 'warning' },
        { icon: IconClockEdit, label: 'Điều chỉnh', color: 'error' }
    ];

    const handleClick = (path) => {
        if (path) {
            navigate(path);
        }
    };

    return (
        <Stack direction="row" spacing={2} sx={{ mb: 3, overflowX: 'auto', pb: 1 }}>
            {tools.map((tool, index) => (
                <Tooltip key={index} title={tool.label}>
                    <Button
                        variant="contained"
                        color={tool.color}
                        startIcon={<tool.icon />}
                        sx={{ minWidth: 'auto', whiteSpace: 'nowrap' }}
                        onClick={() => handleClick(tool.path)}
                    >
                        {tool.label}
                    </Button>
                </Tooltip>
            ))}
        </Stack>
    );
};

export default AttendanceMiniTools;