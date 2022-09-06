import { firestore } from 'firebase';
import { getDocs, query, where } from 'firebase/firestore/lite';
import { TaskDto } from 'models/Task/dto';
import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { ProjectAtom } from 'stores/atom/project';
import { taskAtom } from 'stores/atom/task';

export const iconRotate = (deg:number):any =>
{
    return ({
        onMouseOver: (e)=>
        {
            e.currentTarget.style.rotate = `${deg}deg`;
        },
        onMouseLeave: (e)=>
        {
        
            e.currentTarget.style.rotate = '0deg';
          
        },
        style: {
            transition: '200ms linear',
        },
    });
};

export const ACTION = {
    update: 'Cập nhật',
    add: 'Thêm mới',
    delete: 'Xóa',
};


export const LOGKEYS = {
    assignTo: 'Giao cho',
    title: 'Tên nhiệm vụ',
    description: 'Mô tả',
    parentId: 'Công việc cha',
    status: 'Trạng thái',
    progress: 'Tiến độ',
    priority: 'Độ ưu tiên',
};


export const useGetTasks = ():{
    task: TaskDto[],
    refresh: ()=>void,
}=>
{

    const [task, setTask] = useRecoilState<TaskDto[]>(taskAtom);
    const project = useRecoilValue(ProjectAtom);

    const refresh = async () =>
    {
        const q = query(
            firestore.collection('Tasks'),
            where('projectId', '==', localStorage.getItem('project')),
        );
        const querySnapshot = await getDocs(q);
        const t: TaskDto[] = [];
        querySnapshot.forEach((doc) =>
        {
            t.push(doc.data() as any);
        });

        setTask(t);
    };

    useEffect(() =>
    {
        refresh();
        console.log('changed project to: ' + project);
    },[project]);

    return ({
        task,
        refresh,
    });
};

export const getDate = (date:string):Date =>
{
    const d = date.split('/');
    return new Date(`${d[1]}/${d[0]}/${d[2]}`);
};
