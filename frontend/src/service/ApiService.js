import axios from "axios"

export default class ApiService {

    static BASE_URL = "http://192.168.1.145:7247/api"

    static getHeader() {
        const token = localStorage.getItem("token");
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        };
    }

    static async handleRequest(method, url, data = null) {
        try {
            // Detect FormData and set headers accordingly
            let headers = this.getHeader();
            if (data instanceof FormData) {
                // Remove Content-Type so axios/browser sets it correctly
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

    /** AUTH */
    static loginUser(loginDetails) {
        return this.handleRequest('post', '/Auth/login', loginDetails);
    }

    /** USER MANAGEMENT WITH FILE UPLOAD */
    static createUser(formData) {
        return axios.post(`${this.BASE_URL}/Auth/Register`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
                // Không cần Content-Type, axios sẽ tự động set khi dùng FormData
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
    /** USERS */
    static getAllUsers() {
        return this.handleRequest('get', '/User');
    }

    static getUserProfile() {
        return this.handleRequest('get', '/User/getProfile');
    }

    static getUser(userId) {
        return this.handleRequest('get', `/User/${userId}`);
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
    static checkIn(userId) {
        return this.handleRequest('post', `/Attendance/checkin/${userId}`)
            .then(data => {
                console.log("Check-in successful:", data); // Log check-in response
                return data;
            })
            .catch(error => {
                console.error('Error during check-in:', error);
                throw error;
            });
    }

    static checkOut(userId) {
        return this.handleRequest('post', `/Attendance/checkout/${userId}`)
            .then(data => {
                console.log("Check-out successful:", data); // Log check-out response
                return data;
            })
            .catch(error => {
                console.error('Error during check-out:', error);
                throw error;
            });
    }

    static applyLeave(userId, leaveData) {
        return this.handleRequest('post', `/Attendance/leave/${userId}`, leaveData)
            .then(data => {
                console.log("Leave applied successfully:", data); // Log leave application response
                return data;
            })
            .catch(error => {
                console.error('Error applying leave:', error);
                throw error;
            });
    }

    static getTodayAttendance() {
        return this.handleRequest('get', '/Attendance/today')
            .then(data => {
                console.log("Today's attendance:", data); // Log today's attendance
                return data;
            })
            .catch(error => {
                console.error('Error fetching today`s attendance:', error);
                throw error;
            });
    }

    static getAttendance(userId) { // Accept userId as a parameter
        return this.handleRequest('get', `/Attendance/attendance/${userId}`) // Use userId in the URL
            .then(data => {
                console.log("User's attendance:", data); // Log user's attendance
                return data;
            })
            .catch(error => {
                console.error('Error fetching user attendance:', error);
                throw error;
            });
    }

    /** AUTHENTICATION CHECKER */
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

    /** TASK MANAGEMENT */
    static createTask(taskData) {
        return this.handleRequest('post', '/Task', taskData);
    }

    static updateTask(taskId, taskData) {
        return this.handleRequest('put', `/Task/${taskId}`, taskData);
    }

    static getTask(taskId) {
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

    // Lấy danh sách ngân hàng từ API
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


    static getSalaryById(userId, month, year) {
        const url = `/Salary/getSalarById?userId=${userId}&month=${month}&year=${year}`;
        return this.handleRequest('get', url);
    }

    /** SALARY MANAGEMENT */
    static getAllSalaries(month, year) {
        const url = `/Salary/calculate-all?month=${month}&year=${year}`;
        return this.handleRequest('get', url);
    }

    /** USER PASSWORD MANAGEMENT */
    static changePassword(passwordData) {
        return this.handleRequest('post', '/User/change-password', passwordData);
    }
}
// export default new ApiService();



