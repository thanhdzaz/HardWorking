import LoadableComponent from '../Loadable/index';
import { ProjectOutlined, UserOutlined, QuestionCircleOutlined, HomeOutlined } from '@ant-design/icons';

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
        permission: '',
        title: 'Dự án',
        showInMenu: true,
        component: LoadableComponent(() => import('scenes/Project')),
    },

    {
        path: '/task',
        name: 'task',
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
