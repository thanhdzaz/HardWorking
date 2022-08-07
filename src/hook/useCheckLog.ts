import { auth, firestore } from 'firebase';


export const checkLog = async({
    taskId,
    field,
    newValue,
    action,
    oldValue,
}:{
    taskId: string,
    field: string,
    newValue: string | number,
    action: 'add'| 'update'| 'delete',
    oldValue: string | number,
  }):Promise<void> =>
{

    
    firestore.add('CheckLogs',{
        taskId,
        field,
        newValue,
        action,
        oldValue,
        userId: auth.currentUser?.uid ?? '',
        time: new Date(),
    });

};
