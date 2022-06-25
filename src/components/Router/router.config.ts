import LoadableComponent from '../Loadable/index';

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
        title: 'Dashboard',
        showInMenu: true,
        component: LoadableComponent(() => import('scenes/Dashboard')),
        children: [],
    },
    {
        path: '/users',
        name: 'users',
        permission: '',
        title: 'Quản lý người dùng',
        showInMenu: true,
        component: LoadableComponent(() => import('scenes/User')),
        children: [],
    },
    {
        path: '/project',
        name: 'project',
        permission: '',
        title: 'Dự án',
        showInMenu: true,
        component: LoadableComponent(() => import('scenes/Project')),
    },

    {
        path: '/about',
        name: 'abiot',
        permission: '',
        title: 'About',
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
