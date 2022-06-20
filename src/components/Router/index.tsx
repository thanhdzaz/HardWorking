

import { Route, Switch } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import utils from '../../utils/utils';

const Router = ():any =>
{
    const UserLayout = utils.getRoute('/user').component;
    const AppLayout = utils.getRoute('/').component;

    return (
        <Switch>
            <Route
                path="/user"
                render={(props: any) => <UserLayout {...props} />}
            />
            <ProtectedRoute
                render={(props: any) => (
                    <AppLayout
                        {...props}
                        exact
                    />
                )}
            />
        </Switch>
    );
};

export default Router;
