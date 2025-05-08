import React from 'react';
import { Box, Typography, Container, Grid, Paper } from '@mui/material';

const About = () => {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                {/* <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 4 }}>
                    Về Công Ty LD Technology
                </Typography>
                <></> */}
                <Typography gutterBottom align="center" sx={{ mb: 10 }}>
                    <img
                        src="src/assets/images/logos/logo-3.svg"
                        alt="Ảnh logo Cty"
                        style={{ width: '300px', height: 'auto' }}
                    />
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Box>
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium', textAlign: 'center' }}>
                                Giới Thiệu Hệ Thống
                            </Typography>
                            <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
                                Hệ thống Quản lý Nhân sự là một ứng dụng web hiện đại, được thiết kế để tối ưu hóa quy trình quản lý nhân sự trong doanh nghiệp. Với giao diện thân thiện và tính năng đa dạng, hệ thống giúp doanh nghiệp quản lý hiệu quả thông tin nhân viên, chấm công, lương thưởng và đánh giá hiệu suất.
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Box>
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium', textAlign: 'center' }}>
                                Tính Năng Chính
                            </Typography>
                            <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
                                - Quản lý thông tin nhân viên toàn diện<br />
                                - Phân quyền và quản lý người dùng<br />
                                - Quản lý chấm công và nghỉ phép<br />
                                - Tính lương và phụ cấp tự động<br />
                                - Đánh giá hiệu suất nhân viên<br />
                                - Báo cáo và thống kê chi tiết
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Box>
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium', textAlign: 'center' }}>
                                Lợi Ích
                            </Typography>
                            <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
                                - Tự động hóa quy trình quản lý nhân sự<br />
                                - Giảm thiểu sai sót trong xử lý dữ liệu<br />
                                - Tiết kiệm thời gian và chi phí quản lý<br />
                                - Tăng cường bảo mật thông tin<br />
                                - Hỗ trợ ra quyết định nhanh chóng
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Box>
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium', textAlign: 'center' }}>
                                Hỗ Trợ Người Dùng
                            </Typography>
                            <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
                                - Giao diện thân thiện, dễ sử dụng<br />
                                - Hướng dẫn sử dụng chi tiết<br />
                                - Hỗ trợ kỹ thuật 24/7<br />
                                - Cập nhật tính năng thường xuyên<br />
                                - Bảo mật dữ liệu theo tiêu chuẩn
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default About;