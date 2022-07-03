
// store.ts
import { createContext, useContext } from 'react';
import AccountStore from './accountStore';
import AuthenticationStore from './authenticationStore';
import { Permissions } from './permissionStore';
import ProjectStore from './projectStore';
import SessionStore from './sessionStore';
import UserStore from './userStore';

export const rootStore = {
    authenticationStore: new AuthenticationStore(),
    userStore: new UserStore(),
    sessionStore: new SessionStore(),
    accountStore: new AccountStore(),
    projectStore: new ProjectStore(),
    permission: new Permissions(),
};

export type TRootStore = typeof rootStore;
const RootStoreContext = createContext<null | TRootStore>(null);

// Tạo ra provider để cung cấp store cho toàn bộ app
// dung trong file index.tsx
export const RootProvider = RootStoreContext.Provider;

/** tra lai store, chi dung o function component */
export function useStore():TRootStore
{
    /** store này sẽ chứa toàn bộ data */
    const store = useContext(RootStoreContext);
    if (store === null)
    {
        throw new Error('Store cannot be null, please add a context provider');
    }
    return store;
}
