import { Box, Button, Typography, useTheme, Card, CardContent } from "@mui/material";
import { tokens } from "../../theme";
import EditIcon from "@mui/icons-material/Edit";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { Person, Email, Phone, Home } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const InfoAcc = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  // Mock user data
  const userData = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    contact: "+1234567890",
    address1: "123 Main Street",
    address2: "Apartment 4B",
  };

  const handleEditClick = () => {
    navigate("/info/editinfo", { state: { userData } });
  };

  return (
    <Box m="20px">
      <Header title="Tài khoản" subtitle="Thông tin tài khoản" />

      <Box
        display="grid"
        gap="20px"
        gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))"
        mt="20px"
      >
        {/* User Information */}
        {[
          { icon: <Person />, label: "Họ", value: userData.firstName },
          { icon: <Person />, label: "Tên", value: userData.lastName },
          { icon: <Email />, label: "Email", value: userData.email },
          { icon: <Phone />, label: "Số điện thoại", value: userData.contact },
          { icon: <Home />, label: "Địa chỉ 1", value: userData.address1 },
          { icon: <Home />, label: "Địa chỉ 2", value: userData.address2 },
        ].map((item, index) => (
          <Card key={index} sx={{ backgroundColor: colors.grey[600] }}>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ color: colors.grey[300] }}>{item.icon}</Box>
              <Box>
                <Typography variant="h6" color="textSecondary">
                  {item.label}
                </Typography>
                <Typography variant="body1" color={colors.grey[100]}>
                  {item.value}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box display="flex" justifyContent="flex-end" mt="30px">
        <Button
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            fontSize: "16px",
            fontWeight: "bold",
            padding: "12px 24px",
            borderRadius: "8px",
          }}
          onClick={handleEditClick}
        >
          <EditIcon sx={{ mr: "10px" }} />
          Sửa thông tin tài khoản
        </Button>
      </Box>
    </Box>
  );
};

export default InfoAcc;
