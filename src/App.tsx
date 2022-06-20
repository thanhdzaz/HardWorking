import './App.css';
import { inject } from 'mobx-react';
import Router from './components/Router';
import SessionStore from './stores/sessionStore';
import Stores from './stores/storeIdentifier';
import React from 'react';

export interface IAppProps {
    sessionStore?: SessionStore;
}

@inject(Stores.SessionStore)
@inject(Stores.AuthenticationStore)
class App extends React.Component<IAppProps>
{


    render(): JSX.Element
    {
        return (
            <Router />
        );
    }
}
export default App;
