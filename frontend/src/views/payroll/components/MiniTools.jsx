import React from 'react';
import { Stack, Button, Tooltip } from '@mui/material';
import {
    IconCalculator,
    IconReportMoney,
    IconCoins,
    IconScale,
    IconHeartRateMonitor,
    IconBuildingBank,
    IconReceipt2
} from '@tabler/icons-react';

const MiniTools = () => {
    const tools = [
        { icon: IconReportMoney, label: 'BẢNG LƯƠNG', color: 'primary' },
        // { icon: IconCoins, label: 'Phụ cấp', color: 'secondary' },
        // { icon: IconScale, label: 'Hệ số lương', color: 'success' },
        // { icon: IconHeartRateMonitor, label: 'Bảo hiểm', color: 'info' },
        // { icon: IconBuildingBank, label: 'Thuế TNCN', color: 'warning' },
        { icon: IconCalculator, label: 'Tính lương', color: 'warning' },
        // { icon: IconReceipt2, label: 'Phiếu lương', color: 'warning' },
    ];

    return (
        <Stack
            direction="row"
            spacing={2}
            sx={{
                mb: 3,
                overflowX: 'auto',
                pb: 1
            }}
        >
            {tools.map((tool, index) => (
                <Tooltip key={index} title={tool.label}>
                    <Button
                        variant="contained"
                        color={tool.color}
                        startIcon={<tool.icon />}
                        sx={{
                            minWidth: 'auto',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {tool.label}
                    </Button>
                </Tooltip>
            ))}
        </Stack>
    );
};

export default MiniTools;