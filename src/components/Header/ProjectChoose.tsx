import './index.less';
import 'famfamfam-flags/dist/sprite/famfamfam-flags.css';


import { inject, observer } from 'mobx-react';

import Stores from 'stores/storeIdentifier';
import SessionStore from 'stores/sessionStore';
import React from 'react';
import { Select } from 'antd';

// const { Option } = Select;

export interface IProjectChooseProps {
  sessionStore?: SessionStore;
  os: string;
}

export interface State {
    project: any;
    visible: boolean;
}

@inject(Stores.SessionStore)
@observer
class ProjectChoose extends React.Component<IProjectChooseProps,State>
{
    state = {
        project: [],
        visible: false,
    };

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
                    {/* {this.props.projectStore?.allProject !== null && this.props.projectStore?.allProject.length > 0 && this.props.projectStore?.allProject.map((p:any) =>(
                        <Option
                            key={p.idProject}
                            value={p.idProject}
                        >
                            {p.nameProject}
                        </Option>
                    ))} */}
                </Select>
            </>
        );
    }
}

export default ProjectChoose;
