import 'famfamfam-flags/dist/sprite/famfamfam-flags.css';
import './index.less';


import { observer } from 'mobx-react';

import { Select } from 'antd';
import { firestore, getStore } from 'firebase';
import { collection, getDocs, query, where } from 'firebase/firestore/lite';
import { ProjectDto } from 'models/Task/dto';
import { useEffect } from 'react';
import ProjectStore from 'stores/projectStore';
import SessionStore from 'stores/sessionStore';
import { useStore } from 'stores';
import { UserInfo } from 'models/User/dto';
import { useSetRecoilState } from 'recoil';
import { userAtom } from 'stores/atom/user';

// const { Option } = Select;

export interface IProjectChooseProps {
  sessionStore?: SessionStore;
  projectStore?: ProjectStore;
  os: string;
}

export interface State {
    project: any;
    visible: boolean;
}

const ProjectChoose = observer(
    (
        props:IProjectChooseProps,
    )=>
    {
        const {
            projectStore,
            sessionStore,
        } = useStore();

        const setUser = useSetRecoilState(userAtom);

        const getProject = async()=>
        {
            
            const projectCollection = collection(getStore(),'project');
            const project = await getDocs(projectCollection);
            const projectList:ProjectDto[] = project.docs.map(doc => doc.data() as ProjectDto);
            projectStore?.setProject(projectList);
        
            
        };

        useEffect(()=>
        {
            getProject();
            getUserProject();
        },[]);
    
        const getUserProject = async() =>
        {
            if (localStorage.getItem('project'))
            {
                const q = query(firestore.collection('UsersProject'),where('projectId', '==', localStorage.getItem('project')));
          
                const querySnapshot = await getDocs(q);
                const ids:string[] = [];
                const user:UserInfo[] = [];
                querySnapshot.forEach((doc) =>
                {
                    ids.push(doc.data().userId);
                });
                if (ids.length > 0)
                {
                    
                    const userQuery = query(firestore.collection('Users'),where('id', 'in', ids));
                    const userQuerySnapshot = await getDocs(userQuery);

                    userQuerySnapshot.forEach((doc) =>
                    {
                        // console.log(doc.id,'=>',doc.data());
                        user.push(doc.data() as any);
                    });
                
                }
                setUser(user);
            }
            
        };

        const changeProject = (id:string):void =>
        {
            sessionStore?.setProject(id);
            localStorage.setItem('project',id);
            setTimeout(() =>window.location.reload(),200);
        };
        if (props.os !== 'PC')
        {
            return <div />;
        }
        return (
            <>
                <Select
                    style={{ width: '100%' }}
                    defaultValue={sessionStore?.project}
                    placeholder="Search to Select"
                    optionFilterProp="children"
                    filterOption={(input:any, option:any) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    filterSort={(optionA, optionB) =>
                        optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                    }
                    showSearch
                    onChange={(val)=>changeProject(val)}
                >
                    {projectStore?.listProject !== null && (projectStore?.listProject?.length ?? 0) > 0 && projectStore?.listProject?.map((p:any) =>(
                        <Select.Option
                            key={p.id}
                            value={p.id}
                        >
                            {p.title}
                        </Select.Option>
                    ))}
                </Select>
            </>
        );
    },
);
   

export default ProjectChoose;
