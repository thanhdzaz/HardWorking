import ProTable from '@ant-design/pro-table';
import { Popover, Spin } from 'antd';
import { LEAVE_STATUS_OBJ } from 'constant';
import { auth, firestore } from 'firebase';
import { getDocs, query, where } from 'firebase/firestore/lite';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import LeaveForm from './components/LeaveForm';
// import LeaveForm from './components/LeaveForm';

const LeaveHistory = (): JSX.Element =>
{
    const [searchResult, setSearchResult] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<any>([]);
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
            title: 'Ngày xin nghỉ',
            width: 150,
            dataIndex: 'sendDate',
            align: 'center',
            key: 'sendDate',
            render: (_, row) => moment(row.sendDate).format('DD/MM/YYYY'),
        },
        {
            title: 'Ngày bắt đầu nghỉ',
            width: 150,
            dataIndex: 'startDate',
            align: 'center',
            key: 'startDate',
            render: (_, row) => moment(row.startDate).format('DD/MM/YYYY'),
        },
        {
            title: 'Ngày kết thúc nghỉ',
            width: 150,
            dataIndex: 'endDate',
            align: 'center',
            key: 'endDate',
            render: (_, row) => moment(row.endDate).format('DD/MM/YYYY'),
        },
        {
            title: 'Lí do',
            width: 150,
            dataIndex: 'reason',
            align: 'center',
            key: 'reason',
            render: (_, row) => (
                <Popover
                    placement="right"
                    className="popover-calendar"
                    content={row.reason}
                    trigger="hover"
                >
                    <div className="reason-box">{row.reason}</div>
                </Popover>
            ),
        },
        {
            title: 'Trạng thái',
            width: 150,
            dataIndex: 'status',
            align: 'center',
            key: 'status',
            render: (_, row) => LEAVE_STATUS_OBJ[row.status],
        },
        {
            title: 'Người chỉnh sửa cuối',
            width: 150,
            dataIndex: 'lastModifiedPerson',
            align: 'center',
            key: 'lastModifiedPerson',
            render: (_, row) =>
                users?.find((us) => us.id === row.lastModifiedPerson)?.fullName,
        },
    ];

    const getAllMyLeaveHistory = async () =>
    {
        const q = query(
            firestore.collection('Leave'),
            where('userId', '==', auth?.currentUser?.uid),
        );
        const querySnapshot = await getDocs(q);
        const l: any = [];
        querySnapshot.forEach((doc) =>
        {
            l.push(doc.data() as any);
        });
        setSearchResult(l);
    };

    const getAllUsers = async () =>
    {
        const res = await firestore.get('Users');
        setUsers(res);
    };

    const refreshData = () =>
    {
        setLoading(true);
        getAllMyLeaveHistory();
        getAllUsers();
        setTimeout(() =>
        {
            setLoading(false);
        }, 300);
    };

    useEffect(() =>
    {
        auth?.currentUser?.uid && refreshData();
    }, [auth?.currentUser?.uid]);

    return (
        <Spin spinning={loading}>
            <ProTable
                className="leave-history-table"
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
                headerTitle={<LeaveForm refreshData={refreshData} />}
            />
        </Spin>
    );
};

export default LeaveHistory;
