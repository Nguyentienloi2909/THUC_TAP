import React from 'react';
import { Box, Tooltip, IconButton, Button } from '@mui/material';
import { IconDownload, IconEdit, IconTrash } from '@tabler/icons-react';

const TaskActions = ({ task, onEdit, onDelete, role, onUpdateStatus }) => {
    return (
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
            {/* {task.urlFile && (
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
            )} */}
            {role === 'LEADER' && (
                <>
                    <Tooltip title="Chỉnh sửa">
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={(e) => onEdit(task.id, e)}
                        >
                            <IconEdit size={18} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => onDelete(task.id, e)}
                        >
                            <IconTrash size={18} />
                        </IconButton>
                    </Tooltip>
                </>
            )}
            {role === 'USER' && (
                <Button
                    size="small"
                    color="success"
                    variant="contained"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onUpdateStatus) onUpdateStatus(task);
                    }}
                    disabled={task.status?.toLowerCase() === 'completed' || task.status?.toLowerCase() === 'cancelled'}
                >
                    Cập nhật
                </Button>
            )}
        </Box>
    );
};

export default TaskActions;