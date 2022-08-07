import { ProFormSelect } from '@ant-design/pro-form';
import ProTable from '@ant-design/pro-table';
import { Button, Popover, Spin } from 'antd';
import Notify from 'components/Notify';
import { LEAVE_STATUS_OBJ } from 'constant';
import { auth, firestore } from 'firebase';
import { checkLog } from 'hook/useCheckLog';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import HistoryModal from 'components/HistoryModal';
import './index.less';

const LeaveList = (): JSX.Element =>
{
    const [searchResult, setSearchResult] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<any>([]);
    const [id, setId] = useState<string>('');
    const [visible, setVisible] = useState<boolean>(false);

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
                if (row.userId !== auth?.currentUser?.uid) // Nếu là nghỉ khong phép
                {
                    return (
                        <ProFormSelect
                            key={row.id}
                            name={row.id}
                            fieldProps={{
                                value: row.status.toString(),
                                onSelect: (val) => handleChangeStatus(row.status, val, row.id),
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
            title: 'Lịch sử sửa trạng thái',
            width: 150,
            align: 'center',
            render: (_, row) => (
                <Button
                    type="link"
                    onClick={() => handleOpenHistoryModal(row.id)}
                >Xem
                </Button>
            ),
        },
    ];

    const handleChangeStatus = (oldValue, newValue, id) =>
    {
        // if (val === NGHI_CO_PHEP)
        // {
        firestore.update('Leave', id, { status: Number(newValue) }).then(() =>
        {
            checkLog({
                action: 'update',
                field: 'status',
                newValue: Number(newValue),
                oldValue: Number(oldValue),
                taskId: id,
            }).then(() =>
            {
                Notify('success', 'Cập nhật thành công');
                refreshData();
            });
        });
        
        // }
        
    };

    const toggleModal = () =>
    {
        setVisible(prev => !prev);
        
    };

    const handleOpenHistoryModal = (id) =>
    {
        toggleModal();
        setId(id);
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
                    dataSource={searchResult}
                    // options={{
                    //     reload: reloadData,
                    // }}
                    search={false}
                    // rowKey={(e) => e.id}
             
                />
            </Spin>
            { visible && (
                <HistoryModal
                    id={id}
                    users={users}
                    toggleModal={toggleModal}
                />
            ) }
        </>
        
    );
};

export default LeaveList;
