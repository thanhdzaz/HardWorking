/* eslint-disable no-unused-vars */
import Loading from 'components/Loading';
import { auth, firebaseApp, firestore } from 'firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { observer } from 'mobx-react';
import { UserInfo } from 'models/User/dto';
import { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useStore } from 'stores';
import { permissionsAtom } from 'stores/atom/permission';
import { userInfoAtom } from 'stores/atom/user';
import './App.css';
import Router from './components/Router';


const App = observer(()=>
{
    const {
        sessionStore,
        permission,
        projectStore,
    } = useStore();

    const [permissions,setPermissions] = useRecoilState(permissionsAtom);
    const setUser = useSetRecoilState(userInfoAtom);


    const [isReady,setIsReady] = useState(false);
    // const _ = useForceUpdate();


    useEffect(()=>
    {
        permissions;
    },[permissions]);


    !auth.currentUser && onAuthStateChanged(getAuth(firebaseApp()),(user) =>
    {
            
        if (user)
        {
            const uid = user.uid;
            console.log(uid,'uid');
            firestore.getByDoc('Users',uid).then((doc:UserInfo) =>
            {
                setUser(doc);

                sessionStore.setCurrentLogin(doc).then(val=>
                {
                    const p = permission.getMyPermission(val);
                    setPermissions(p);
                });
                projectStore.getProject(user.uid);
            }).finally(()=>
            {
                setTimeout(() =>
                {
                    setIsReady(true);
                },500);
            });
        }
        else
        {
            // User is signed out
            // ...
        }
    });


    if (!isReady && permission.myPermissions.length > 0) // ((!permission.permissionsList || permission.permissionsList.length === 0) || !permission.myPermissions || permission.myPermissions.length === 0)
    {
        return (
            <div>
                <Loading />
            </div>
        );
    }
  
    return (
        <Router />
    );
    
});
    

export default App;
