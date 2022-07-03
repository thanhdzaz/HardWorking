

import { isGranted } from 'lib/abpUtility';
import { observer } from 'mobx-react';
import {
    Redirect,
    Route,
} from 'react-router-dom';


const ProtectedRoute = observer((
    {
        component: Component,
        permission,
        render,
        ...rest
    }: {
        component?: any,
        permission?: any,
        render?: any,
        rest?: any
    },
): JSX.Element =>
{
    console.log(permission,'::::');

    return (
        <Route
            {...rest}
            render={props =>
            {
                if (!abp.auth.getToken())
                {
                    return (
                        <Redirect
                            to={{
                                pathname: '/user/login',
                                state: { from: props.location },
                            }}
                        />
                    );
                }
                if (permission && !isGranted(permission))
                {
                    return (
                        <Redirect
                            to={{
                                pathname: '/exception?type=401',
                                state: { from: props.location },
                            }}
                        />
                    );
                }

                return Component ? <Component {...props} /> : render(props);
            }}
        />
    );
});

export default ProtectedRoute;
