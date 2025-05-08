import React, { useState } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, Card, CardContent } from '@mui/material';
import ApiService from 'src/service/ApiService';

const GUpdate = ({ group, departmentId, onUpdated, onCancel }) => {
    const [name, setName] = useState(group?.groupName || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Extract departmentName from group
    const departmentName = group?.departmentName;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            console.log('Updating group with data:', {
                id: group.id,
                departmentId: departmentId || group.departmentId,
                departmentName: departmentName || group.departmentName,
                groupName: name
            });

            const response = await ApiService.updateGroup(group.id, {
                departmentName: departmentName || group.departmentName,
                departmentId: departmentId || group.departmentId,
                groupName: name
            });

            console.log('Group update API response:', response);
            if (onUpdated) onUpdated();
        } catch (err) {
            console.error('API error:', err);
            console.error('Error details:', err.response?.data);
            setError(err.response?.data?.message || err.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Cập nhật nhóm
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <TextField
                        label="Tên nhóm"
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
                            {loading ? <CircularProgress size={24} /> : 'Cập nhật'}
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default GUpdate;