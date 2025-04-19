import { useState } from "react";
import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
// import "../../css/login-register.css";

const Login = ({ setIsAuthenticated }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logic kiểm tra dữ liệu giả lập
        if (username === "dat" && password === "dat") {
            setIsAuthenticated(true);
            navigate("/");
        } else {
            setError("Tên đăng nhập hoặc mật khẩu không đúng");
        }
    };

    return (
        <Box className="login-register-container" style={{ backgroundColor: theme.palette.background.default }}>
            <Box className="login-register-box">
                <Typography variant="h4">Đăng Nhập</Typography>
                <Box component="form" onSubmit={handleSubmit} className="login-register-form">
                    <TextField
                        label="Tên đăng nhập"
                        variant="outlined"
                        fullWidth
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <TextField
                        label="Mật khẩu"
                        variant="outlined"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        required
                        autoComplete="current-password"
                    />
                    {error && (
                        <Typography className="error-message">{error}</Typography>
                    )}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                    >
                        Đăng Nhập
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default Login;