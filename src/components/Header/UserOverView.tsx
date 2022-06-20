import { Avatar, Badge, Dropdown, Menu, Modal, Select } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import AuthenticationStore from 'stores/authenticationStore';
import Stores from 'stores/storeIdentifier';
import profilePicture from 'images/user.png';
import { Link } from 'react-router-dom';
import { LogoutOutlined } from '@ant-design/icons';
import { L } from 'lib/abpUtility';
import { GetUserOutput } from 'services/user/dto/getUserOutput';
import SessionStore from 'stores/sessionStore';


interface Props{
    tokenAuth?: AuthenticationStore;
    sessionStore?: SessionStore;
}


const userDropdownMenu = (that) => (
    <Menu>
        <Menu.Item
            key="1"
            className="user-name-drop"
        >
            <div>
                {
                    localStorage.getItem('uName') || ''
                }
            </div>
        </Menu.Item>
        <Menu.Item
            key="2"
            className="user-name-drop"
            onClick={()=>that.setState({ visible: true })}
        >
           Dự án
        </Menu.Item>
        <Menu.Item key="2">
            
            <Link to="/logout">
                <LogoutOutlined />
                <span> {L('Đăng xuất')}</span>
            </Link>
        </Menu.Item>
    </Menu>
);

interface State{
    userData: GetUserOutput,
    visible: boolean,
}
@inject(Stores.AuthenticationStore,Stores.SessionStore)
@observer
class UserOverView extends React.Component<Props,State>
{
    state = {
        userData: {} as GetUserOutput,
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
     
        return (
            <>
                <Modal
                    visible={this.state.visible}
                    title={'Thay đổi dự án'}
                    okButtonProps={{ style: {
                        display: 'none',
                    } }}
                    cancelText={'Đóng'}
                    onCancel={()=>this.setState({ visible: false })}
                >
                    
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
                            <Select.Option
                                key={p.idProject}
                                value={p.idProject}
                            >
                                {p.nameProject}
                            </Select.Option>
                        ))} */}
                    </Select>
                </Modal>
                <div
                    className="user-name"
                    style={{ marginRight: 10 , fontWeight: 'bold' }}
                >
                    {localStorage.getItem('uName') || ''}
                </div>
                <Dropdown
                    overlay={()=>userDropdownMenu(this)}
                    className={'user-drop-down'}
                    trigger={['click']}
                >
                    <Badge
                        style={{}}
                        count={null}
                    >
                        <Avatar
                            style={{ height: 32, width: 32 }}
                            shape="circle"
                            alt="profile"
                            src={profilePicture}
                        />
                    </Badge>
                </Dropdown>
            </>
        );
    }
}

export default UserOverView;
