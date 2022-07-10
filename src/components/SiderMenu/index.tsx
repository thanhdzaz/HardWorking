import './index.less';


import { Avatar, Col, Layout, Menu } from 'antd';
import { L, isGranted } from 'lib/abpUtility';

import AbpLogo from 'asset/navigation/logo.png';
import { appRouters } from '../Router/router.config';
import utils from 'utils/utils';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { permissionsAtom } from 'stores/atom/permission';

const { Sider } = Layout;
const { SubMenu } = Menu;
export interface ISiderMenuProps {
    path: any;
    collapsed: boolean;
    onCollapse: any;
    history: any;
}

export interface IMenu{

    path: string,
    permission: string,
    title: string,
    name: string,
    icon: any,
    showInMenu: boolean,
    component: any,
    children: IMenu[],
}

const SiderMenu = (props: ISiderMenuProps): JSX.Element =>
{
    const { collapsed, history, onCollapse } = props;
    const currentRoute = utils.getRoute(history.location.pathname);
    const permissionList = useRecoilValue(permissionsAtom);

    const renderMenu = (menuList: IMenu[]): JSX.Element =>
    {
        return (
            <>
                {menuList
                    .filter((item: any) => !item.isLayout && item.showInMenu)
                    .map((route: any) =>
                    {
                        if (route.permission && !isGranted(route.permission,permissionList))
                        {
                            return null;
                        }

                        if (route.children?.length)
                        {
                            return (
                                <SubMenu
                                    key={route.path}
                                    title={route.title}
                                    icon={route.icon && <route.icon />}
                                >
                                    {renderMenu(route.children)}
                                </SubMenu>
                            );
                        }

                        return (
                            <Menu.Item
                                key={route.path}
                                onClick={() => history.push(route.path)}
                            >
                                {route.icon && <route.icon />}
                                <span>{L(route.title)}</span>
                            </Menu.Item>
                        );
                    })}
            </>
        );
    };

    return (
        <>
            {/* sider desktop */}
            <Sider
                id="sider-desktop"
                trigger={null}
                className="sidebar"
                width={256}
                collapsed={collapsed}
                collapsible
                onCollapse={onCollapse}
            >
                <Link
                    to={'/dashboard'}
                    title={'Trang chủ'}
                >
                    {collapsed
                        ? (
                                <Col style={{ textAlign: 'center', marginTop: 15, marginBottom: 10 }}>
                                    <Avatar
                                        shape="square"
                                        src={AbpLogo}
                                    />
                                </Col>
                            )
                        : (
                                <Col style={{ textAlign: 'center', marginTop: 15, marginBottom: 10,display: 'flex',justifyContent: 'center',alignContent: 'center',alignItems: 'center' }}>
                                    <Avatar
                                        shape="square"
                                        src={AbpLogo}
                                    />
                                    <b style={{ color: 'white',letterSpacing: '1px', fontSize: 15,lineHeight: 5,textAlign: 'center' }}>Quản lý công việc</b>
                                </Col>
                            )}
                </Link>
                <Menu
                    id="sidermenu-scrollable"
                    theme="dark"
                    mode="inline"
                    selectedKeys={[currentRoute ? currentRoute.path : '']}
                >
                    {renderMenu(appRouters)}

                </Menu>
            </Sider>

            {/* sider mobile */}
            <Sider
                id="sider-mobile"
                trigger={null}
                className="sidebar"
                width={256}
                collapsed
                collapsible
            >
                <Col style={{ textAlign: 'center', marginTop: 15, marginBottom: 10 }}>
                    <Avatar
                        shape="square"
                        style={{ height: 27, width: 64 }}
                        src={AbpLogo}
                    />
                </Col>

                <Menu
                    id="sidermenu-scrollable"
                    theme="dark"
                    mode="inline"
                    selectedKeys={[currentRoute ? currentRoute.path : '']}
                >
                    {renderMenu(appRouters)}
                </Menu>
            </Sider>
        </>
    );
};

export default SiderMenu;
