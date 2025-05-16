import React, { useState, useEffect, useMemo } from 'react';
import {
    Box,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Pagination,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    Chip,
    IconButton,
    Paper,
    InputAdornment
} from '@mui/material';
import { IconSearch, IconEye, IconCheck, IconEdit } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import ApiService from 'src/service/ApiService';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';

const ITEMS_PER_PAGE = 10;

const PayrollList = () => {
    const navigate = useNavigate();
    const [payrolls, setPayrolls] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [monthFilter, setMonthFilter] = useState('');
    const [yearFilter, setYearFilter] = useState('');
    const [quarterFilter, setQuarterFilter] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const departmentsData = await ApiService.getAllDepartments();
                const employeesData = await ApiService.getAllUsers();
                let payrollsData;
                if (monthFilter && yearFilter) {
                    payrollsData = await ApiService.calculateAllSalaries(monthFilter, yearFilter);
                } else if (quarterFilter && yearFilter) {
                    payrollsData = await ApiService.getSalariesByQuarter(yearFilter, quarterFilter);
                } else if (yearFilter) {
                    payrollsData = await ApiService.getSalariesByYear(yearFilter);
                } else {
                    payrollsData = await ApiService.getSalariesByQuarter(2025, 2); // Default
                }

                console.log('Fetched departments:', departmentsData);
                console.log('Fetched employees:', employeesData);
                console.log('Fetched payrolls:', payrollsData);

                setDepartments(departmentsData);
                setEmployees(employeesData);
                setPayrolls(payrollsData);
            } catch (err) {
                setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [monthFilter, yearFilter, quarterFilter]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setPage(1);
    };

    const handleDepartmentFilter = (e) => {
        setDepartmentFilter(e.target.value);
        setPage(1);
    };

    const handleMonthFilter = (e) => {
        setMonthFilter(e.target.value);
        setQuarterFilter(''); // Reset quarter filter when month is selected
        setPage(1);
    };

    const handleYearFilter = (e) => {
        setYearFilter(e.target.value);
        setPage(1);
    };

    const handleQuarterFilter = (e) => {
        setQuarterFilter(e.target.value);
        setMonthFilter(''); // Reset month filter when quarter is selected
        setPage(1);
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleViewDetail = (userId, month, year) => {
        navigate(`/manage/payroll/detail/${userId}/${month}/${year}`);
    };

    const filteredPayrolls = useMemo(() => payrolls.filter((payroll) => {
        const employee = employees.find(emp => emp.id === payroll.userId);
        const department = departments.find(dept => dept.groups?.some(group => group.id === employee?.groupId));
        const matchesName = payroll.userFullName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = departmentFilter === '' || department?.id === parseInt(departmentFilter);
        return matchesName && matchesDept;
    }), [payrolls, employees, departments, searchTerm, departmentFilter]);

    const paginatedPayrolls = useMemo(() => {
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        return filteredPayrolls.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredPayrolls, page]);

    const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

    if (loading) {
        return (
            <PageContainer>
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                </Box>
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer>
                <Box sx={{ p: 3, textAlign: 'center', color: 'error.main' }}>
                    <Typography variant="h6">{error}</Typography>
                </Box>
            </PageContainer>
        );
    }

    return (
        <PageContainer title="Payroll List" description="Manage employee payrolls">
            <DashboardCard>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" fontWeight="bold">Quản lý lương</Typography>
                </Box>

                {/* Filters */}
                <Paper elevation={1} sx={{ p: 2, mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <TextField
                        size="small"
                        placeholder="Tìm kiếm theo tên nhân viên..."
                        value={searchTerm}
                        onChange={handleSearch}
                        InputProps={{ startAdornment: <InputAdornment position="start"><IconSearch size={18} /></InputAdornment> }}
                        sx={{ flex: 1, minWidth: 200 }}
                    />
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel>Phòng ban</InputLabel>
                        <Select value={departmentFilter} onChange={handleDepartmentFilter} label="Phòng ban">
                            <MenuItem value="">Tất cả</MenuItem>
                            {departments.map((dept) => (
                                <MenuItem key={dept.id} value={dept.id}>{dept.departmentName}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 100 }}>
                        <InputLabel>Tháng</InputLabel>
                        <Select value={monthFilter} onChange={handleMonthFilter} label="Tháng">
                            <MenuItem value="">Tất cả</MenuItem>
                            {[...Array(12).keys()].map(i => (
                                <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 100 }}>
                        <InputLabel>Quý</InputLabel>
                        <Select value={quarterFilter} onChange={handleQuarterFilter} label="Quý">
                            <MenuItem value="">Tất cả</MenuItem>
                            {[1, 2, 3, 4].map(q => (
                                <MenuItem key={q} value={q}>Quý {q}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 100 }}>
                        <InputLabel>Năm</InputLabel>
                        <Select value={yearFilter} onChange={handleYearFilter} label="Năm">
                            <MenuItem value="">Tất cả</MenuItem>
                            {[2024, 2025, 2026].map(year => (
                                <MenuItem key={year} value={year}>{year}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Paper>

                {/* Table */}
                <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Tên nhân viên</strong></TableCell>
                                <TableCell><strong>Phòng ban - Nhóm</strong></TableCell>
                                <TableCell><strong>Tháng</strong></TableCell>
                                <TableCell><strong>Năm</strong></TableCell>
                                <TableCell align="right"><strong>Lương cơ bản</strong></TableCell>
                                <TableCell align="right"><strong>Tổng lương</strong></TableCell>
                                <TableCell align="right"><strong>Số ngày làm</strong></TableCell>
                                <TableCell align="center"><strong>Trạng thái</strong></TableCell>
                                <TableCell align="center"><strong>Thao tác</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedPayrolls.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} align="center">Không có dữ liệu lương</TableCell>
                                </TableRow>
                            ) : (
                                paginatedPayrolls.map((payroll) => {
                                    const employee = employees.find(emp => emp.id === payroll.userId);
                                    const department = departments.find(dept => dept.groups?.some(group => group.id === employee?.groupId));
                                    return (
                                        <TableRow key={payroll.id} hover>
                                            <TableCell>{payroll.userFullName}</TableCell>
                                            <TableCell>{department?.departmentName || 'N/A'} - {employee?.groupName || 'N/A'}</TableCell>
                                            <TableCell>{payroll.month}</TableCell>
                                            <TableCell>{payroll.year}</TableCell>
                                            <TableCell align="right">{formatCurrency(payroll.monthSalary ?? 0)}</TableCell>
                                            <TableCell align="right">{formatCurrency(payroll.totalSalary ?? 0)}</TableCell>
                                            <TableCell align="right">{payroll.numberOfWorkingDays ?? 'N/A'}</TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={payroll.note === 'Tiền lương đang được điều chỉnh' ? 'Điều chỉnh' : 'Đã duyệt'}
                                                    color={payroll.note === 'Tiền lương đang được điều chỉnh' ? 'warning' : 'success'}
                                                    size="small"
                                                    variant="outlined"
                                                    icon={payroll.note === 'Tiền lương đang được điều chỉnh' ? <IconEdit size={16} /> : <IconCheck size={16} />}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton onClick={() => handleViewDetail(payroll.userId, payroll.month, payroll.year)}>
                                                    <IconEye size={20} />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Pagination */}
                {Math.ceil(filteredPayrolls.length / ITEMS_PER_PAGE) > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Pagination count={Math.ceil(filteredPayrolls.length / ITEMS_PER_PAGE)} page={page} onChange={handlePageChange} color="primary" />
                    </Box>
                )}
            </DashboardCard>
        </PageContainer>
    );
};

export default PayrollList;