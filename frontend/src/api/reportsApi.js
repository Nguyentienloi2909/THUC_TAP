// src/api/reportsApi.js
import axios from "axios";

// Base URL cho API (sửa lại đúng địa chỉ backend khi có)
const API_BASE_URL = "https://192.168.1.145/api";

// Lấy tất cả các employee
export const getAllEmployee = async () => {
    const res = await axios.get(`${API_BASE_URL}/employees`);
    return res.data;
};
