
import UserStore from './userStore';
import SessionStore from './sessionStore';
import AuthenticationStore from './authenticationStore';
import AccountStore from './accountStore';


export default function initializeStores(): any
{
    return {
        authenticationStore: new AuthenticationStore(),
        userStore: new UserStore(),
        sessionStore: new SessionStore(),
        accountStore: new AccountStore(),
    };
}
