import React from 'react';
import { Box, Typography, Container, Grid, Paper } from '@mui/material';

const About = () => {
    return (
        <Container maxWidth="lg" sx={{ py: 4, bgcolor: '#f5f5f5' }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 4, color: '#1976d2' }}>
                    Về Công Ty LD Technology
                </Typography>
                <Typography gutterBottom align="center" sx={{ mb: 10 }}>
                    <img
                        src="src/assets/images/logos/logo-3.svg"
                        alt="Ảnh logo Cty"
                        style={{ width: '300px', height: 'auto' }}
                    />
                </Typography>
                <Grid container spacing={4} sx={{ mt: 4 }}>
                    <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', height: '100%', border: '5px solid #ccc', borderRadius: '8px', p: 2, '&:hover': { borderColor: '#1976d2', boxShadow: 3 } }}>
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium', textAlign: 'center', color: '#1976d2' }}>
                                Giới Thiệu Hệ Thống
                            </Typography>
                            <Typography variant="body1" paragraph sx={{ textAlign: 'justify', color: '#333', mb: 2 }}>
                                Hệ thống Quản lý Nhân sự là một ứng dụng web hiện đại, được thiết kế để tối ưu hóa quy trình quản lý nhân sự trong doanh nghiệp. Với giao diện thân thiện và tính năng đa dạng, hệ thống giúp doanh nghiệp quản lý hiệu quả thông tin nhân viên, chấm công, lương thưởng và đánh giá hiệu suất.
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', height: '100%', border: '5px solid #ccc', borderRadius: '8px', p: 2, '&:hover': { borderColor: '#1976d2', boxShadow: 3 } }}>
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium', textAlign: 'center', color: '#1976d2' }}>
                                Tính Năng Chính
                            </Typography>
                            <Typography variant="body1" paragraph sx={{ textAlign: 'justify', color: '#333', mb: 2 }}>
                                <Box component="ul" sx={{ pl: 4 }}>
                                    <Box component="li">Quản lý thông tin nhân viên toàn diện</Box>
                                    <Box component="li">Phân quyền và quản lý người dùng</Box>
                                    <Box component="li">Quản lý chấm công và nghỉ phép</Box>
                                    <Box component="li">Tính lương và phụ cấp tự động</Box>
                                    <Box component="li">Đánh giá hiệu suất nhân viên</Box>
                                    <Box component="li">Báo cáo và thống kê chi tiết</Box>
                                </Box>
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', height: '100%', border: '5px solid #ccc', borderRadius: '8px', p: 2, '&:hover': { borderColor: '#1976d2', boxShadow: 3 } }}>
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium', textAlign: 'center', color: '#1976d2' }}>
                                Lợi Ích
                            </Typography>
                            <Typography variant="body1" paragraph sx={{ textAlign: 'justify', color: '#333', mb: 2 }}>
                                <Box component="ul" sx={{ pl: 4 }}>
                                    <Box component="li">Tự động hóa quy trình quản lý nhân sự</Box>
                                    <Box component="li">Giảm thiểu sai sót trong xử lý dữ liệu</Box>
                                    <Box component="li">Tiết kiệm thời gian và chi phí quản lý</Box>
                                    <Box component="li">Tăng cường bảo mật thông tin</Box>
                                    <Box component="li">Hỗ trợ ra quyết định nhanh chóng</Box>
                                </Box>
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', height: '100%', border: '5px solid #ccc', borderRadius: '8px', p: 2, '&:hover': { borderColor: '#1976d2', boxShadow: 3 } }}>
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium', textAlign: 'center', color: '#1976d2' }}>
                                Hỗ Trợ Người Dùng
                            </Typography>
                            <Typography variant="body1" paragraph sx={{ textAlign: 'justify', color: '#333', mb: 2 }}>
                                <Box component="ul" sx={{ pl: 4 }}>
                                    <Box component="li">Giao diện thân thiện, dễ sử dụng</Box>
                                    <Box component="li">Hướng dẫn sử dụng chi tiết</Box>
                                    <Box component="li">Hỗ trợ kỹ thuật 24/7</Box>
                                    <Box component="li">Cập nhật tính năng thường xuyên</Box>
                                    <Box component="li">Bảo mật dữ liệu theo tiêu chuẩn</Box>
                                </Box>
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default About;