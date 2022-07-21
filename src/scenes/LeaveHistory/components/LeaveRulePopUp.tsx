
import { ModalForm } from '@ant-design/pro-form';
import ProTable from '@ant-design/pro-table';
import {
    Button, Spin,
} from 'antd';
import { firestore } from 'firebase';
import React, { useEffect, useRef, useState } from 'react';
import '../index.less';

const LeaveRulePopUp:React.FunctionComponent<any> = () =>
{
    const [searchResult, setSearchResult] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const tableRef = useRef();

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
        <ModalForm
            title={'Quy định xin nghỉ'}
            style={{ zIndex: 1000 }}
            trigger={<Button type="link">Quy định xin nghỉ</Button>}
            modalProps={{
                okButtonProps: {
                    style: {
                        display: 'none',
                    },
                },
                cancelText: 'Đóng',
            }}
        >
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
                />
            </Spin>
        </ModalForm>
    );
};

export default LeaveRulePopUp;
