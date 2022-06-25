import { SettingFilled } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { Button, Card, Dropdown, Menu } from 'antd';
import { firestore } from 'firebase';
import { UserInfo } from 'models/User/dto';
import { useEffect, useState } from 'react';
import { CreateUser } from './components/create';

const deleteUser = async(id: string) =>
{
    await firestore.delete('Users',id);
};

const User = ():JSX.Element =>
{
    const [userList,setUserList] = useState<UserInfo[]>([]);
    const getAllUsers = async() =>
    {
        await firestore.get('Users').then((users:UserInfo[])=>
        {
            setUserList(users);
        });
    };

    useEffect(()=>
    {
        getAllUsers();
      
    },[]);
    return (
        <Card>
            <ProTable
                rowSelection={{
               
                }}
                rowKey="id"
                headerTitle={(
                    <div>
                        <CreateUser />
                    </div>
                )}
                search={false}
                toolbar={undefined}
                locale={{
                    emptyText: (<div>Trống</div>),
                    selectAll: 'Chọn tất cả',
                }}
                dataSource={userList}
                columns={[
                    {
                        title: 'STT',
                        width: 55,
                        dataIndex: 'id',
                        render: (_,item)=> userList.indexOf(item) + 1,
                    },
                    {
                        dataIndex: 'id',
                        render: (id:any) =>
                        {
                            return (
                                <Dropdown
                                    overlay={(
                                        <Menu>
                                            <Menu.Item
                                                onClick={()=>deleteUser(id)}
                                            >
                                                Xóa
                                            </Menu.Item>
                                        </Menu>
                                    )}
                                    trigger={['click']}
                                >
                                    <Button icon={<SettingFilled />} />
                                </Dropdown>
                            );
                        },
                    },
                    {
                        title: 'Tên',
                        dataIndex: 'fullName',
                    },
                    {
                        title: 'Email',
                        dataIndex: 'email',
                    },

                ]}
            />
        </Card>
    );
};

export default User;
