import { Layout } from 'antd';
import LoadingOverlay from 'components/Loading/LoadingOverlay';
import { observer } from 'mobx-react';
import { useState } from 'react';
import DocumentTitle from 'react-document-title';
import { Redirect, Route, Switch } from 'react-router-dom';
import utils from '../../utils/utils';
import Footer from '../Footer';
import Header from '../Header';
import NotFoundRoute from '../Router/NotFoundRoute';
import ProtectedRoute from '../Router/ProtectedRoute';
import { appRoutersAndChild } from '../Router/router.config';
import SiderMenu from '../SiderMenu';
import './AppLayout.less';
// import { appRouters } from '../Router/router.config';

const { Content } = Layout;


const AppLayout = observer(
    (
        props,
    )=>
    {
        const [collapsed,setCollapsed] = useState(false);

        const {
            history,
            location: { pathname },
        } = props;

        console.log(appRoutersAndChild,'appRoutersAndChild');
        
  
        const { path } = props.match;
  
        const layout = (
            <Layout style={{ minHeight: '100vh' }}>
                <LoadingOverlay />
                <SiderMenu
                    path={path}
                    history={history}
                    collapsed={collapsed}
                    onCollapse={()=>
                    {
                        setCollapsed(true);
                    }}
                />
                <Layout style={{ position: 'relative' }}>
                   
  
                    <Layout.Header style={{ background: '#fff', minHeight: 52, padding: 0 }}>
                        <Header
                            collapsed={collapsed}
                            toggle={()=>
                            {
                                setCollapsed(!collapsed);
                            }}
                            data={appRoutersAndChild}
                        />
                    </Layout.Header>
                    <Content
                        id="main-content-all-page"
                        style={{ margin: 8 }}
                    >
                        <Switch>
                            {pathname === '/' && (
                                <Redirect
                                    from="/"
                                    to="/dashboard" // default page for '/'
                                />
                            )}
                            {appRoutersAndChild
                                .filter((item: any) => !item.isLayout)
                                .map((route: any, index: any) => (
                                    <Route
                                        key={index}
                                        path={route.path}
                                        render={() => (
                                            <ProtectedRoute
                                                component={route.component}
                                                permission={route.permission}
                                            />
                                        )}
                                        exact
                                    />
                                ))}
                            {pathname !== '/' && <NotFoundRoute />}
                        </Switch>
                    </Content>
                    <Footer />
                </Layout>
            </Layout>
        );
  
        return <DocumentTitle title={utils.getPageTitle(pathname)}>{layout}</DocumentTitle>;
    },

    
);


export default AppLayout;
