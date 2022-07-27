import ProTable from '@ant-design/pro-table';
import { Spin } from 'antd';

import React, { useEffect, useRef, useState } from 'react';

import './index.less';

const Day:React.FunctionComponent<any> = ({ dataUsers, dataTimekeeping }) =>
{
    const [loading, setLoading] = useState<any>(false);
    const [dataDisplay, setDataDisplay] = useState<any>([]);

    const tableRef = useRef();

    useEffect(() =>
    {
        setLoading(true);
        const dt = {};
        dataUsers.forEach((us) =>
        {
            let isOff = true;
            dataTimekeeping.forEach((_dt) =>
            {
                if (us.id.toString() === _dt.user_id)
                {
                    dt[us.id] = dt[us.id] ? [...dt[us.id], _dt] : [_dt];
                    isOff = false;
                }
            });
            if (isOff)
            {
                dt[us.id] = [{ id: us.id, user_name: `${us.firstName ?? ''} ${us.lastName ?? ''}` }];
            }
        });
        const dtDisplay = Object.keys(dt).map((emId) =>
        {
            const attendances = dt[emId] || [0]; // các lần chấm công trong ngày của 1 nhân viên
            if (attendances.length && attendances[0]?.date)
            { // nếu không nghỉ
                const attendanceRange = attendances.map((at) => at.time_range);
                let totalSeconds = 0;
                attendances.forEach((at) =>
                {
                    const [hour, minute, second] = at.salary_time.split(':');
                    totalSeconds +=
            parseInt(hour) * 3600 + parseInt(minute) * 60 + parseInt(second);
                });

                const totalHours = Math.floor(totalSeconds / 3600);
                const totalMinutes = Math.floor(
                    (totalSeconds / 3600 - totalHours) * 60,
                );

                return {
                    user_name: attendances[0].user_name,
                    real_shift: attendanceRange.join(', '),
                    total_time: `${totalHours} giờ ${totalMinutes} phút`,
                };
            }
            return {
                user_name: attendances[0].user_name,
                real_shift: '',
                total_time: '0 giờ',
            };
        });
        setDataDisplay(dtDisplay);
        setTimeout(() =>
        {
            setLoading(false);
        }, 300);
    }, [dataTimekeeping, dataUsers]);

    const columns:any[] = [
        {
            title: 'STT',
            width: 40,
            align: 'center',
            key: 'STT',
            render: (_, record) => dataDisplay.indexOf(record) + 1,
        },
        {
            title: 'Họ và tên',
            width: 150,
            dataIndex: 'user_name',
            align: 'center',
            key: 'user_name',
        },
        {
            title: 'id',
            dataIndex: 'id',
            align: 'center',
            key: 'id',
            hideInTable: true,
        },
        {
            title: 'Tổng giờ làm',
            width: 150,
            align: 'center',
            dataIndex: 'total_time',
            key: 'total_time',
        },
        {
            title: 'Giờ làm',
            width: 150,
            dataIndex: 'real_shift',
            align: 'center',
            key: 'real_shift',
            render: (val) => (val !== '-' ? val : <span style={{ color: 'red' }}>Nghỉ</span>),
        },
    ];

    return (
        <Spin spinning={loading}>
            <ProTable
                className="shift-table"
                actionRef={tableRef}
                columns={columns}
                dataSource={dataDisplay}
                pagination={{
                    pageSize: 10,
                    showTotal: (total, range) =>
                        `${range[0]} - ${range[1]} trên ${total} ca`,
                }}
                search={false}
                rowKey={(e:any) => e.id}
            />
        </Spin>
    );
};

export default Day;
