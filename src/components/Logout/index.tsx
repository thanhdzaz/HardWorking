import { firebaseApp } from 'firebase';
import { getAuth } from 'firebase/auth';
import { inject } from 'mobx-react';
import React from 'react';
import AuthenticationStore from 'stores/authenticationStore';
import Stores from 'stores/storeIdentifier';

export interface ILogoutProps {
  authenticationStore?: AuthenticationStore;
}

@inject(Stores.AuthenticationStore)
class Logout extends React.Component<ILogoutProps>
{
    componentDidMount(): void
    {
        this.props.authenticationStore?.logout();
        getAuth(firebaseApp()).signOut();
        localStorage.removeItem('project');
        window.location.href = '/';
    }

    render(): any
    {
        return null;
    }
}

export default Logout;
