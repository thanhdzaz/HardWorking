import './AppLayout.less';
import { Redirect, Switch, Route } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import { Layout } from 'antd';
import Footer from '../Footer';
import Header from '../Header';
import ProtectedRoute from '../Router/ProtectedRoute';
import SiderMenu from '../SiderMenu';
import utils from '../../utils/utils';
import NotFoundRoute from '../Router/NotFoundRoute';
import React from 'react';
import { appRoutersAndChild } from '../Router/router.config';
import LoadingOverlay from 'components/Loading/LoadingOverlay';
// import { appRouters } from '../Router/router.config';

const { Content } = Layout;

class AppLayout extends React.Component<any>
{
  state = {
      collapsed: false,
  };

  toggle = (): void =>
  {
      this.setState({
          collapsed: !this.state.collapsed,
      });
  };

  onCollapse = (collapsed: boolean): void =>
  {
      this.setState({ collapsed });
  };

  render(): JSX.Element
  {
      const {
          history,
          location: { pathname },
      } = this.props;

      const { path } = this.props.match;
      const { collapsed } = this.state;
      //   let appRoutersAndChild = appRouters;
      //   appRouters.map((route: any) =>
      //   {
    
      //       if (route.children?.length > 0)
      //       {
      //           appRoutersAndChild = appRoutersAndChild.concat(route.children);
      //       }
      //   });

      const layout = (
          <Layout style={{ minHeight: '100vh' }}>
              <LoadingOverlay />
              <SiderMenu
                  path={path}
                  history={history}
                  collapsed={collapsed}
                  onCollapse={this.onCollapse}
              />
              <Layout style={{ position: 'relative' }}>
                 

                  <Layout.Header style={{ background: '#fff', minHeight: 52, padding: 0 }}>
                      <Header
                          collapsed={this.state.collapsed}
                          toggle={this.toggle}
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
  }
}

export default AppLayout;
