import './index.css';

import vi from 'antd/lib/locale/vi_VN';
import { Provider } from 'mobx-react';
import 'moment-timezone';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
// import registerServiceWorker from './registerServiceWorker';
import { auth, firebaseApp, firestore } from 'firebase';
import { RootProvider, rootStore, useStore } from 'stores';
import initializeStores from './stores/storeInitializer';

import { Spin } from 'antd';
import ConfigProvider from 'antd/es/config-provider';
import { UserInfo } from 'models/User/dto';
import moment from 'moment';
import 'moment/locale/vi';
import { useState } from 'react';
import { RecoilRoot, useSetRecoilState } from 'recoil';
import { permissionsAtom } from 'stores/atom/permission';
import { userInfoAtom } from 'stores/atom/user';


// moment.tz.setDefault(abp.timing.timeZoneInfo.iana.timeZoneId);
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


const stores = initializeStores();
moment().locale('vi');

firebaseApp();


const RootApp = () =>
{
    const {
        projectStore,
        sessionStore,
        permission,
    } = useStore();
    const [appState,setAppState] = useState(false);
    const [loginState,setLoginState] = useState(false);
    const setUser = useSetRecoilState(userInfoAtom);
    const setPermissions = useSetRecoilState(permissionsAtom);

    auth.onAuthStateChanged((user)=>
    {
        if (user)
        {
            const uid = user.uid;
            firestore.getByDoc('Users',uid).then((doc:UserInfo) =>
            {
                setUser(doc);

                sessionStore.setCurrentLogin(doc).then(val=>
                {
                    const p = permission.getMyPermission(val);
                    setPermissions(p);
                    setAppState(true);
                    setLoginState(true);
                });
                projectStore.getProject(user.uid);
            });
        }
        else
        {
            // User is signed out
            // ...
            console.log('out');
            setLoginState(false);
            
        }
    });

    if (!loginState)
    {
        return (
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );
    }

    return (appState || loginState
        ? (
               
                <BrowserRouter>
                    <App />
                </BrowserRouter>
                     
            )
        : (
                <div
                    style={{
                        width: '100vw',
                        height: '100vh',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Spin tip="Loading..." />
                </div>
            )
    );
};

ReactDOM.render(
    <RecoilRoot>
        <Provider
            {...stores}
            value={{
                store: stores,
            }}
        >
            <RootProvider value={rootStore}>
                <ConfigProvider locale={vi}>
                    <RootApp />
                </ConfigProvider>
            </RootProvider>
        </Provider>
    </RecoilRoot>
    ,
    document.getElementById('root') as HTMLElement,
);

// registerServiceWorker();

