

import { Route, Switch } from 'react-router-dom';

import utils from '../../utils/utils';
import ProtectedRoute from './ProtectedRoute';

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
