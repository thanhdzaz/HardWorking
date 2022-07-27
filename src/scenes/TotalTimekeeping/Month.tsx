import ProTable from '@ant-design/pro-table';
import { Button, Calendar, Spin } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
// import { ReactComponent as CalendarIcon } from '@/assets/svg/calendar.svg';
// import { ReactComponent as ListIcon } from '@/assets/svg/list.svg';
import './index.less';
import { CalendarOutlined, UnorderedListOutlined } from '@ant-design/icons';

const Month:React.FunctionComponent<any> = ({ dataUsers, dataTimekeeping, dateRange }) =>
{
    const [loading, setLoading] = useState(true);
    const [dataDisplay, setDataDisplay] = useState([]);
    const [dataCalendar, setDataCalendar] = useState([]);
    const [dateColums, setDateColums] = useState<any>([]);
    const [mode, setMode] = useState('calendar');

    const tableRef = useRef();

    const columns = [
        {
            title: 'STT',
            width: 40,
            fixed: 'left',
            align: 'center',
            key: 'STT',
            render: (_, record:never) => dataDisplay.indexOf(record) + 1,
        },
        {
            title: 'Họ và tên',
            width: 150,
            fixed: 'left',
            dataIndex: 'user_name',
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
            dataIndex: 'total_time',
            key: 'total_time',
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
                                >{s.time_range}
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

    const dateCellRender = (value) =>
    {
        const dateCell = value.format('YYYY-MM-DD');
        const data:any = dataCalendar.find((i:any) => i.date === dateCell);
        return data?.total_employee
            ? (
                    <div style={{ fontSize: 17 }}>
                        <span style={{ fontWeight: 600 }}>{data.total_employee}</span>/
                        {dataUsers.length} thành viên
                    </div>
                )
            : (
                    ''
                );
    };

    const handleMapDataList = () =>
    {
        if (dataUsers.length)
        {
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
                    dt[us.id] = [
                        {
                            id: us.id,
                            user_name: `${us.firstName ?? ''} ${us.lastName ?? ''}`,
                        },
                    ];
                }
            });
            const dtDisplay:any = Object.keys(dt).map((emId) =>
            {
                const attendances = dt[emId] || [0]; // các lần chấm công trong ngày của 1 nhân viên

                // tính các các khoảng thời gian chấm công
                if (attendances.length && attendances[0]?.date)
                {
                    const attendanceGroup = {};

                    attendances.forEach((ats) =>
                    {
                        attendanceGroup[ats.date] = attendances.filter((a) => a.date === ats.date);
                    });

                    // Tính tổng giờ làm
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
                        total_time: `${totalHours} giờ ${totalMinutes} phút`,
                        ...attendanceGroup,
                    };
                }
                return {
                    user_name: attendances[0].user_name,
                    total_time: '0 giờ',
                };
            });
            setDataDisplay(dtDisplay);
            setLoading(false);
        }
    };

    const handleMapDataCalendar = () =>
    {
        const dates = {};
        dataTimekeeping.forEach((dt) =>
        {
            dataTimekeeping.forEach((d) =>
            {
                if (dt.date === d.date)
                {
                    dates[d.date] = dates[d.date] ? [...dates[d.date], d] : [d];
                }
            });
        });

        const dt = {};
        const _dataCalendar:any = Object.keys(dates).map((key) =>
        {
            const atendancesOfDate = dates[key];
            atendancesOfDate.forEach((at) =>
            {
                atendancesOfDate.forEach((a) =>
                {
                    if (at.user_id === a.user_id)
                    {
                        dt[a.user_id] = dt[a.user_id]
                            ? [...dt[a.user_id], a]
                            : [a];
                    }
                });
            });

            return {
                date: atendancesOfDate[0].date,
                total_employee: Object.keys(dt).length,
            };
        });
        setDataCalendar(_dataCalendar);
    };

    useEffect(() =>
    {
        if (mode === 'list')
        {
            handleMapDataList();
        }

        if (mode === 'calendar')
        {
            handleMapDataCalendar();
        }
    }, [dataTimekeeping, dataUsers, mode]);

    useEffect(() =>
    {
        if (dateRange.length)
        {
            const startDate = dateRange[0];
            const endDate = dateRange[1];
            const totalDate = endDate.diff(startDate, 'days');
            const dates:any[] = [];
            for (let i = 0; i <= totalDate; i++)
            {
                const date = startDate.clone().add(i, 'days').format('YYYY-MM-DD');
                dates.push(date);
            }
            setDateColums(dates);
        }
    }, [dateRange]);

    return (
        <div className="month">
            <Spin spinning={loading}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span />
                    <div style={{ marginRight: 24, marginTop: 24 }}>
                        <Button
                            type={mode === 'calendar' ? 'primary' : 'default'}
                            onClick={() => setMode('calendar')}
                        >
                            <CalendarOutlined />
                        </Button>
                        <Button
                            type={mode === 'list' ? 'primary' : 'default'}
                            onClick={() => setMode('list')}
                        >
                            <UnorderedListOutlined />
                        </Button>
                    </div>
                </div>
                <div className="calendar">
                    {mode === 'calendar' && <Calendar dateCellRender={dateCellRender} />}
                    {mode === 'list' && (
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
                                    `${range[0]} - ${range[1]} trên
                                    ${total} ca`,
                            }}
                            search={false}
                            rowKey={(e:any) => e.id}
                            bordered
                        />
                    )}
                </div>
            </Spin>
        </div>
    );
};

export default Month;
