import { EditOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { Button, Dropdown, Menu, Spin } from 'antd';
import Notify from 'components/Notify';
import { firestore } from 'firebase';
import { useEffect, useRef, useState } from 'react';
import { ACTIVE, IN_ACTIVE, STATUS_OBJ } from '../constant';
import IpConfigForm from './IpConfigForm';


const LeaveList = (): JSX.Element =>
{
    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState(false);

    const tableRef = useRef();

    const handleDelete = (id) =>
    {
        firestore.delete('IpConfig', id).then(() =>
        {
            Notify('success', 'Xóa thành công');
            refreshData();
        });
    };


    const handleChangeStatus = (id, oldStatus) =>
    {
        firestore.update('IpConfig', id, { status: oldStatus === ACTIVE ? IN_ACTIVE : ACTIVE }).then(() =>
        {
            Notify('success', 'Cập nhật thành công');
            refreshData();
        });
    };

    const getAllNetwordConfig = async () =>
    {
        const res = await firestore.get('IpConfig');
        setData(res);
    };

    const refreshData = () =>
    {
        setLoading(true);
        getAllNetwordConfig();
        setTimeout(() =>
        {
            setLoading(false);
        }, 300);
    };

    const columns: any = [
        {
            title: 'STT',
            width: 40,
            align: 'center',
            key: 'STT',
            render: (_, record: any) => data.indexOf(record) + 1,
        },
        {
            title: 'id',
            dataIndex: 'id',
            align: 'center',
            key: 'id',
            hideInTable: true,
        },
        {
            title: 'Hành động',
            width: 100,
            align: 'center',
            key: 'setting',
            render: (text, row) => (
                <div>
                    <Dropdown
                        trigger={['click']}
                        overlay={(
                            <Menu>
                                <Menu.Item key="edit">
                                    <IpConfigForm
                                        act="update"
                                        record={row}
                                        refreshData={refreshData}
                                    />
                                </Menu.Item>
                                <Menu.Item key="delete">
                                    <Button
                                        type="primary"
                                        onClick={() => handleDelete(row.id)}
                                    >
                    Xóa
                                    </Button>
                                </Menu.Item>
                            </Menu>
                        )}
                        placement="bottomLeft"
                    >
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            style={{ fontSize: 10, width: 30, height: 30, padding: 5 }}
                        />
                    </Dropdown>
                </div>
            ),
        },
        {
            title: 'Dải mạng',
            dataIndex: 'name',
            width: 200,
            align: 'center',
            key: 'name',
        },
        {
            title: 'Trạng thái',
            width: 150,
            dataIndex: 'status',
            align: 'center',
            key: 'name',
            render: (_, row) => STATUS_OBJ[row.status],
        },
        {
            title: 'Hành động',
            width: 150,
            align: 'center',
            key: 'name',
            render: (_, row) => row.status === IN_ACTIVE
                ? (
                        <Button
                            type="primary"
                            onClick={() => handleChangeStatus(row.id, row.status)}
                        >Kích hoạt
                        </Button>
                    )
                : (
                        <Button
                            type="primary"
                            onClick={() => handleChangeStatus(row.id, row.status)}
                        >Bỏ kích hoạt
                        </Button>
                    ),
        },
    ];


    useEffect(() =>
    {
        refreshData();
    }, []);

    return (
        <>
            <Spin spinning={loading}>
                <ProTable
                    className="leave-list-table"
                    actionRef={tableRef}
                    columns={columns}
                    pagination={{
                        pageSize: 10,
                        showTotal: (total, range) =>
                            `${range[0]} - ${range[1]} trên ${total} bản ghi`,
                    }}
                    dataSource={data}
                    search={false}
                    headerTitle={(
                        <IpConfigForm
                            act="create"
                            refreshData={refreshData}
                        />
                    )}
                />
            </Spin>
        </>
    );
};

export default LeaveList;
