

import { isGranted } from 'lib/abpUtility';
import {
    Redirect,
    // Redirect,
    Route } from 'react-router-dom';

// import { isGranted } from 'lib/abpUtility';

// declare let abp: any;

const ProtectedRoute = (
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
};

export default ProtectedRoute;
