/* eslint-disable no-unused-vars */
import Loading from 'components/Loading';
import { auth, firebaseApp, firestore } from 'firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { observer } from 'mobx-react';
import { UserInfo } from 'models/User/dto';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { useStore } from 'stores';
import { permissionsAtom } from 'stores/atom/permission';
import './App.css';
import Router from './components/Router';


const App = observer(()=>
{
    const {
        sessionStore,
        permission,
    } = useStore();

    const [permissions,setPermissions] = useRecoilState(permissionsAtom);

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
                sessionStore.setCurrentLogin(doc).then(val=>
                {
                    console.log(val,'val');
                        
                    const p = permission.getMyPermission(val);
                    setPermissions(p);
                });
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


    if (!isReady && auth.currentUser) // ((!permission.permissionsList || permission.permissionsList.length === 0) || !permission.myPermissions || permission.myPermissions.length === 0)
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
