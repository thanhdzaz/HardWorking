/* eslint-disable no-unused-vars */
import Loading from 'components/Loading';
import { firebaseApp, firestore } from 'firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { observer } from 'mobx-react';
import { UserInfo } from 'models/User/dto';
import { useEffect, useState } from 'react';
import { useStore } from 'stores';
import './App.css';
import Router from './components/Router';


const App = observer(()=>
{
    const {
        sessionStore,
        permission,
    } = useStore();

    const [permissions,setPermissions] = useState<string[]>([]);

    // const _ = useForceUpdate();

    useEffect(()=>
    {
        permissions;
    },[permissions]);

    useEffect(()=>
    {
        onAuthStateChanged(getAuth(firebaseApp()),(user) =>
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
                });
            }
            else
            {
                // User is signed out
                // ...
            }
        });

    },[]);

    if (!permission.permissionsList || permission.permissionsList.length === 0)
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
