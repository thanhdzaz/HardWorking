

import { isGranted } from 'lib/abpUtility';
import {
    Redirect,
    Route,
} from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { permissionsAtom } from 'stores/atom/permission';


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

    const permissionList = useRecoilValue(permissionsAtom);
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
                if (permission && !isGranted(permission,permissionList))
                {
                    return (
                        <Redirect
                            to={{
                                pathname: '/dashboard',
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
