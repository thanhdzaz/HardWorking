import { Button, Card, Checkbox, Select, Table } from 'antd';
import Notify from 'components/Notify';
import { firestore } from 'firebase';
import { UserInfo } from 'models/User/dto';
import { useEffect, useState } from 'react';
import { CreateUser } from './components/create';

// const deleteUser = async(id: string) =>
// {
//     await firestore.delete('Users',id);
// };

const User = (): JSX.Element =>
{
    const [userList, setUserList] = useState<UserInfo[]>([]);
    const [roles, setRoles] = useState([]);
    const [visible, setVisible] = useState(false);


    async function getAllUsers()
    {
        console.log('????');

        await firestore.get('Users').then((users: UserInfo[]) =>
        {
            setUserList(users);
        }).catch(reason => console.log(reason));
    }

    const deleteUser = async (uid: string, bol: boolean) =>
    {
        firestore.update('Users', uid, {
            disable: bol,
        });

    };

    const onChangeRole = async (user: UserInfo, role: string) =>
    {
        firestore.update('Users', user.id, {
            role,
        }).then(getAllUsers);
    };

    const columns =
        [
            {
                title: 'STT',
                width: 55,
                dataIndex: 'id',
                render: (_, item) => userList.indexOf(item) + 1,
            },
            // {
            //     dataIndex: 'id',
            //     render: (id:any) =>
            //     {
            //         return (
            //             <Dropdown
            //                 overlay={(
            //                     <Menu>
            //                         <Menu.Item
            //                             onClick={()=>deleteUser(id)}
            //                         >
            //                             Xóa
            //                         </Menu.Item>
            //                     </Menu>
            //                 )}
            //                 trigger={['click']}
            //             >
            //                 <Button icon={<SettingFilled />} />
            //             </Dropdown>
            //         );
            //     },
            // },
            {
                title: 'Tên',
                dataIndex: 'fullName',
            },
            {
                title: 'Khóa',
                dataIndex: 'disable',
                render: (_: boolean, item: any) =>
                {
                    return (
                        <Checkbox
                            key={item.id}
                            defaultChecked={_}
                            onChange={(e) =>
                            {
                                deleteUser(item.id, e.target.checked);
                            }}
                        />
                    );
                },
            },
            {
                title: 'Email',
                dataIndex: 'email',
            },
            {
                title: 'Vai trò',
                width: 200,
                dataIndex: 'role',
                render: (_, item) => (
                    <Select
                        value={_ ?? ''}
                        style={{
                            width: 200,
                        }}
                        onChange={(val) => onChangeRole(item, val)}
                    >
                        {
                            roles.map((role: any) => (
                                <Select.Option
                                    key={role.key}
                                    value={role.key}
                                >{role.name}
                                </Select.Option>
                            ))
                        }
                    </Select>
                ),
            },

        ];

    useEffect(() =>
    {
        getAllUsers();
        firestore.get('Role').then((role) =>
        {
            setRoles(role);
        });

    }, []);

    console.log('render');

    return (
        <Card>
            <div>
                <Button onClick={() =>
                {
                    setVisible(true);
                }}
                >
                    Thêm mới người dùng
                </Button>
            </div>
            <Table
                style={{
                    marginTop: 15,
                }}
                rowSelection={{

                }}
                rowKey="id"
                dataSource={userList}
                columns={columns as any}
                pagination={{
                    showSizeChanger: true,
                    showTotal: (total, range) =>
                        `${range[0]} - ${range[1]} trên ${total} người dùng`,
                }}
                size={'small'}
            />
            {
                visible && (
                    <CreateUser
                        onClose={async () =>
                        {
                            console.log('????1');

                            await getAllUsers();
                            setVisible(false);
                        }}
                        onOk={
                            async (p) =>
                            {
                                const result = await p;
                                if (result === true)
                                {
                                    Notify('success', 'Tạo mới người dùng thành công');
                                    getAllUsers();
                                }
                            }
                        }
                    />
                )
            }
        </Card>
    );
};

export default User;
