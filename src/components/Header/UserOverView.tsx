import { LockOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, Dropdown, Form, FormInstance, Input, Menu, Modal } from 'antd';
import Notify from 'components/Notify';
import { auth } from 'firebase';
import { updatePassword } from 'firebase/auth';
import { L } from 'lib/abpUtility';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { GetUserOutput } from 'services/user/dto/getUserOutput';
import AuthenticationStore from 'stores/authenticationStore';
import SessionStore from 'stores/sessionStore';
import Stores from 'stores/storeIdentifier';


interface Props{
    tokenAuth?: AuthenticationStore;
    sessionStore?: SessionStore;
    avatarUrl?: string;
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
        {/* <Menu.Item
            key="0"
            className="user-name-drop"
            onClick={()=>that.setState({ visible: true })}
        >
           Dự án
        </Menu.Item> */}
 
        <Menu.Item
            key="11"
        >
            <Link to="/user-info">
                <UserOutlined />
                <span> {L('Thông tin cá nhân')}</span>
            </Link>
        </Menu.Item>
        <Menu.Item
            key="122"
            onClick={()=>that.setState({ visible: true })}
        >
            <LockOutlined />
           &nbsp;Đổi mật khẩu
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
    form = React.createRef<FormInstance>();
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

    submit = ():void =>
    {

        this.form.current?.validateFields().then(val=>
        {
            console.log(val);
            
            if (val.old === '1234567')
            {
                Notify('error','Sai mật khẩu cũ!!');
            }
            else
            {
              
                auth.currentUser && updatePassword(auth.currentUser,val.new).then(() =>
                {
                    Notify('success','Thay đổi mật khẩu thành công');
                    this.setState({ visible: false });
                    
                }).catch((e)=>
                {
                    console.error(e);
                    
                });
            }
        }).catch(e=>
        {
            console.log(e);
            
        });
    };

    render(): JSX.Element
    {
     
        return (
            <>
               
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
                            icon={!this.props.avatarUrl && <UserOutlined />}
                            src={this.props.avatarUrl}
                        />
                    </Badge>
                </Dropdown>


                {
                    this.state.visible && (
                        <Modal
                            title={'Thay đổi mật khẩu'}
                            okButtonProps={{ style: {
                                display: 'none',
                            } }}
                            cancelText={'Đóng'}
                            footer={false}
                            visible
                            onCancel={()=>this.setState({ visible: false })}
                        >
                        
                            <Form ref={this.form}>
                                <Form.Item
                                    name='old'
                                    rules={[
                                        { required: true, message: 'Nhập mật khẩu' },
                                        { message: 'Mật khẩu tối thiểu 6 ký tự', min: 6 },
                                    ]}
                                >
                                    <Input
                                        type='password'
                                        placeholder="Nhập mật khẩu cũ"
                                    />
                                </Form.Item>
                                <Form.Item
                                    name='new'
                                    rules={[
                                        { required: true, message: 'Nhập mật khẩu' },
                                        { message: 'Mật khẩu tối thiểu 6 ký tự', min: 6 },
                                    ]}
                                >
                                    <Input
                                        type='password'
                                        placeholder="Nhập mật khẩu mới"
                                    />
                                </Form.Item>
                                <Form.Item
                                    name='new2'
                                    rules={[
                                        { required: true, message: 'Nhập mật khẩu' },
                                        { message: 'Mật khẩu tối thiểu 6 ký tự', min: 6 },
                                        {
                                            validator: (_rule:any, value:string, callback:any) =>
                                            {
                                                if (this.form.current?.getFieldValue('new') !== value && value.length >= 6)
                                                {
                                                    callback('Mật khẩu mới không trùng nhau');
                                                    return Promise.reject('Mật khẩu mới không trùng nhau');
                                                }
                                                else
                                                {
                                                    return Promise.resolve(true);
                                                }
                                            },
                                        },
                                    ]}
                                >
                                    <Input
                                        type='password'
                                        placeholder="Nhập lại mật khẩu mới"
                                    />
                                </Form.Item>
                            </Form>
                            <Button
                                type='primary'
                                onClick={this.submit}
                            >Thay đổi
                            </Button>
                           
                        </Modal>
                    )
                }
            </>
        );
    }
}

export default UserOverView;
