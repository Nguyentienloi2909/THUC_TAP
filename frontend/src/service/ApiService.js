import axios from "axios";
import { id } from "date-fns/locale";

export default class ApiService {
    static BASE_URL = "http://192.168.1.145:7247/api";
    // static BASE_URL = "http://localhost:7247/api";

    static getHeader() {
        const token = localStorage.getItem("token");
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        };
    }

    static async handleRequest(method, url, data = null) {
        try {
            let headers = this.getHeader();
            if (data instanceof FormData) {
                headers = { Authorization: headers.Authorization };
            }
            const response = await axios({
                method,
                url: `${this.BASE_URL}${url}`,
                data,
                headers
            });
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    /** AUTHENTICATION */
    static loginUser(loginDetails) {
        return this.handleRequest('post', '/Auth/login', loginDetails);
    }

    static logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    }

    static isAuthenticated() {
        const token = localStorage.getItem('token');
        return !!token;
    }

    static isAdmin() {
        const role = localStorage.getItem('role');
        return role === 'ADMIN';
    }

    static isUser() {
        const role = localStorage.getItem('role');
        return role === 'USER';
    }

    /** USER MANAGEMENT */
    static createUser(formData) {
        return axios.post(`${this.BASE_URL}/Auth/Register`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then(response => response.data);
    }

    static updateUser(userId, userData) {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        };
        return axios.put(`${this.BASE_URL}/User/${userId}`, userData, {
            headers
        }).then(response => response.data);
    }

    static deleteUser(userId) {
        return axios.delete(`${this.BASE_URL}/User/${userId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then(response => response.data);
    }

    static getAllUsers() {
        return this.handleRequest('get', '/User');
    }

    static getUserProfile() {
        return this.handleRequest('get', '/User/getProfile');
    }

    static getUser(userId) {
        return this.handleRequest('get', `/User/${userId}`);
    }

    static changePassword(passwordData) {
        return this.handleRequest('post', '/User/change-password', passwordData);
    }

    /** DEPARTMENT MANAGEMENT */
    static getAllDepartments() {
        return this.handleRequest('get', '/Department');
    }

    static getDepartmentById(departmentId) {
        return this.handleRequest('get', `/Department/${departmentId}`);
    }

    static createDepartment(departmentData) {
        return this.handleRequest('post', '/Department', departmentData);
    }

    static updateDepartment(departmentId, departmentData) {
        return this.handleRequest('put', `/Department/${departmentId}`, departmentData);
    }

    static deleteDepartment(departmentId) {
        return this.handleRequest('delete', `/Department/${departmentId}`);
    }

    /** ATTENDANCE MANAGEMENT */
    static checkIn() {
        return this.handleRequest('post', '/Attendance/checkin', {})
            .then(data => {
                console.log("Điểm danh thành công:", data); // Localized message
                return data;
            })
            .catch(error => {
                console.error('Lỗi khi điểm danh:', error); // Localized message
                throw error;
            });
    }

    static checkOut(userId) {
        return this.handleRequest('post', `/Attendance/checkout?userId=${userId}`)
            .then(data => {
                console.log("Điểm danh ra thành công:", data); // Localized message
                return data;
            })
            .catch(error => {
                console.error('Lỗi khi điểm danh ra:', error); // Localized message
                throw error;
            });
    }

    static applyLeave(userId, leaveData) {
        return this.handleRequest('post', `/Attendance/leave/${userId}`, leaveData)
            .then(data => {
                console.log("Đã nộp đơn xin nghỉ thành công:", data); // Localized message
                return data;
            })
            .catch(error => {
                console.error('Lỗi khi nộp đơn xin nghỉ:', error); // Localized message
                throw error;
            });
    }


    static getTodayAttendance() {
        return this.handleRequest('get', '/Attendance/today')
            .then(data => {
                console.log("Điểm danh hôm nay:", data); // Localized message
                return data;
            })
            .catch(error => {
                console.error('Lỗi khi lấy điểm danh hôm nay:', error); // Localized message
                throw error;
            });
    }

    static getAttendance(month, year) {
        return this.handleRequest('get', `/Attendance/attendance?month=${month}&year=${year}`)
            .then(data => {
                console.log("Dữ liệu điểm danh:", data); // Localized message
                return data;
            })
            .catch(error => {
                console.error('Lỗi khi lấy dữ liệu điểm danh:', error); // Localized message
                throw error;
            });
    }

    // Lấy dữ liệu thống kê chấm công trong tuần của user
    static getTKAttendanceToWeekByUser(month, year) {
        return this.handleRequest('get', `/Attendance/summary/weekly?month=${month}&year=${year}`)
            .then(data => {
                console.log("Dữ liệu thong ke điểm danh trong Week:", data); // Localized message
                return data;
            })
            .catch(error => {
                console.error('Lỗi khi lấy dữ liệu điểm danh:', error); // Localized message
                throw error;
            });
    }

    // Lấy dữ liệu thống kê chấm công trong tháng của user
    static getTKAttendanceToMonthByUser(month, year) {
        return this.handleRequest('get', `/Attendance/summary/monthly?month=${month}&year=${year}`)
            .then(data => {
                console.log("Dữ liệu thong ke điểm danh trong Month:", data); // Localized message
                return data;
            })
            .catch(error => {
                console.error('Lỗi khi lấy dữ liệu điểm danh:', error); // Localized message
                throw error;
            });
    }

    // Lấy dữ liệu thống kê chấm công trong năm của cả hệ thống
    static getTKAttendanceToYear(year) {
        return this.handleRequest('get', `/Attendance/summary/year?year=${year}`)
            .then(data => {
                console.log("Dữ liệu thong ke điểm danh trong Month:", data); // Localized message
                return data;
            })
            .catch(error => {
                console.error('Lỗi khi lấy dữ liệu điểm danh:', error); // Localized message
                throw error;
            });
    }

    // Lấy dữ liệu thống kê chấm công trong tháng của cả hệ thống
    static getTKAttendanceToMonth(month, year) {
        return this.handleRequest('get', `/Attendance/summary/month?month=${month}&year=${year}`)
            .then(data => {
                console.log("Dữ liệu thong ke điểm danh trong Month:", data); // Localized message
                return data;
            })
            .catch(error => {
                console.error('Lỗi khi lấy dữ liệu điểm danh:', error); // Localized message
                throw error;
            });
    }

    // Lấy dữ liệu thống kê chấm công trong tuần của cả hệ thống
    static getTKAttendanceToWeek() {
        return this.handleRequest('get', `/Attendance/summary/week`)
            .then(data => {
                console.log("Dữ liệu thong ke điểm danh trong Month:", data); // Localized message
                return data;
            })
            .catch(error => {
                console.error('Lỗi khi lấy dữ liệu điểm danh:', error); // Localized message
                throw error;
            });
    }


    /** TASK MANAGEMENT */
    static createTask(taskData) {
        return this.handleRequest('.post', '/Task', taskData);
    }

    static updateTask(taskId, taskData) {
        return this.handleRequest('put', `/Task/${taskId}`, taskData);
    }

    static getTask(taskId) {
        if (!taskId) {
            console.error('Task ID is undefined');
            return Promise.reject(new Error('Task ID is undefined'));
        }
        return this.handleRequest('get', `/Task/${taskId}`);
    }

    static deleteTask(taskId) {
        return this.handleRequest('delete', `/Task/${taskId}`);
    }

    static getAllTasks() {
        return this.handleRequest('get', '/Task/all');
    }

    static getTasksByUser(userId) {
        return this.handleRequest('get', `/Task/user/${userId}`);
    }

    /** ROLE MANAGEMENT */
    static getAllRoles() {
        return this.handleRequest('get', '/Role');
    }

    static createRole(roleData) {
        return this.handleRequest('post', '/Role', roleData);
    }

    static getRole(roleId) {
        return this.handleRequest('get', `/Role/${roleId}`);
    }

    static updateRole(roleId, roleData) {
        return this.handleRequest('put', `/Role/${roleId}`, roleData);
    }

    static deleteRole(roleId) {
        return this.handleRequest('delete', `/Role/${roleId}`);
    }

    /** GROUP MANAGEMENT */
    static getAllGroups() {
        return this.handleRequest('get', '/Group');
    }

    static createGroup(groupData) {
        return this.handleRequest('post', '/Group', groupData);
    }

    static getGroup(groupId) {
        return this.handleRequest('get', `/Group/${groupId}`);
    }

    static updateGroup(groupId, groupData) {
        return this.handleRequest('put', `/Group/${groupId}`, groupData);
    }

    static deleteGroup(groupId) {
        return this.handleRequest('delete', `/Group/${groupId}`);
    }

    /** BANK MANAGEMENT */
    static getBankList() {
        return axios.get('https://api.vietqr.io/v2/banks')
            .then(response => {
                if (response.data && response.data.data) {
                    return response.data.data;
                }
                return [];
            })
            .catch(error => {
                console.error('Error fetching bank list:', error);
                return [];
            });
    }

    /** SALARY MANAGEMENT */
    static getSalaryById(userId, month, year) {
        const url = `/Salary/getSalarById?userId=${userId}&month=${month}&year=${year}`;
        return this.handleRequest('get', url);
    }

    // Lấy thông tin lương cho tất cả nhân viên trong một tháng cụ thể
    static calculateAllSalaries(month, year) {
        return this.handleRequest('get', `/Salary/calculate-all?month=${month}&year=${year}`);
    }

    // Lấy danh sách lương của tất cả nhân viên theo quý
    static getSalariesByQuarter(year, quarter) {
        const url = `/Salary/quarter/${year}/${quarter}`;
        return this.handleRequest('get', url);
    }

    // Lấy danh sách lương của tất cả nhân viên theo năm
    static getSalariesByYear(year) {
        const url = `/Salary/year/${year}`;
        return this.handleRequest('get', url);
    }

    /** NOTIFICATION MANAGEMENT */
    static sendNotification(notificationData) {
        return this.handleRequest('post', '/Notification/send', notificationData)
            .then(data => {
                console.log("Gửi thông báo thành công:", data); // Localized message
                return data;
            })
            .catch(error => {
                console.error('Lỗi khi gửi thông báo:', error); // Localized message
                throw error;
            });
    }

    static updateNotification(notificationData) {
        return this.handleRequest('put', `/Notification/${notificationData.id}`, notificationData)
            .then(data => {
                console.log("Cập nhật thông báo thành công:", data); // Localized message
                return data;
            })
            .catch(error => {
                console.error('Lỗi khi cập nhật thông báo:', error); // Localized message
                throw error;
            });
    }

    static deleteNotification(notificationId) {
        return this.handleRequest('delete', `/Notification/${notificationId}`)
            .then(data => {
                console.log("Xóa thông báo thành công:", data); // Localized message
                return data;
            })
            .catch(error => {
                console.error('Lỗi khi xóa thông báo:', error); // Localized message
                throw error;
            });
    }

    static getAllNotifications() {
        return this.handleRequest('get', '/Notification/all')
            .then(data => {
                console.log("Lấy thông báo thành công:", data); // Localized message
                return data;
            })
            .catch(error => {
                console.error('Lỗi khi lấy thông báo:', error); // Localized message
                throw error;
            });
    }

    static getStatusNotification() {
        return this.handleRequest('get', '/Notification/user')
            .then(data => {
                console.log("Lấy trạng thái thông báo thành công:", data); // Localized message
                return data;
            })
            .catch(error => {
                console.error('Lỗi khi lấy trạng thái thông báo:', error); // Localized message
                throw error;
            });
    }

    static updateStatusNotification(notificationID) {
        return this.handleRequest('put', `/Notification/user/${notificationID}`)
            .then(data => {
                console.log("Cập nhật trạng thái thông báo thành công:", data); // Localized message
                return data;
            })
            .catch(error => {

            })
    }

    /** STATUS MANAGEMENT */
    static getStatusAttendance() {
        return this.handleRequest('get', '/Status/StatusAttendance')
            .then(data => {
                console.log("Lấy trạng thái điểm danh thành công:", data); // Localized message
                return data;
            })
            .catch(error => {
                console.error('Lỗi khi lấy trạng thái điểm danh:', error); // Localized message
                throw error;
            });
    }

    static getStatusTask() {
        return this.handleRequest('get', '/Status/StatusTask')
            .then(data => {
                console.log("Lấy trạng thái công việc thành công:", data); // Localized message
                return data;
            })
            .catch(error => {
                console.error('Lỗi khi lấy trạng thái công việc:', error); // Localized message
                throw error;
            });
    }

    static getComment(taskId) {
        return this.handleRequest('get', `/Comment/${taskId}`)
            .then(data => {
                console.log("Lấy bình luận thành công:", data);
                return data;
            })
            .catch(error => {
                console.error('Lỗi khi lấy bình luận:', error);
                throw error;
            });
    }

    static async getCurrentUserId() {
        const profile = await this.getUserProfile();
        return profile?.id;
    }

    static sendComment(commentData) {
        return this.handleRequest('post', '/Comment', commentData)
            .then(data => {
                console.log("Gửi bình luận thành công:", data);
                return data;
            })
            .catch(error => {
                console.error('Lỗi khi gửi bình luận:', error);
                throw error;
            });
    }
}