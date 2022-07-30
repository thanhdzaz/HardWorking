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
    newValue: string,
    action: 'add'| 'update'| 'delete',
    oldValue: string,
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
