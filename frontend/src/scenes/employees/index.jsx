import { Box, Typography, Button, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import InfoIcon from '@mui/icons-material/Info';
import AddIcon from '@mui/icons-material/Add';
import Header from "../../components/Header";

const Employees = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Họ và tên",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "age",
      headerName: "Tuổi",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "phone",
      headerName: "Số điện thoại",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "address",
      headerName: "Địa chỉ",
      flex: 1,
    },
    {
      field: "accessLevel",
      headerName: "Chức vụ",
      flex: 1,
      renderCell: ({ row: { access } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              access === "admin"
                ? colors.greenAccent[600]
                : access === "manager"
                  ? colors.greenAccent[700]
                  : colors.greenAccent[700]
            }
            borderRadius="4px"
          >
            {access === "admin" && <AdminPanelSettingsOutlinedIcon />}
            {access === "manager" && <SecurityOutlinedIcon />}
            {access === "user" && <LockOpenOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {access}
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="Nhân viên" subtitle="Trang quản lý nhân viên" />
      <Box>
        <Button
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px 20px",
          }}
        >
          <AddIcon sx={{ mr: "10px" }} />
          Thêm nhân viên
        </Button>
        <></>
        <Button
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px 20px",
            marginLeft: "10px",
          }}
        >
          <InfoIcon sx={{ mr: "10px" }} />
          Xem chi tiết
        </Button>
      </Box>

      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          // checkboxSelection
          rows={mockDataTeam}
          columns={columns}
        //components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Employees;



// // src/pages/employees/Employees.jsx
// import React, { useState, useEffect } from "react";
// import { Box, Typography, Button, useTheme } from "@mui/material";
// import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// import { tokens } from "../../theme";
// import { getAllEmployee } from "../../api/reportsApi"; // Hàm gọi API lấy danh sách nhân viên
// import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
// import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
// import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
// import InfoIcon from "@mui/icons-material/Info";
// import AddIcon from "@mui/icons-material/Add";
// import Header from "../../components/Header";

// const Employees = () => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);

//   // State chứa dữ liệu nhân viên, trạng thái loading và lỗi (nếu có)
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Cấu hình các cột cho DataGrid
//   const columns = [
//     { field: "id", headerName: "ID", width: 90 },
//     {
//       field: "name",
//       headerName: "Họ và tên",
//       flex: 1,
//       cellClassName: "name-column--cell",
//     },
//     {
//       field: "age",
//       headerName: "Tuổi",
//       type: "number",
//       headerAlign: "left",
//       align: "left",
//       width: 100,
//     },
//     {
//       field: "phone",
//       headerName: "Số điện thoại",
//       flex: 1,
//     },
//     {
//       field: "email",
//       headerName: "Email",
//       flex: 1,
//     },
//     {
//       field: "access",
//       headerName: "Quyền truy cập",
//       flex: 1,
//       renderCell: ({ row: { access } }) => {
//         return (
//           <Box
//             width="60%"
//             m="0 auto"
//             p="5px"
//             display="flex"
//             justifyContent="center"
//             backgroundColor={
//               access === "admin"
//                 ? colors.greenAccent[600]
//                 : access === "manager"
//                 ? colors.greenAccent[700]
//                 : colors.greenAccent[700]
//             }
//             borderRadius="4px"
//           >
//             {access === "admin" && <AdminPanelSettingsOutlinedIcon />}
//             {access === "manager" && <SecurityOutlinedIcon />}
//             {access === "user" && <LockOpenOutlinedIcon />}
//             <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
//               {access}
//             </Typography>
//           </Box>
//         );
//       },
//     },
//   ];

//   // Sử dụng useEffect để gọi API lấy dữ liệu nhân viên khi component khởi tạo
//   useEffect(() => {
//     async function fetchEmployees() {
//       try {
//         const data = await getAllEmployee();
//         setEmployees(data);
//       } catch (err) {
//         setError(err.message || "Lỗi khi gọi API");
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchEmployees();
//   }, []);

//   if (loading)
//     return (
//       <Box m="20px">
//         <Typography variant="h6">Đang tải dữ liệu...</Typography>
//       </Box>
//     );
//   if (error)
//     return (
//       <Box m="20px">
//         <Typography variant="h6" color="error">
//           Lỗi tải dữ liệu: {error}
//         </Typography>
//       </Box>
//     );

//   return (
//     <Box m="20px">
//       <Header title="Nhân viên" subtitle="Trang quản lý nhân viên" />
//       <Box mb="20px">
//         <Button
//           sx={{
//             backgroundColor: colors.blueAccent[700],
//             color: colors.grey[100],
//             fontSize: "14px",
//             fontWeight: "bold",
//             padding: "10px 20px",
//           }}
//         >
//           <AddIcon sx={{ mr: "10px" }} />
//           Thêm nhân viên
//         </Button>
//         <Button
//           sx={{
//             backgroundColor: colors.blueAccent[700],
//             color: colors.grey[100],
//             fontSize: "14px",
//             fontWeight: "bold",
//             padding: "10px 20px",
//             ml: "10px",
//           }}
//         >
//           <InfoIcon sx={{ mr: "10px" }} />
//           Xem chi tiết
//         </Button>
//       </Box>

//       <Box
//         height="75vh"
//         sx={{
//           "& .MuiDataGrid-root": {
//             border: "none",
//           },
//           "& .MuiDataGrid-cell": {
//             borderBottom: "none",
//           },
//           "& .name-column--cell": {
//             color: colors.greenAccent[300],
//           },
//           "& .MuiDataGrid-columnHeaders": {
//             backgroundColor: colors.blueAccent[700],
//             borderBottom: "none",
//           },
//           "& .MuiDataGrid-virtualScroller": {
//             backgroundColor: colors.primary[400],
//           },
//           "& .MuiDataGrid-footerContainer": {
//             borderTop: "none",
//             backgroundColor: colors.blueAccent[700],
//           },
//           "& .MuiCheckbox-root": {
//             color: `${colors.greenAccent[200]} !important`,
//           },
//           "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
//             color: `${colors.grey[100]} !important`,
//           },
//         }}
//       >
//         <DataGrid
//           rows={employees} // Sử dụng dữ liệu lấy từ API
//           columns={columns}
//           components={{ Toolbar: GridToolbar }}
//         />
//       </Box>
//     </Box>
//   );
// };

// export default Employees;
