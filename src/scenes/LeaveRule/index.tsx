
import { EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import {
    Button,
    Dropdown,
    Menu, Modal, Spin,
} from 'antd';
import Notify from 'components/Notify';
import { firestore } from 'firebase';
import React, { useEffect, useRef, useState } from 'react';
import LeaveConfigForm from './components/LeaveRuleForm';
import './index.less';

const LeaveRule:React.FunctionComponent<any> = () =>
{
    const [searchResult, setSearchResult] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const tableRef = useRef();

    
    const handleDelete = async (id) =>
    {
        const onOk = async () =>
        {
            const isSuccess = await firestore.delete('LeaveRule', id);
            if (isSuccess)
            {
                Notify('success', 'Xóa quy định thành công');
                reloadData();
            }
        };
        Modal.confirm({
            title: 'Xóa phòng',
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chắn muốn xóa quy định này?',
            onOk,
            okText: 'Xóa',
            cancelText: 'Đóng',
        });
    };

    const getAllLeaveRule = async () =>
    {
        const res = await firestore.get('LeaveRule');
        setSearchResult(res);
    };
    
    const reloadData = () =>
    {
        setLoading(true);
        getAllLeaveRule();
        setTimeout(() =>
        {
            setLoading(false);
        }, 300);
    };
    
    useEffect(() =>
    {
        reloadData();
    }, []);
    
    
    const columns:any = [
        {
            title: 'STT',
            width: 40,
            align: 'center',
            key: 'STT',
            render: (_, record: any) => searchResult.indexOf(record) + 1,
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
            width: 40,
            align: 'center',
            key: 'setting',
            render: (text, row) => (
                <div>
                    <Dropdown
                        trigger={['click']}
                        overlay={(
                            <Menu>
                                <Menu.Item key="edit">
                                    <LeaveConfigForm
                                        act="update"
                                        record={row}
                                        refreshData={reloadData}
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
            title: 'Thời gian nghỉ',
            width: 150,
            dataIndex: 'totalDate',
            align: 'center',
            key: 'totalDate',
            render: (val) => `${val} ngày`,
        },
        {
            title: 'Xin nghỉ trước',
            width: 150,
            dataIndex: 'totalDateBefore',
            align: 'center',
            key: 'totalDateBefore',
            render: (val) => `${val} ngày`,
        },
    ];

    return (
        <Spin spinning={loading}>
            <ProTable
                className="leave-config-table"
                actionRef={tableRef}
                columns={columns}
                pagination={{
                    pageSize: 10,
                    showTotal: (total, range) =>
                        `${range[0]} - ${range[1]} trên ${total} quy định`
                    ,
                }}
                dataSource={searchResult}
                options={{
                    reload: reloadData,
                }}
                search={false}
                rowKey={(e: any) => e.id}
                headerTitle={(
                    <div>
                        <LeaveConfigForm
                            act="create"
                            refreshData={reloadData}
                        />
                    </div>
                )}
            />
        </Spin>
    );
};

export default LeaveRule;
