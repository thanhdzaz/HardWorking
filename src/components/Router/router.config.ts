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
