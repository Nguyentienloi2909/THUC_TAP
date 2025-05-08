import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from 'src/contexts/SearchContext'; // Thêm dòng này
import {
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination
} from '@mui/material';
import ApiService from '../../service/ApiService';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import EmployeeMiniTools from './components/EmployeeminiTools';


const Employees = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(10);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const [search, setSearch] = useState(''); // Xóa dòng này
    const { search } = useSearch(); // Lấy search từ context
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                setLoading(true);
                const response = await ApiService.getAllUsers();
                setEmployees(response);
            } catch (error) {
                setError(error.response?.data?.message || error.message || 'Failed to load employees');
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleEmployeeClick = (employeeId) => {
        navigate(`/manage/employee/info/${employeeId}`);
    };

    // Filter employees by search value
    const filteredEmployees = employees.filter(emp =>
        emp.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        emp.email?.toLowerCase().includes(search.toLowerCase()) ||
        emp.phoneNumber?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <PageContainer title="Danh sách nhân viên" description="Quản lý danh sách nhân viên">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <DashboardCard title="Quản lý nhân viên">
                        <EmployeeMiniTools />
                        <TableContainer component={Paper}>
                            <Table
                                sx={{
                                    minWidth: 650,
                                    '& .MuiTableCell-root': {
                                        border: '1px solid rgba(224, 224, 224, 1)',
                                        padding: '16px'
                                    },
                                    '& .MuiTableHead-root': {
                                        '& .MuiTableRow-root': {
                                            backgroundColor: '#e3f2fd'
                                        }
                                    },
                                    '& .MuiTableBody-root': {
                                        '& .MuiTableRow-root': {
                                            '&:nth-of-type(odd)': {
                                                backgroundColor: '#fafafa'
                                            },
                                            '&:nth-of-type(even)': {
                                                backgroundColor: '#ffffff'
                                            },
                                            '&:hover': {
                                                backgroundColor: '#f5f5f5'
                                            }
                                        }
                                    }
                                }}
                                aria-label="employee table"
                            >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell align="center">Họ và tên</TableCell>
                                        <TableCell align="center">Giới tính</TableCell>
                                        <TableCell align="center">Chức vụ</TableCell>
                                        <TableCell align="center">Phòng ban</TableCell>
                                        <TableCell align="center">Số điện thoại</TableCell>
                                        <TableCell align="center">Email</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredEmployees.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center">
                                                Không tìm thấy bản ghi nào
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredEmployees
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((employee) => (
                                                <TableRow
                                                    key={employee.id}
                                                    onClick={() => handleEmployeeClick(employee.id)}
                                                    sx={{
                                                        cursor: 'pointer',
                                                        '&:hover': {
                                                            backgroundColor: '#f5f5f5'
                                                        }
                                                    }}
                                                >
                                                    <TableCell align="center">{employee.id}</TableCell>
                                                    <TableCell>{employee.fullName}</TableCell>
                                                    <TableCell align="center">{employee.gender === true ? 'Nam' : employee.gender === false ? 'Nữ' : 'N/A'}</TableCell>
                                                    <TableCell align="center">{employee.roleName}</TableCell>
                                                    <TableCell align="center">{employee.groupName}</TableCell>
                                                    <TableCell align="center">{employee.phoneNumber}</TableCell>
                                                    <TableCell align="center">{employee.email}</TableCell>
                                                </TableRow>
                                            ))
                                    )}
                                </TableBody>
                            </Table>
                            <TablePagination
                                component="div"
                                count={filteredEmployees.length}
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                rowsPerPageOptions={[10]}
                                labelDisplayedRows={({ from, to, count }) =>
                                    `${from}-${to} trên ${count}`
                                }
                            />
                        </TableContainer>
                    </DashboardCard>
                </Grid>
            </Grid>
        </PageContainer>
    );
};

export default Employees;
