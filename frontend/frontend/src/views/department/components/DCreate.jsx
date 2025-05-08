import React, { useState } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, Card, CardContent } from '@mui/material';
import ApiService from 'src/service/ApiService';

const DCreate = ({ onCreated, onCancel }) => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await ApiService.createDepartment({ departmentName: name });
            if (onCreated) onCreated();
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Create failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Tạo mới phòng ban
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <TextField
                        label="Tên phòng ban"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        fullWidth
                        required
                        disabled={loading}
                        sx={{ mb: 2 }}
                    />
                    {error && (
                        <Typography color="error" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={onCancel} color="inherit" sx={{ mr: 1 }} disabled={loading}>
                            Hủy
                        </Button>
                        <Button type="submit" variant="contained" color="primary" disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : 'Tạo mới'}
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default DCreate;