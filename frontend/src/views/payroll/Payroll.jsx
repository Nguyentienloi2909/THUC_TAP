import React, { useState, useEffect } from 'react';
import {
    Paper, Grid, Typography, Box, Card, CardContent, Divider,
    Button, Stack, FormControl, InputLabel, Select, MenuItem,
    CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useTheme
} from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import {
    IconPrinter, IconDownload, IconMail, IconUser, IconId,
    IconBuildingSkyscraper, IconBriefcase, IconReceipt2,
    IconCalendarEvent, IconCalendarStats, IconClockHour4,
    IconBeach, IconAward, IconCreditCard, IconBuildingBank,
    IconAlertCircle
} from '@tabler/icons-react';
import ApiService from '../../service/ApiService';

const formatCurrency = value => (
    typeof value === 'number' && !isNaN(value)
        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
        : 'N/A'
);

const InfoItem = ({ icon, label, value, bold = true }) => (
    <Stack direction="row" spacing={1.5} alignItems="center" mb={1.5}>
        <Box color="text.secondary">{React.cloneElement(icon, { size: 20 })}</Box>
        <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.2 }}>
                {label}:
            </Typography>
            <Typography variant="body1" fontWeight={bold ? 'medium' : 'normal'}>
                {value ?? 'N/A'}
            </Typography>
        </Box>
    </Stack>
);

const parseNote = (note) => {
    if (!note) return { lateDays: 0, absentDays: 0, deductions: [] };
    const regex = /(Trễ): (\d+), (Vắng): (\d+), (Số tiền trừ): ([\d,]+)/;
    const match = note.match(regex);
    if (match) {
        const lateDays = parseInt(match[2]);
        const absentDays = parseInt(match[4]);
        const deductionAmount = parseInt(match[6].replace(/,/g, ''));
        return {
            lateDays,
            absentDays,
            deductions: [{ title: 'Khấu trừ (Trễ/Vắng)', amount: deductionAmount }]
        };
    }
    return { lateDays: 0, absentDays: 0, deductions: [] };
};

const Payroll = () => {
    const theme = useTheme ? useTheme() : {};
    const [profile, setProfile] = useState(null);
    const [salary, setSalary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [month, setMonth] = useState(() => {
        const now = new Date();
        if (now.getMonth() === 0) {
            return 11; // Tháng 12 (0-based)
        }
        return now.getMonth() - 1;
    }); // 0-11
    const [year, setYear] = useState(() => {
        const now = new Date();
        if (now.getMonth() === 0) {
            return now.getFullYear() - 1;
        }
        return now.getFullYear();
    });
    const [noteData, setNoteData] = useState({ lateDays: 0, absentDays: 0, deductions: [] });

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError('');
            try {
                const user = await ApiService.getUserProfile();
                setProfile(user);
                const data = await ApiService.getSalaryById(user.id, month + 1, year);
                setSalary(data);
                setNoteData(parseNote(data?.note));
            } catch (err) {
                setError(err.message || 'Không thể tải dữ liệu.');
                setSalary(null);
                setNoteData({ lateDays: 0, absentDays: 0, deductions: [] });
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [month, year]);

    if (loading) {
        return (
            <PageContainer title="Đang tải...">
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                    <CircularProgress />
                    <Typography variant="h6" sx={{ ml: 2 }}>
                        Đang tải dữ liệu phiếu lương...
                    </Typography>
                </Box>
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer title="Lỗi">
                <Alert severity="error" icon={<IconAlertCircle />}>{error}</Alert>
            </PageContainer>
        );
    }

    const { month: m, year: y, totalSalary, note, numberOfWorkingDays, monthSalary } = salary || {};
    const calculateGrossTotal = () => salary?.monthSalary || 0;
    const calculateDeductionsTotal = () => noteData.deductions.reduce((sum, item) => sum + item.amount, 0);
    const calculateNetTotal = () => salary?.totalSalary || 0;

    return (
        <PageContainer title={`Phiếu lương tháng ${m}/${y}`} description="Chi tiết lương hàng tháng">
            {/* Filters */}
            <Box mb={3} display="flex" justifyContent="space-between" flexWrap="wrap" gap={2}>
                <Typography variant="h4" fontWeight="bold">
                    Phiếu lương tháng {m}/{y}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                    <FormControl size="small">
                        <InputLabel>Tháng</InputLabel>
                        <Select value={month} label="Tháng" onChange={e => setMonth(e.target.value)}>
                            {Array.from({ length: 12 }, (_, i) => (
                                <MenuItem key={i} value={i}>{i + 1}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl size="small">
                        <InputLabel>Năm</InputLabel>
                        <Select value={year} label="Năm" onChange={e => setYear(e.target.value)}>
                            {Array.from({ length: 10 }, (_, i) => year - 5 + i).map(yOpt => (
                                <MenuItem key={yOpt} value={yOpt}>{yOpt}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>
            </Box>

            <Box mb={3} display="flex" justifyContent="flex-end">
                <Stack direction="row" spacing={1.5}>
                    <Button variant="outlined" startIcon={<IconPrinter size={18} />}>In phiếu lương</Button>
                    <Button variant="outlined" startIcon={<IconDownload size={18} />}>Tải xuống</Button>
                </Stack>
            </Box>

            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Grid container spacing={3}>
                    {/* Header with company info */}
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Box>
                                <Typography variant="h5" fontWeight="bold">CÔNG TY TNHH LD TECHNOLOGY</Typography>
                                <Typography variant="body2">Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM</Typography>
                                <Typography variant="body2">Điện thoại: (028) 1234 5678</Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="h6" fontWeight="bold" color="primary">PHIẾU LƯƠNG</Typography>
                                <Typography variant="body2">Kỳ lương: Tháng {m}/{y}</Typography>
                                <Typography variant="body2">Mã phiếu: PL{String(m).padStart(2, '0')}{y}-{profile?.id}</Typography>
                            </Box>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                    </Grid>

                    {/* Employee Information */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{ height: '100%', backgroundColor: theme.palette?.background?.default }}>
                            <CardContent>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    THÔNG TIN NHÂN VIÊN
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Họ và tên:</Typography>
                                        <Typography variant="body1" fontWeight="medium">{profile?.fullName || 'N/A'}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Phòng ban:</Typography>
                                        <Typography variant="body1">{profile?.groupName || 'N/A'}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Chức vụ:</Typography>
                                        <Typography variant="body1">{profile?.roleName || 'N/A'}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Số tài khoản ngân hàng:</Typography>
                                        <Typography variant="body1">{profile?.bankNumber || 'N/A'}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Tên ngân hàng:</Typography>
                                        <Typography variant="body1">{profile?.bankName || 'N/A'}</Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Working Information */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{ height: '100%', backgroundColor: theme.palette?.background?.default }}>
                            <CardContent>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    THÔNG TIN CÔNG VIỆC
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Số ngày làm:</Typography>
                                        <Typography variant="body1">{numberOfWorkingDays || 'N/A'} ngày</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Trạng thái lương:</Typography>
                                        <Typography variant="body1">{note === 'Tiền lương đang được điều chỉnh' ? 'Điều chỉnh' : 'Ổn định'}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Số ngày trễ:</Typography>
                                        <Typography variant="body1">{noteData.lateDays} ngày</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Số ngày vắng:</Typography>
                                        <Typography variant="body1">{noteData.absentDays} ngày</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="body2" color="text.secondary">Ghi chú:</Typography>
                                        <Typography variant="body1">{note || 'Không có'}</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="body2" color="text.secondary">Khoản khấu trừ:</Typography>
                                        <Typography variant="body1">{noteData.deductions.length > 0 ? formatCurrency(noteData.deductions[0].amount) : 'Không có'}</Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Salary Details */}
                    <Grid item xs={12}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
                            CHI TIẾT LƯƠNG
                        </Typography>
                        <TableContainer>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: theme.palette?.primary?.light + '20' }}>
                                        <TableCell width="60%"><Typography fontWeight="bold">Khoản mục</Typography></TableCell>
                                        <TableCell align="right"><Typography fontWeight="bold">Số tiền (VNĐ)</Typography></TableCell>
                                        <TableCell align="right"><Typography fontWeight="bold">Ghi chú</Typography></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {/* Income section */}
                                    <TableRow sx={{ backgroundColor: theme.palette?.background?.default }}>
                                        <TableCell colSpan={3}>
                                            <Typography fontWeight="bold">I. TỔNG THU NHẬP</Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>1. Lương cơ bản</TableCell>
                                        <TableCell align="right">{formatCurrency(monthSalary)}</TableCell>
                                        <TableCell align="right"></TableCell>
                                    </TableRow>
                                    <TableRow sx={{ backgroundColor: theme.palette?.success?.light + '20' }}>
                                        <TableCell><Typography fontWeight="bold">TỔNG THU NHẬP (GROSS)</Typography></TableCell>
                                        <TableCell align="right">
                                            <Typography fontWeight="bold">{formatCurrency(calculateGrossTotal())}</Typography>
                                        </TableCell>
                                        <TableCell align="right"></TableCell>
                                    </TableRow>

                                    {/* Deductions section */}
                                    <TableRow sx={{ backgroundColor: theme.palette?.background?.default }}>
                                        <TableCell colSpan={3}>
                                            <Typography fontWeight="bold">II. CÁC KHOẢN KHẤU TRỪ</Typography>
                                        </TableCell>
                                    </TableRow>
                                    {noteData.deductions.length === 0 ? (
                                        <TableRow>
                                            <TableCell>Không có khấu trừ</TableCell>
                                            <TableCell align="right">0</TableCell>
                                            <TableCell align="right"></TableCell>
                                        </TableRow>
                                    ) : (
                                        noteData.deductions.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{index + 1}. {item.title}</TableCell>
                                                <TableCell align="right">- {formatCurrency(item.amount)}</TableCell>
                                                <TableCell align="right">Trễ: {noteData.lateDays}, Vắng: {noteData.absentDays}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                    <TableRow sx={{ backgroundColor: theme.palette?.error?.light + '20' }}>
                                        <TableCell><Typography fontWeight="bold">TỔNG KHẤU TRỪ</Typography></TableCell>
                                        <TableCell align="right">
                                            <Typography fontWeight="bold">- {formatCurrency(calculateDeductionsTotal())}</Typography>
                                        </TableCell>
                                        <TableCell align="right"></TableCell>
                                    </TableRow>

                                    {/* Net Salary */}
                                    <TableRow sx={{ backgroundColor: theme.palette?.primary?.light + '30' }}>
                                        <TableCell>
                                            <Typography variant="h6" fontWeight="bold">LƯƠNG THỰC LÃNH (NET)</Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="h6" fontWeight="bold" color="primary.main">
                                                {formatCurrency(calculateNetTotal())}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right"></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </Paper>
        </PageContainer>
    );
};

export default Payroll;
