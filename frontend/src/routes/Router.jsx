import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';
import Message from '../views/message/Message';

// Layouts
const FullLayout = Loadable(lazy(() => import('../layouts/full/fulllayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

// Local Pages
const HomePage = Loadable(lazy(() => import('../views/local/Home')));
const About = Loadable(lazy(() => import('../views/local/About')));
const Leave = Loadable(lazy(() => import('../views/local/Leave')));
const NLeave = Loadable(lazy(() => import('../views/local/NLeave')));
const Settings = Loadable(lazy(() => import('../views/local/Settings')));
const Report = Loadable(lazy(() => import('../views/local/Report')));
const FeedBack = Loadable(lazy(() => import('../views/local/FeedBack')));

// Authentication Pages
const Error = Loadable(lazy(() => import('../views/authentication/Error')));
const Register = Loadable(lazy(() => import('../views/authentication/Register')));
const Login = Loadable(lazy(() => import('../views/authentication/Login')));
const Profile = Loadable(lazy(() => import('../views/authentication/Profile')));
const EditProfile = Loadable(lazy(() => import('../views/authentication/EditProfile')));
const ChangePassword = Loadable(lazy(() => import('../views/authentication/changepassword')));

// Employee Management Pages
const Employees = Loadable(lazy(() => import('../views/employee/Employees')));
const EmployeesInfo = Loadable(lazy(() => import('../views/employee/EmployeeInfo')));
const EmployeeEdit = Loadable(lazy(() => import('../views/employee/EmployeeEdit')));
const EmployeeCreate = Loadable(lazy(() => import('../views/employee/EmployeeCreate')));

// Attendance Pages
const CheckWork = Loadable(lazy(() => import('../views/attendance/CheckWork')));
const History = Loadable(lazy(() => import('../views/attendance/HistoryCheckwork')));
const TKCheckwork = Loadable(lazy(() => import('../views/attendance/TKCheckwork')));
const Attendance = Loadable(lazy(() => import('../views/attendance/Attendance')));

// Notification Pages
const NotificationDetails = Loadable(lazy(() => import('../views/notification/NotificationDetail')));

// Task Management Pages
const Tasks = Loadable(lazy(() => import('../views/task/AllTasks')));
const Task = Loadable(lazy(() => import('../views/task/task')));
const TaskInfo = Loadable(lazy(() => import('../views/task/Info')));
const AddTaskPage = Loadable(lazy(() => import('../views/task/Add')));
const TaskUpdate = Loadable(lazy(() => import('../views/task/update')));

// Group Management Pages
const Group = Loadable(lazy(() => import('../views/group/group')));
const GroupById = Loadable(lazy(() => import('../views/group/groupById')));

// Department Management Pages
const Department = Loadable(lazy(() => import('../views/department/department')));
const DepartmentEdit = Loadable(lazy(() => import('../views/department/components/dupdate')));
const DepartmentCreate = Loadable(lazy(() => import('../views/department/components/dcreate')));

// Payroll Pages
const Payroll = Loadable(lazy(() => import('../views/payroll/Payroll')));

// Role Management Pages
const Role = Loadable(lazy(() => import('../views/role/Role')));

const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      // Local Routes
      { path: '/', element: <Navigate to="/home" /> },
      { path: '/home', exact: true, element: <HomePage /> },
      { path: '/about', exact: true, element: <About /> },
      { path: '/checkwork', exact: true, element: <CheckWork /> },
      { path: '/history-checkwork/:id', exact: true, element: <History /> },
      { path: '/tkcheckwork', exact: true, element: <TKCheckwork /> },
      { path: '/nleave', exact: true, element: <NLeave /> },
      { path: '/leave', exact: true, element: <Leave /> },

      // Manage Routes
      { path: '/manage/attendance', exact: true, element: <Attendance /> },
      { path: '/manage/payroll', exact: true, element: <Payroll /> },
      { path: '/manage/employee/list', exact: true, element: <Employees /> },
      { path: '/manage/employee/info/:id', exact: true, element: <EmployeesInfo /> },
      { path: '/manage/employee/edit/:id', exact: true, element: <EmployeeEdit /> },
      { path: '/manage/employee/create', exact: true, element: <EmployeeCreate /> },
      { path: '/manage/department', exact: true, element: <Department /> },
      { path: '/manage/department/edit/:id', exact: true, element: <DepartmentEdit /> },
      { path: '/manage/department/create', exact: true, element: <DepartmentCreate /> },
      { path: '/manage/role', exact: true, element: <Role /> },
      { path: '/manage/tasks', exact: true, element: <Tasks /> },
      { path: '/manage/task', exact: true, element: <Task /> },
      { path: '/manage/task/:id', exact: true, element: <TaskInfo /> },
      { path: '/manage/task/add', exact: true, element: <AddTaskPage /> },
      { path: '/manage/task/update/:id', exact: true, element: <TaskUpdate /> },
      { path: '/manage/group', exact: true, element: <Group /> },
      { path: '/manage/group/:id', exact: true, element: <GroupById /> },
      { path: '/auth/changepassword', exact: true, element: <ChangePassword /> },
      // Other Routes
      { path: '/notification/:id', exact: true, element: <NotificationDetails /> },
      { path: '/messages', exact: true, element: <Message /> },
      { path: '/profile', exact: true, element: <Profile /> },
      { path: '/edit-profile', exact: true, element: <EditProfile /> },

      { path: '/settings', exact: true, element: <Settings /> },
      { path: '/report', exact: true, element: <Report /> },
      { path: '/feedback', exact: true, element: <FeedBack /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/auth',
    element: <BlankLayout />,
    children: [
      { path: '404', element: <Error /> },
      { path: '/auth/register', element: <Register /> },

      { path: '/auth/login', element: <Login /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

export default Router;

