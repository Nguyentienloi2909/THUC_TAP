import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Chip, Link, Paper, Grid,
    TextField, Button, Avatar, IconButton, Stack, Divider
} from '@mui/material';
import { IconArrowLeft, IconSend } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

const API_BASE = "http://localhost:7247/api/Comment";

function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString("vi-VN");
}

function Comment({ comment, onReply }) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState("");

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!replyContent.trim()) return;

        await onReply(comment.id, replyContent);
        setReplyContent("");
        setShowReplyForm(false);
    };

    return (
        <Box sx={{ mb: 2, pl: comment.parentId ? 4 : 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar
                    src={comment.user.avatarUrl || "https://res.cloudinary.com/dpopoiskm/image/upload/v1745916572/avatars/user_28_avatar.jpg"}
                    sx={{ width: 40, height: 40, mr: 2 }}
                />
                <Box>
                    <Typography variant="subtitle2" fontWeight="bold">{comment.user.name}</Typography>
                    <Typography variant="caption" color="textSecondary">
                        {formatDate(comment.createdAt)}
                    </Typography>
                </Box>
            </Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
                {comment.content}
            </Typography>
            <Button
                size="small"
                variant="text"
                onClick={() => setShowReplyForm(!showReplyForm)}
            >
                Trả lời
            </Button>

            {showReplyForm && (
                <form onSubmit={handleReplySubmit} style={{ marginTop: '10px' }}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Viết phản hồi..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        sx={{ mb: 1 }}
                    />
                    <Button type="submit" variant="contained" size="small">
                        Gửi
                    </Button>
                </form>
            )}

            {comment.replies?.map((reply) => (
                <Comment key={reply.id} comment={reply} onReply={onReply} />
            ))}
        </Box>
    );
}

const Info = ({ task }) => {
    const navigate = useNavigate();
    const [comments, setComments] = useState([]);
    const [newContent, setNewContent] = useState("");
    const taskId = task?.id || 1;

    const fetchComments = async () => {
        try {
            const res = await fetch(`${API_BASE}/${taskId}`);
            const data = await res.json();
            setComments(data);
        } catch (error) {
            console.error("Failed to fetch comments:", error);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [taskId]);

    const handleNewComment = async (e) => {
        e.preventDefault();
        if (!newContent.trim()) return;

        try {
            await fetch(API_BASE, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    taskId,
                    userId: 2,
                    content: newContent,
                }),
            });
            setNewContent("");
            fetchComments();
        } catch (error) {
            console.error("Failed to post comment:", error);
        }
    };

    const handleReply = async (parentId, replyContent) => {
        try {
            await fetch(API_BASE, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    taskId,
                    userId: 2,
                    parentId,
                    content: replyContent,
                }),
            });
            fetchComments();
        } catch (error) {
            console.error("Failed to post reply:", error);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header with back button */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
                    <IconArrowLeft />
                </IconButton>
                <Typography variant="h5" fontWeight="bold">Chi tiết nhiệm vụ</Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Task Details */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            Thông tin chi tiết
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="body2" component="span" sx={{ mr: 1 }}>
                                <strong>Trạng thái:</strong>
                            </Typography>
                            <Chip
                                label={task?.status || "N/A"}
                                color="primary"
                                size="small"
                            />
                        </Box>

                        <Typography variant="body2" gutterBottom>
                            <strong>Người giao:</strong> {task?.assignedByName || "N/A"}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            <strong>Người nhận:</strong> {task?.assignedToName || "N/A"}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            <strong>Ngày bắt đầu:</strong> {task?.startTime && formatDate(task.startTime)}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            <strong>Ngày kết thúc:</strong> {task?.endTime && formatDate(task.endTime)}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            <strong>Mô tả:</strong> {task?.description || "Không có mô tả"}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            <strong>Tài liệu đính kèm:</strong>&nbsp;
                            {task?.urlFile ? (
                                <Link href={task.urlFile} target="_blank">
                                    {task.urlFile.split('/').pop()}
                                </Link>
                            ) : (
                                "Không có tài liệu đính kèm"
                            )}
                        </Typography>
                        {task?.urlFile && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2" gutterBottom>
                                    <strong>Xem trước tệp:</strong>
                                </Typography>
                                <img
                                    src={task.urlFile}
                                    alt="Tài liệu đính kèm"
                                    style={{ maxWidth: '100%', borderRadius: '8px' }}
                                />
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* Comments Section */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">Trao đổi công việc</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <form onSubmit={handleNewComment} style={{ marginBottom: '20px' }}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                placeholder="Nhập nội dung trao đổi..."
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                                sx={{ mb: 1 }}
                            />
                            <Button type="submit" variant="contained" startIcon={<IconSend />}>
                                Gửi
                            </Button>
                        </form>

                        {comments.map((comment) => (
                            <Comment key={comment.id} comment={comment} onReply={handleReply} />
                        ))}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Info;