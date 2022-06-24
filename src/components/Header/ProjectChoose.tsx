import 'famfamfam-flags/dist/sprite/famfamfam-flags.css';
import './index.less';


import { inject, observer } from 'mobx-react';

import { Select } from 'antd';
import { getStore } from 'firebase';
import { collection, getDocs } from 'firebase/firestore/lite';
import { ProjectDto } from 'models/Task/dto';
import React from 'react';
import ProjectStore from 'stores/projectStore';
import SessionStore from 'stores/sessionStore';
import Stores from 'stores/storeIdentifier';

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

@inject(Stores.SessionStore,Stores.ProjectStore)
@observer
class ProjectChoose extends React.Component<IProjectChooseProps,State>
{
    state = {
        project: [],
        visible: false,
    };

    async componentDidMount():Promise<void>
    {
        const projectCollection = collection(getStore(),'project');
        const project = await getDocs(projectCollection);
        const projectList:ProjectDto[] = project.docs.map(doc => doc.data() as ProjectDto);
        this.props.projectStore?.setProject(projectList);
        
    }

    changeProject(id:string):void
    {
        this.props.sessionStore?.setProject(id);
        localStorage.setItem('project',id);
        setTimeout(() =>window.location.reload(),200);
    }
    render(): JSX.Element
    {
        if (this.props.os !== 'PC')
        {
            return <div />;
        }
        return (
            <>
                <Select
                    style={{ width: '100%' }}
                    defaultValue={this.props.sessionStore?.project}
                    placeholder="Search to Select"
                    optionFilterProp="children"
                    filterOption={(input:any, option:any) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    filterSort={(optionA, optionB) =>
                        optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                    }
                    showSearch
                    onChange={(val)=>this.changeProject(val)}
                >
                    {this.props.projectStore?.listProject !== null && (this.props.projectStore?.listProject?.length ?? 0) > 0 && this.props.projectStore?.listProject?.map((p:any) =>(
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
    }
}

export default ProjectChoose;
