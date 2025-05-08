import React, { useState } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, Card, CardContent } from '@mui/material';
import ApiService from 'src/service/ApiService';

const DUpdate = ({ department, onUpdated, onCancel }) => {
    const [name, setName] = useState(department?.departmentName || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const dataToSend = { 
                departmentId: department.id, // Add departmentId
                departmentName: name 
            };
            console.log('Data sent to updateDepartment API:', dataToSend);
            const response = await ApiService.updateDepartment(department.id, dataToSend);
            console.log('Update department API response:', response);
            if (onUpdated) onUpdated();
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'black' }}>
                    Cập nhật phòng ban
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <TextField
                        label="Department Name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        fullWidth
                        required
                        disabled={loading}
                        sx={{ mb: 2, '& .MuiInputBase-input': { color: 'black' } }}
                        InputLabelProps={{ style: { color: 'black' } }}
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

export default DUpdate;