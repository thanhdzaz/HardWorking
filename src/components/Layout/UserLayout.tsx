import './UserLayout.less';


import { Redirect, Route, Switch } from 'react-router-dom';

import { Col } from 'antd';
import React from 'react';
import DocumentTitle from 'react-document-title';
import utils from 'utils/utils';
import Footer from '../Footer';
import { userRouter } from '../Router/router.config';

class UserLayout extends React.Component<any>
{
    render(): JSX.Element
    {
        const {
            location: { pathname },
        } = this.props;

        return (
            <DocumentTitle title={utils.getPageTitle(pathname)}>
                <Col className="container">
                    <div style={{ height: 'calc(100vh - 55px)',display: 'flex' }}>
                        <Switch>
                            {userRouter
                                .filter((item: any) => !item.isLayout)
                                .map((item: any, index: number) => (
                                    <Route
                                        key={index}
                                        path={item.path}
                                        component={item.component}
                                        exact={item.exact}
                                    />
                                ))}

                            <Redirect
                                from="/user"
                                to="/user/login"
                            />
                        </Switch>
                    </div>
                    <Footer />
                </Col>
            </DocumentTitle>
        );
    }
}

export default UserLayout;
