import React, { useState } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, Card, CardContent } from '@mui/material';
import ApiService from 'src/service/ApiService';

const GCreate = ({ departmentId, departmentName, onCreated, onCancel }) => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            console.log('Creating group with data:', { 
                departmentId: departmentId,
                groupName: name 
            });
            
            const response = await ApiService.createGroup({ 
                departmentId: departmentId,
                groupName: name 
            });
            
            console.log('Group creation API response:', response);
            if (onCreated) onCreated();
        } catch (err) {
            console.error('API error:', err);
            console.error('Error details:', err.response?.data);
            setError(err.response?.data?.message || err.message || 'Create failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Tạo mới nhóm trong phòng ban: {departmentName}
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
                            {loading ? <CircularProgress size={24} /> : 'Tạo mới'}
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default GCreate;