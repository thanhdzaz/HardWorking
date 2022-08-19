import 'famfamfam-flags/dist/sprite/famfamfam-flags.css';
import './index.less';


import { observer } from 'mobx-react';

import { Select } from 'antd';
import { firestore } from 'firebase';
import { getDocs, query, where } from 'firebase/firestore/lite';
import { UserInfo } from 'models/User/dto';
import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { useStore } from 'stores';
import { userProjectAtom } from 'stores/atom/user';
import ProjectStore from 'stores/projectStore';
import SessionStore from 'stores/sessionStore';

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

        const setUser = useSetRecoilState(userProjectAtom);


        useEffect(()=>
        {
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
                console.log(ids,'ids');
                
                if (ids.length > 0)
                {
                    
                    const userQuery = query(firestore.collection('Users'),where('id', 'in', ids));
                    const userQuerySnapshot = await getDocs(userQuery);

                    userQuerySnapshot.forEach((doc) =>
                    {
                        user.push({ ...doc.data(),id: doc.id } as any);
                    });
                
                }
                console.log(user,'user');
                
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
