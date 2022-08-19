import LoadableComponent from '../Loadable/index';
import { ProjectOutlined, UserOutlined, QuestionCircleOutlined, HomeOutlined, DatabaseOutlined, CheckSquareOutlined } from '@ant-design/icons';

export const userRouter: any = [
    {
        path: '/user',
        name: 'user',
        title: 'User',
        component: LoadableComponent(() => import('../Layout/UserLayout')),
        isLayout: true,
        showInMenu: false,
    },
    {
        path: '/user/login',
        name: 'login',
        title: 'LogIn',
        component: LoadableComponent(() => import('scenes/Login')),
        showInMenu: false,
    },
];

export const appRouters: any = [
    {
        path: '/',
        exact: true,
        name: 'home',
        permission: '',
        title: 'Home',
        component: LoadableComponent(() => import('../Layout/AppLayout')),
        isLayout: true,
        showInMenu: false,
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        permission: '',
        icon: HomeOutlined,
        title: 'Dashboard',
        showInMenu: true,
        component: LoadableComponent(() => import('scenes/Dashboard')),
        children: [],
    },
    {
        path: '/u',
        name: 'u',
        icon: UserOutlined,
        permission: 'ROLES_VIEW|USERS_VIEW',
        title: 'Quản lý người dùng',
        showInMenu: true,
        children: [
            {
                path: '/users-control',
                name: 'users-control',
                title: 'Quản lý người dùng',
                permission: 'USERS_VIEW',
                showInMenu: true,
                component: LoadableComponent(() => import('scenes/User')),
            },
            {
                path: '/role-management',
                name: 'role-management',
                title: 'Quản lý vai trò',
                permission: 'ROLES_VIEW',
                component: LoadableComponent(() => import('scenes/Role')),
                showInMenu: true,
            },
        ],
    },

    {
        path: '/project',
        name: 'project',
        icon: ProjectOutlined,
        permission: 'PJ_VIEW',
        title: 'Dự án',
        showInMenu: true,
        component: LoadableComponent(() => import('scenes/Project')),
    },

    {
        path: '/task',
        name: 'task',
        icon: DatabaseOutlined,
        permission: '',
        title: 'Quản lý công việc',
        showInMenu: true,
        children: [
            {
                path: '/kanban',
                name: 'kanban',
                permission: '',
                title: 'Bảng Kanban',
                showInMenu: true,
                component: LoadableComponent(() => import('scenes/Task/Kanban')),
            },
            {
                path: '/calendar',
                name: 'calendar',
                permission: '',
                title: 'Lịch công việc',
                showInMenu: true,
                component: LoadableComponent(() => import('scenes/Task/Calendar')),
            },
            {
                path: '/list',
                name: 'list',
                permission: '',
                title: 'Danh sách',
                showInMenu: true,
                component: LoadableComponent(() => import('scenes/Task/List')),
            },
            {
                path: '/gantt',
                name: 'gantt',
                permission: '',
                title: 'Biểu đồ Gantt',
                showInMenu: true,
                component: LoadableComponent(() => import('scenes/Task/Gantt')),
            },
        ],
    },
    {
        showInMenu: false,
        name: 'u-info',
        path: '/user-info',
        title: 'Thông tin người dùng',
        component: LoadableComponent(() => import('scenes/UserInfo')),
    },

    {
        path: '/timekeeping',
        name: 'timekeeping',
        icon: CheckSquareOutlined,
        permission: '',
        title: 'Chấm công',
        showInMenu: true,
        children: [
            {
                path: '/leave-rule',
                name: 'leave-rule',
                permission: '',
                title: 'Quy định xin nghỉ',
                showInMenu: true,
                component: LoadableComponent(() => import('scenes/LeaveRule')),
            },
            {
                path: '/leave-history',
                name: 'leave-history',
                permission: '',
                title: 'Lịch sử nghỉ',
                showInMenu: true,
                component: LoadableComponent(() => import('scenes/LeaveHistory')),
            },
            {
                path: '/leave-list',
                name: 'leave-list',
                permission: '',
                title: 'Danh sách xin nghỉ',
                showInMenu: true,
                component: LoadableComponent(() => import('scenes/LeaveList')),
            },
            {
                path: '/attendance',
                name: 'attendance',
                permission: '',
                title: 'Chấm công',
                showInMenu: true,
                component: LoadableComponent(() => import('scenes/Attendance')),
            },
            {
                path: '/network-config',
                name: 'network-config',
                permission: '',
                title: 'Cấu hình dải mạng',
                showInMenu: true,
                component: LoadableComponent(() => import('scenes/Attendance/components/IpConfig')),
            },
            {
                path: '/my-timekeeping',
                name: 'my-timekeeping',
                permission: '',
                title: 'Bảng chấm công của tôi',
                showInMenu: true,
                component: LoadableComponent(() => import('scenes/MyTimekeeping')),
            },
            {
                path: '/total-timekeeping',
                name: 'total-timekeeping',
                permission: '',
                title: 'Bảng tổng hợp chấm công',
                showInMenu: true,
                component: LoadableComponent(() => import('scenes/TotalTimekeeping')),
            },
        ],
    },

    {
        path: '/about',
        name: 'abiot',
        permission: '',
        title: 'About',
        icon: QuestionCircleOutlined,
        showInMenu: true,
        component: LoadableComponent(() => import('scenes/About')),
        children: [],
    },
    {
        path: '/logout',
        permission: '',
        title: 'Logout',
        name: 'logout',
        showInMenu: false,
        component: LoadableComponent(() => import('../Logout')),
    },
];

let routersAndChild = appRouters;
appRouters.map((route: any) =>
{
    if (route.children?.length > 0)
    {
        routersAndChild = routersAndChild.concat(route.children);
    }
});

export const appRoutersAndChild = routersAndChild;

export const routers = [...userRouter, ...appRoutersAndChild];
