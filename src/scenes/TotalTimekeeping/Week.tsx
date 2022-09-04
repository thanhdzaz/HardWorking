import ProTable from '@ant-design/pro-table';
import { Spin } from 'antd';
import Download from 'components/ExportExcelButton';
import { NGHI_CO_PHEP } from 'constant';
import { firestore } from 'firebase';
import { getDocs, query, where } from 'firebase/firestore/lite';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import './index.less';

const Week: React.FunctionComponent<any> = ({
    dataUsers,
    dataTimekeeping,
    dateRange,
}) =>
{
    const [loading, setLoading] = useState(true);
    const [dataDisplay, setDataDisplay] = useState<any>([]);
    const [dataForExcel, setDataForExcel] = useState<any>([]);
    const [dateColums, setDateColums] = useState<any>([]);
    const [leave, setLeave] = useState<any>([]);

    const tableRef = useRef();

    const columnsExcel = [
        {
            label: 'Họ và Tên',
            widthPx: 100,
            value: 'userName',
        },
        {
            label: 'Số giờ đi muộn',
            widthPx: 150,
            value: 'lateTime',
        },
        {
            label: 'Số giờ về sớm',
            widthPx: 150,
            value: 'soonTime',
        },
        {
            label: 'Số giờ không tính lương',
            widthPx: 150,
            value: 'noSalaryTime',
        },
        {
            label: 'Số giờ tính lương',
            widthPx: 150,
            value: 'salaryTime',
        },
        ...dateColums.map((date) => ({
            label: moment(date).format('DD-MM-YYYY'),
            widthPx: 150,
            value: moment(date).format('DD-MM-YYYY'),
        })),
    ];
    

    const getAllAcceptedLeaveHistory = async () =>
    {
        const q = query(
            firestore.collection('Leave'),
            where('status', '==', NGHI_CO_PHEP),
        );
        const querySnapshot = await getDocs(q);
        const l: any = [];
        querySnapshot.forEach((doc) =>
        {
            l.push(doc.data() as any);
        });
        setLeave(l);
    };

    useEffect(() =>
    {
        getAllAcceptedLeaveHistory();
    }, []);

    useEffect(() =>
    {
        const totalDates = dateRange[1].diff(dateRange[0], 'days') + 1;
        const listDateFromDateRange:any = [];
        for (let i = 0; i < totalDates; i++)
        {
            listDateFromDateRange.push(dateRange[0].clone().add(i, 'days').format('YYYY-MM-DD'));
        }
        const dt = {};
        // Lấy ra một object gồm userId là key và value là mảng các bản ghi chấm công của user đó
        dataUsers.forEach((us) =>
        {
            // isNeverGoToWork để xác định những ai chưa chấm công lần nào, tương đương với chưa từng đến công ty
            let isNeverGoToWork = true;
            dataTimekeeping.forEach((_dt) =>
            {
                if (us.id === _dt.userId)
                {
                    _dt.userName = us.fullName;
                    dt[us.id] = dt[us.id] ? [...dt[us.id], _dt] : [_dt];
                    isNeverGoToWork = false;
                }
            });
            if (isNeverGoToWork)
            {
                dt[us.id] = [
                    {
                        id: us.id,
                        userName: us.fullName,
                        isNeverGoToWork,
                    },
                ];
            }
        });

        const dtForExcel:any = [];
        const dtDisplay = Object.keys(dt).map((usId) =>
        {
            const attendances = dt[usId];
            const attendanceGroup = {};

            // tính các các khoảng thời gian chấm công
            if (attendances.length && !attendances[0].isNeverGoToWork)
            {
                attendances.forEach((ats) =>
                {
                    attendanceGroup[ats.date] = ats;
                });

                listDateFromDateRange.forEach(date =>
                {
                    // Nếu ngày trong daterange mà chưa chấm công và ngày hôm này lớn hơn ngày trong daterange
                    if (!attendanceGroup[date] && moment(date).isSameOrAfter(moment(), 'days'))
                    {
                        attendanceGroup[date] = {
                            timeRange: 'Chưa chấm công',
                            status: 'notAttendance',
                        };
                    }
                    else if (!attendanceGroup[date] && moment(date).isBefore(moment(), 'days'))
                    {
                        const isAcceptedLeave = leave.find(l => l.userId === usId &&
                                                        moment(l.startDate).isSameOrBefore(moment(date), 'days') &&
                                                        moment(l.endDate).isSameOrAfter(moment(date), 'days'));
                        attendanceGroup[date] = {
                            timeRange: isAcceptedLeave ? 'Nghỉ có phép' : 'Nghỉ không phép',
                            status: isAcceptedLeave ? 'acceptedOff' : 'off',
                        };
                    }
                });

                // Tính tổng giờ làm
                let totalSalarySeconds = 0;
                let totalNoSalarySeconds = 0;
                let totalLateSeconds = 0;
                let totalSoonSeconds = 0;
                attendances.forEach((at) =>
                {
                    const [salaryHour, salaryMinute, salarySecond] = at.salaryTime.split(':');
                    const [noSalaryHour, noSalaryMinute, noSalarySecond] = at.noSalaryTime.split(':');
                    const [lateHour, lateMinute, lateSecond] = at.lateTime.split(':');
                    const [soonHour, soonMinute, soonSecond] = at.soonTime.split(':');
                    totalSalarySeconds += parseInt(salaryHour) * 3600 + parseInt(salaryMinute) * 60 + parseInt(salarySecond);
                    totalNoSalarySeconds += parseInt(noSalaryHour) * 3600 + parseInt(noSalaryMinute) * 60 + parseInt(noSalarySecond);
                    totalLateSeconds += parseInt(lateHour) * 3600 + parseInt(lateMinute) * 60 + parseInt(lateSecond);
                    totalSoonSeconds += parseInt(soonHour) * 3600 + parseInt(soonMinute) * 60 + parseInt(soonSecond);
                });

                const totalSalaryHours = Math.floor(totalSalarySeconds / 3600);
                const totalMinutes = Math.floor(
                    (totalSalarySeconds / 3600 - totalSalaryHours) * 60,
                );

                const totalNoSalaryHours = Math.floor(totalNoSalarySeconds / 3600);
                const totalNoSalaryMinutes = Math.floor(
                    (totalNoSalarySeconds / 3600 - totalNoSalaryHours) * 60,
                );

                const totalLateHours = Math.floor(totalLateSeconds / 3600);
                const totalLateMinutes = Math.floor(
                    (totalLateSeconds / 3600 - totalLateHours) * 60,
                );

                const totalSoonHours = Math.floor(totalSoonSeconds / 3600);
                const totalSoonMinutes = Math.floor(
                    (totalSoonSeconds / 3600 - totalSoonHours) * 60,
                );

                const _dtForExcel = {
                    userName: attendances[0].userName,
                    salaryTime: `${totalSalaryHours} giờ ${totalMinutes} phút`,
                    noSalaryTime: `${totalNoSalaryHours} giờ ${totalNoSalaryMinutes} phút`,
                    lateTime: `${totalLateHours} giờ ${totalLateMinutes} phút`,
                    soonTime: `${totalSoonHours} giờ ${totalSoonMinutes} phút`,
                };
                Object.keys(attendanceGroup).forEach(date =>
                {
                    _dtForExcel[moment(date).format('DD-MM-YYYY')] = attendanceGroup[date].timeRange;
                });
                dtForExcel.push(_dtForExcel);
                return {
                    userName: attendances[0].userName,
                    salaryTime: `${totalSalaryHours} giờ ${totalMinutes} phút`,
                    noSalaryTime: `${totalNoSalaryHours} giờ ${totalNoSalaryMinutes} phút`,
                    lateTime: `${totalLateHours} giờ ${totalLateMinutes} phút`,
                    soonTime: `${totalSoonHours} giờ ${totalSoonMinutes} phút`,
                    ...attendanceGroup,
                };
            }
            // Dành cho nhân viên chưa chấm công lần nào
            listDateFromDateRange.forEach(date =>
            {
                // Nếu ngày trong daterange mà chưa chấm công và ngày hôm này lớn hơn ngày trong daterange
                if (!attendanceGroup[date] && moment(date).isSameOrAfter(moment(), 'days'))
                {
                    attendanceGroup[date] = {
                        timeRange: 'Chưa chấm công',
                        status: 'notAttendance',

                    };
                }
                else if (!attendanceGroup[date] && moment(date).isBefore(moment(), 'days'))
                {
                    const isAcceptedLeave = leave.find(l => l.userId === usId &&
                                                    moment(l.startDate).isSameOrBefore(moment(date), 'days') &&
                                                    moment(l.endDate).isSameOrAfter(moment(date), 'days'));
                    attendanceGroup[date] = {
                        timeRange: isAcceptedLeave ? 'Nghỉ có phép' : 'Nghỉ không phép',
                        status: isAcceptedLeave ? 'acceptedOff' : 'off',
                    };
                }
            });
            const _dtForExcel = {
                userName: attendances[0].userName,
                status: 'notAttendance',
                salaryTime: '0 giờ',
                noSalaryTime: '0 giờ',
                lateTime: '0 giờ',
                soonTime: '0 giờ',
            };
            Object.keys(attendanceGroup).forEach(date =>
            {
                _dtForExcel[moment(date).format('DD-MM-YYYY')] = attendanceGroup[date].timeRange;
            });
            dtForExcel.push(_dtForExcel);
            return {
                userName: attendances[0].userName,
                status: 'notAttendance',
                salaryTime: '0 giờ',
                noSalaryTime: '0 giờ',
                lateTime: '0 giờ',
                soonTime: '0 giờ',
                ...attendanceGroup,
            };
            
        });
        setDataDisplay(dtDisplay);
        setDataForExcel(dtForExcel);
        setLoading(false);
    }, [dataTimekeeping, dataUsers, dateRange]);

    console.log(dataForExcel);


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
            key: 'stt',
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
            title: 'Số giờ đi muộn',
            width: 150,
            align: 'center',
            fixed: 'left',
            dataIndex: 'lateTime',
            key: 'lateTime',
            render: (val) => <b>{val}</b>,
        },
        {
            title: 'Số giờ về sớm',
            width: 150,
            align: 'center',
            fixed: 'left',
            dataIndex: 'soonTime',
            key: 'soonTime',
            render: (val) => <b>{val}</b>,
        },
        {
            title: 'Số giờ không tính lương',
            width: 150,
            align: 'center',
            fixed: 'left',
            dataIndex: 'noSalaryTime',
            key: 'noSalaryTime',
            render: (val) => <b>{val}</b>,
        },
        {
            title: 'Số giờ tính lương',
            width: 150,
            align: 'center',
            fixed: 'left',
            dataIndex: 'salaryTime',
            key: 'salaryTime',
            render: (val) => <b style={{ color: 'green' }}>{val}</b>,
        },
        ...dateColums.map((date, index) => ({
            title: moment(date).format('DD-MM-YYYY'),
            width: 150,
            dataIndex: date,
            align: 'center',
            key: `date ${index}`,
            render: (shifts, row) =>
            {
                return (
                    <div>
                        <span
                            style={{ display: 'block', color: row[date].status === 'off' ? 'red' : row[date].status === 'acceptedOff' ? 'orange' : row[date].status === 'notAttendance' ? 'navy' : 'black' }}
                        >
                            {row[date].timeRange}
                        </span>
                    </div>
                );
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
                        `${range[0]} - ${range[1]} trên ${total} bản ghi
                       `,
                }}
                search={false}
                rowKey={(e: any) => e.stt}
                headerTitle={(
                    <Download
                        columns={columnsExcel}
                        data={dataForExcel}
                        fileName={`Tổng hợp chấm công từ ${dateRange[0].format('DD-MM-YYYY')} đến ${dateRange[1].format('DD-MM-YYYY')}`}
                    />
                )}
                bordered
            />
        </Spin>
    );
};

export default Week;
