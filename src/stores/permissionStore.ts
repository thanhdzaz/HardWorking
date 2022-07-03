import { firestore } from 'firebase';
import { action, observable } from 'mobx';


export class Permissions
{

    @observable permissionsList:{
        name: string;
        key: string;
        permission: {
            name: string;
            key: string;
        }[];
    }[] = [];
    @observable myPermissions:string[] = [];

    constructor()
    {
        firestore && firestore.get('Role').then((val)=>
        {
            console.log(val);
            
            this.permissionsList = val;
        });
    }

    @action
    getMyPermission = (role:string):string[] =>
    {
        const p = this.permissionsList.find(item=>item.key === role) ?? { permission: [] };
        this.myPermissions = p.permission.map(perm =>perm.key);
        return p.permission.map(perm =>perm.key);
    };

}

