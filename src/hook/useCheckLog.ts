import { firestore } from 'firebase';


export const checkLog = async({
    taskId,
    field,
    newValue,
    action,
    oldValue,
    userId,
}:{
    taskId: string,
    field: string,
    newValue: string,
    action: 'add'| 'update'| 'delete',
    oldValue: string,
    userId: string,
    
  }):Promise<void> =>
{

    firestore.add('CheckLogs',{
        taskId,
        field,
        newValue,
        action,
        oldValue,
        userId,
        time: new Date(),
    });

};


