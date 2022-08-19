import ProTable from '@ant-design/pro-table';
import { Spin } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import Download from 'components/ExportExcelButton';
import moment from 'moment';
import './index.less';

const Week: React.FunctionComponent<any> = ({
    dataUsers,
    dataTimekeeping,
    dateRange,
    coloumnsExcel,
}) =>
{
    const [loading, setLoading] = useState(true);
    const [dataDisplay, setDataDisplay] = useState<any>([]);
    const [dateColums, setDateColums] = useState<any>([]);

    const tableRef = useRef();

    useEffect(() =>
    {
        const dt = {};
        dataUsers.forEach((us) =>
        {
            let isOff = true;
            dataTimekeeping.forEach((_dt) =>
            {
                if (us.id === _dt.userId)
                {
                    _dt.userName = us.fullName;
                    dt[us.id] = dt[us.id] ? [...dt[us.id], _dt] : [_dt];
                    isOff = false;
                }
            });
            if (isOff)
            {
                dt[us.id] = [
                    {
                        id: us.id,
                        userName: us.fullName,
                    },
                ];
            }
        });
        const dtDisplay = Object.keys(dt).map((emId) =>
        {
            const attendances = dt[emId] || [0]; // các lần chấm công trong ngày của 1 nhân viên

            // tính các các khoảng thời gian chấm công
            if (attendances.length && attendances[0]?.date)
            {
                const attendanceGroup = {};

                attendances.forEach((ats) =>
                {
                    attendanceGroup[ats.date] = attendances.filter(
                        (a) => a.date === ats.date,
                    );
                });

                // Tính tổng giờ làm
                let totalSeconds = 0;
                attendances.forEach((at) =>
                {
                    const [hour, minute, second] = at.salaryTime.split(':');
                    totalSeconds +=
            parseInt(hour) * 3600 + parseInt(minute) * 60 + parseInt(second);
                });

                const totalHours = Math.floor(totalSeconds / 3600);
                const totalMinutes = Math.floor(
                    (totalSeconds / 3600 - totalHours) * 60,
                );

                return {
                    userName: attendances[0].userName,
                    totalTime: `${totalHours} giờ ${totalMinutes} phút`,
                    ...attendanceGroup,
                };
            }
            return {
                userName: attendances[0].userName,
                totalTime: '0 giờ',
            };
        });
        setDataDisplay(dtDisplay);
        setLoading(false);
    }, [dataTimekeeping, dataUsers, dateRange]);

    useEffect(() =>
    {
        if (dateRange.length)
        {
            const startDate = dateRange[0];
            const endDate = dateRange[1];
            const totalDate = endDate.diff(startDate, 'days');
            const dates: any[] = [];
            for (let i = 0; i <= totalDate; i++)
            {
                const date = startDate.clone().add(i, 'days').format('YYYY-MM-DD');
                dates.push(date);
            }
            setDateColums(dates);
        }
    }, [dateRange]);

    const columns: any[] = [
        {
            title: 'STT',
            width: 40,
            fixed: 'left',
            align: 'center',
            key: 'STT',
            render: (_, record) => dataDisplay.indexOf(record) + 1,
        },
        {
            title: 'Họ và tên',
            width: 150,
            fixed: 'left',
            dataIndex: 'userName',
            align: 'center',
            key: 'name',
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
            fixed: 'left',
            dataIndex: 'totalTime',
            key: 'totalTime',
        },
        ...dateColums.map((date, index) => ({
            title: date,
            width: 150,
            dataIndex: date,
            align: 'center',
            key: `date ${index}`,
            render: (shifts, row) =>
            {
                if (row[date])
                {
                    return (
                        <div>
                            {row[date].map((s, i) => (
                                <span
                                    key={i}
                                    style={{ display: 'block' }}
                                >
                                    {s.timeRange}
                                </span>
                            ))}
                        </div>
                    );
                }

                if (moment().isSameOrAfter(moment(date, 'YYYY-MM-DD')))
                {
                    return <span style={{ color: 'red' }}>Nghỉ</span>;
                }

                return <span style={{ color: 'orange' }}>Chưa chấm công</span>;
            },
        })),
    ];

    return (
        <Spin spinning={loading}>
            <ProTable
                scroll={{
                    y: 1000,
                }}
                className="shift-table"
                actionRef={tableRef}
                columns={columns}
                dataSource={dataDisplay}
                pagination={{
                    pageSize: 10,
                    showTotal: (total, range) =>
                        `${range[0]} - ${range[1]} trên ${total}ca
                       `,
                }}
                search={false}
                rowKey={(e: any) => e.id}
                headerTitle={(
                    <Download
                        columns={coloumnsExcel}
                        data={dataTimekeeping}
                        fileName="Tổng hợp chấm công"
                    />
                )}
                bordered
            />
        </Spin>
    );
};

export default Week;
