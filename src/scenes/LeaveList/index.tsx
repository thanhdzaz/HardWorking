import { ProFormSelect } from '@ant-design/pro-form';
import ProTable from '@ant-design/pro-table';
import { Popover, Spin } from 'antd';
import Notify from 'components/Notify';
import { LEAVE_STATUS_OBJ } from 'constant';
import { auth, firestore } from 'firebase';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import './index.less';

const LeaveList = (): JSX.Element =>
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
            title: 'Mã người dùng',
            dataIndex: 'userId',
            align: 'center',
            key: 'userId',
            hideInTable: true,
        },
        {
            title: 'Họ và tên',
            width: 150,
            align: 'center',
            key: 'name',
            render: (_, row) => users?.find(us => us.id === row.userId)?.fullName,
        },
        {
            title: 'Ngày xin nghỉ',
            width: 150,
            dataIndex: 'sendDate',
            align: 'center',
            key: 'name',
            render: (_, row) => moment(row.startDate).format('DD/MM/YYYY'),
        },
        {
            title: 'Ngày xin đầu nghỉ',
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
            key: 'name',
            render: (_, row) =>
            {
                // check nếu có quyền sửa thì mới cho sửa, không thì chỉ cho xem
                if (row.status === 0) // Nếu là nghỉ khong phép
                {
                    return (
                        <ProFormSelect
                            key={row.id}
                            name={row.id}
                            fieldProps={{
                                value: row.status.toString(),
                                onSelect: (val) => handleChangeStatus(val, row.id),
                            }}
                            options={Object.keys(LEAVE_STATUS_OBJ).map(key => ({
                                value: key,
                                label: LEAVE_STATUS_OBJ[key],
                            }))}
                        />
                    );
                }

                return LEAVE_STATUS_OBJ[row.status];
            },
        },
        {
            title: 'Người chỉnh sửa cuối',
            width: 150,
            dataIndex: 'lastModifiedPerson',
            align: 'center',
            key: 'lastModifiedPerson',
            render: (_, row) => users?.find(us => us.id === row.lastModifiedPerson)?.fullName,
        },
    ];

    const handleChangeStatus = (val, id) =>
    {
        if (val === '1')
        {
            firestore.update('Leave', id, { status: val, lastModifiedPerson: auth?.currentUser?.uid }).then(() =>
            {
                Notify('success', 'Cập nhật thành công');
                refreshData();
            });
        }
    };

    const getAllLeaveList = async () =>
    {

        const res = await firestore.get('Leave');
        setSearchResult(res);

    };

    const getAllUsers = async () =>
    {
        const res = await firestore.get('Users');
        setUsers(res);
    };

    const refreshData = () =>
    {
        setLoading(true);
        getAllLeaveList();
        setTimeout(() =>
        {
            setLoading(false);
        }, 300);
    };


    useEffect(() =>
    {
        refreshData();
        getAllUsers();
    }, []);

    return (
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
                dataSource={searchResult}
                // options={{
                //     reload: reloadData,
                // }}
                search={false}
                // rowKey={(e) => e.id}
             
            />
        </Spin>
    );
};

export default LeaveList;
