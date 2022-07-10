import { SettingFilled } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { Button, Card, Dropdown, Menu } from 'antd';
import { firestore } from 'firebase';
import { observer } from 'mobx-react';
import { RoleDto } from 'models/Roles';
import { useEffect, useState } from 'react';
import { iconRotate } from 'utils';
import { CreateRole } from './components/Create';
import { UpdateRole } from './components/Update';

const Role = observer(()=>
{

    const [visible,setVisible] = useState(false);
    const [update,setUpdate] = useState<RoleDto>({} as RoleDto);
    const [data,setData] = useState([]);

    useEffect(() =>
    {
        firestore.get('Role').then((role) =>
        {
            setData(role);
        });
    },[]);
    const columns = [
        {
            title: <SettingFilled />,
            align: 'center',
            width: 55,
            dataIndex: 'id',
            render: (_, item) =>
            {
                return (
                    <Dropdown
                        overlay={(
                            <Menu>
                                <Menu.Item
                                    onClick={()=>
                                    {
                                        setUpdate(item);
                                        setVisible(true);
                                    }}
                                >
                                    Sửa
                                </Menu.Item>
                            </Menu>
                        )}
                        trigger={['click']}
                    >
                        <Button icon={(
                            <SettingFilled
                                {...iconRotate(90)}
                            />
                        )}
                        />
                    </Dropdown>
                );
            },
        },
        {
            title: 'Tên',
            dataIndex: 'name',
        },
    ];


    return (
        <Card>
           
            <ProTable
                search={false}
                headerTitle={(
                    <CreateRole
                        trigger={<Button>Thêm mới</Button>}
                        onCancel={()=>
                        {
                            // setCreateVisible(false);
                        }}
                        onOk={()=>
                        {
                            //
                        }}
                    />
                )}
                columns={columns as any}
                dataSource={data}
            />
            {
                visible && (
                    <UpdateRole
                        currentRecord={update}
                        onCancel={()=>
                        {
                            setVisible(false);
                        }}
                        onOk={()=>
                        {
                            //
                        }}
                    />

                )
            }
         
        </Card>
    );
});


export default Role;
