import ProTable from '@ant-design/pro-table';
import { Spin } from 'antd';
import { LEAVE_STATUS_OBJ } from 'constant';
import { firestore } from 'firebase';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import LeaveForm from './components/LeaveForm';
// import LeaveForm from './components/LeaveForm';

const LeaveHistory = (): JSX.Element =>
{
    const [searchResult, setSearchResult] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const tableRef = useRef();

    const columns: any = [
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
            title: 'Ngày bắt đầu nghỉ',
            width: 150,
            dataIndex: 'startDate',
            align: 'center',
            key: 'name',
            render: (_, row) => moment(row.startDate).format('DD/MM/YYYY'),
        },
        {
            title: 'Ngày kết thúc nghỉ',
            width: 150,
            dataIndex: 'endDate',
            align: 'center',
            key: 'name',
            render: (_, row) => moment(row.endDate).format('DD/MM/YYYY'),
        },
        {
            title: 'Lí do',
            width: 150,
            dataIndex: 'reason',
            align: 'center',
            key: 'reason',
        },
        {
            title: 'Trạng thái',
            width: 150,
            dataIndex: 'status',
            align: 'center',
            key: 'name',
            render: (_, row) => LEAVE_STATUS_OBJ[row.status],
        },
    ];

    const getAllMyLeaveHistory = async () =>
    {

        const res = await firestore.get('Leave');
        setSearchResult(res);

    };

    const refreshData = () =>
    {
        setLoading(true);
        getAllMyLeaveHistory();
        setTimeout(() =>
        {
            setLoading(false);
        }, 300);
    };

    console.log(searchResult);
    

    useEffect(() =>
    {
        refreshData();
    }, []);

    return (
        <Spin spinning={loading}>
            <ProTable
                className="leave-config-table"
                actionRef={tableRef}
                columns={columns}
                pagination={{
                    pageSize: 10,
                    showTotal: (total, range) =>
                        `${range[0]} - ${range[1]} trên ${total} bản ghi`,
                }}
                dataSource={searchResult}
                // options={{
                //     reload: reloadData,
                // }}
                search={false}
                // rowKey={(e) => e.id}
                headerTitle={(
                    <LeaveForm refreshData={refreshData} />
                )}
            />
        </Spin>
    );
};

export default LeaveHistory;
