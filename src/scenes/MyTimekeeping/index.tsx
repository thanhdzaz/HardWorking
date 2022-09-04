import { ProFormDateRangePicker } from '@ant-design/pro-form';
import ProTable from '@ant-design/pro-table';
import { Spin } from 'antd';
import Download from 'components/ExportExcelButton';
import { NGHI_CO_PHEP } from 'constant';
import { auth, firestore } from 'firebase';
import { getDocs, query, where } from 'firebase/firestore/lite';
import moment from 'moment';
import { useEffect, useState } from 'react';

const columnsExcel = [
    {
        label: 'Ngày',
        widthPx: 100,
        value: 'date',
    },
    {
        label: 'Giờ check-in',
        widthPx: 300,
        value: 'checkInTime',
    },
    {
        label: 'Giờ check-out',
        widthPx: 300,
        value: 'checkOutTime',
    },
    {
        label: 'Số giờ không tính lương',
        widthPx: 300,
        value: 'totalNoSalaryTime',
    },
    {
        label: 'Số giờ tính lương',
        widthPx: 300,
        value: 'totalSalaryTime',
    },
    {
        label: 'Số giờ đi muộn',
        widthPx: 300,
        value: 'totalLateTime',
    },
    {
        label: 'Số giờ về sớm',
        widthPx: 300,
        value: 'totalSoonTime',
    },
];

const MyAttendance = (): JSX.Element =>
{
    const [dateRange, setDateRange] = useState<any>([moment(), moment()]);
    const [dataTimekeeping, setDataTimekeeping] = useState([]);
    const [displayData, setDisplayData] = useState<any>([]);
    const [displaySalaryTime, setDisplaySalaryTime] = useState<any>(0);
    const [displayNoSalaryTime, setDisplayNoSalaryTime] = useState<any>(0);
    const [displayLateTime, setDisplayLateTime] = useState<any>(0);
    const [displaySoonTime, setDisplaySoonTime] = useState<any>(0);
    const [myLeave, setMyLeave] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const user = auth?.currentUser;

    console.log(displayData);
    

    const getMyTimeKeeping = async () =>
    {
        const tp: any = [];
        const q = query(
            firestore.collection('Timekeeping'),
            where('userId', '==', auth?.currentUser?.uid),
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) =>
        {
            tp.push(doc.data());
        });
        const myTp = tp.filter((t) =>
        {
            return (
                moment(dateRange[0]).isSameOrBefore(moment(t.date), 'day') &&
          moment(t.date).isSameOrBefore(dateRange[1]),
                'day'
            );
        });
        setDataTimekeeping(myTp);
    };

    const getAllMyAcceptedLeaveHistory = async () =>
    {
        const q = query(
            firestore.collection('Leave'),
            where('userId', '==', auth?.currentUser?.uid),
            where('status', '==', NGHI_CO_PHEP),
        );
        const querySnapshot = await getDocs(q);
        const l: any = [];
        querySnapshot.forEach((doc) =>
        {
            l.push(doc.data() as any);
        });
        setMyLeave(l);
    };

    useEffect(() =>
    {
        if (user?.uid)
        {
            getMyTimeKeeping();
        }
    }, [user, dateRange]);

    useEffect(() =>
    {
        getAllMyAcceptedLeaveHistory();
    }, []);

    const convertTimeToSeconds = (hour, minute, second) =>
        parseInt(hour) * 3600 + parseInt(minute) * 60 + parseInt(second);

    const convertSecondToHourMinuteToDisplay = (seconds: any) =>
    {
        const hours = Math.floor(seconds / 3600); // Số giờ tính lương
        const minutes = Math.floor((seconds / 3600 - hours) * 60);

        return `${hours ? `${hours} giờ` : '0 giờ'} ${
            minutes ? `${minutes} phút` : '0 phút'
        }`;
    };

    const showLoading = () =>
    {
        setLoading(true);
        setTimeout(() =>
        {
            setLoading(false);
        }, 300);
    };

    useEffect(() =>
    {
        showLoading();
        const [startDate, endDate] = dateRange;
        if (startDate && endDate)
        {
            const totalDate = endDate.diff(startDate, 'days') + 1;
            const dates: any[] = [];
            for (let i = 0; i < totalDate; i++)
            {
                const date = startDate.clone().add(i, 'days').format('YYYY-MM-DD');
                dates.push(date);
            }
            const _displayData: any[] = [];
            let totalNoSalarySeconds = 0;
            let totalSalarySeconds = 0;
            let totalLateSeconds = 0;
            let totalSoonSeconds = 0;
            dates.forEach(
                (
                    date, // Lặp qua các ngày trong mảng
                ) =>
                {
                    const dataOfDate: any[] = dataTimekeeping.filter(
                        (dt: any) => dt.date === date && dt.checkInTime && dt.checkOutTime,
                    );
                    if (dataOfDate.length)
                    {
                        let totalSeconds = 0;
                        // Tính số giây không tính lương, tính lương, đi muộn, về sớm
                        dataOfDate.forEach((at) =>
                        {
                            const [noSalaryHour, noSalaryMinute, noSalarySecond] =
                at.noSalaryTime.split(':');
                            const [salaryHour, salaryMinute, salarySecond] =
                at.salaryTime.split(':');
                            const [lateHour, lateMinute, lateSecond] = at.lateTime.split(':');
                            const [soonHour, soonMinute, soonSecond] = at.soonTime.split(':');

                            totalSalarySeconds += convertTimeToSeconds(
                                salaryHour,
                                salaryMinute,
                                salarySecond,
                            );
                            totalSoonSeconds += convertTimeToSeconds(
                                soonHour,
                                soonMinute,
                                soonSecond,
                            );
                            totalLateSeconds += convertTimeToSeconds(
                                lateHour,
                                lateMinute,
                                lateSecond,
                            );
                            totalSeconds += convertTimeToSeconds(
                                noSalaryHour,
                                noSalaryMinute,
                                noSalarySecond,
                            );
                        });

                        totalNoSalarySeconds += totalSeconds;
                        const totalHours = Math.floor(totalSeconds / 3600); // Số giờ không tính lương
                        const totalMinutes = Math.floor(
                            // Số phút không tính lương
                            (totalSeconds / 3600 - totalHours) * 60,
                        );

                        const totalHoursSalary = Math.floor(totalSalarySeconds / 3600); // Số giờ tính lương
                        const totalMinutesSalary = Math.floor(
                            // Số phút tính lương
                            (totalSalarySeconds / 3600 - totalHoursSalary) * 60,
                        );

                        const totalHoursLate = Math.floor(totalLateSeconds / 3600); // Số giờ đi muộn
                        const totalMinutesLate = Math.floor(
                            // Số phút đi muộn
                            (totalLateSeconds / 3600 - totalHoursLate) * 60,
                        );

                        const totalHoursSoon = Math.floor(totalSoonSeconds / 3600); // Số giờ về sớm
                        const totalMinutesSoon = Math.floor(
                            // Số phút về sớm
                            (totalSoonSeconds / 3600 - totalHoursSoon) * 60,
                        );
                        _displayData.push({
                            date,
                            checkInTime: moment(dataOfDate[0].checkInTime).format('HH:mm:ss'),
                            checkOutTime: moment(dataOfDate[0].checkOutTime).format(
                                'HH:mm:ss',
                            ),
                            data: dataOfDate,
                            totalNoSalaryTime: `${totalHours} giờ ${totalMinutes} phút`,
                            totalSalaryTime: `${totalHoursSalary} giờ ${totalMinutesSalary} phút`,
                            totalLateTime: `${totalHoursLate} giờ ${totalMinutesLate} phút`,
                            totalSoonTime: `${totalHoursSoon} giờ ${totalMinutesSoon} phút`,
                        });
                    }
                    else if (moment(date).isSameOrAfter(moment(), 'day'))
                    {
                        _displayData.push({
                            date,
                            checkInTime: 'Chưa chấm công',
                            checkOutTime: 'Chưa chấm công',
                            status: 'notAttendance',
                            totalNoSalaryTime: 'Chưa chấm công',
                            totalSalaryTime: 'Chưa chấm công',
                            totalLateTime: 'Chưa chấm công',
                            totalSoonTime: 'Chưa chấm công',
                        });
                    }
                    else
                    {
                        console.log(myLeave);

                        const isAcceptedLeave = myLeave.find(
                            (ml) =>
                                moment(ml.startDate).isSameOrBefore(moment(date)) &&
                moment(ml.endDate).isSameOrAfter(moment(date)),
                        );

                        _displayData.push({
                            date,
                            status: isAcceptedLeave ? 'acceptedOff' : 'off',
                            checkInTime: isAcceptedLeave ? 'Nghỉ có phép' : 'Nghỉ không phép',
                            checkOutTime: isAcceptedLeave
                                ? 'Nghỉ có phép'
                                : 'Nghỉ không phép',
                            totalNoSalaryTime: isAcceptedLeave
                                ? 'Nghỉ có phép'
                                : 'Nghỉ không phép',
                            totalSalaryTime: isAcceptedLeave
                                ? 'Nghỉ có phép'
                                : 'Nghỉ không phép',
                            totalLateTime: isAcceptedLeave
                                ? 'Nghỉ có phép'
                                : 'Nghỉ không phép',
                            totalSoonTime: isAcceptedLeave
                                ? 'Nghỉ có phép'
                                : 'Nghỉ không phép',
                        });
                    }
                },
            );

            setDisplaySalaryTime(
                convertSecondToHourMinuteToDisplay(totalSalarySeconds),
            );
            setDisplayNoSalaryTime(
                convertSecondToHourMinuteToDisplay(totalNoSalarySeconds),
            );
            setDisplayLateTime(convertSecondToHourMinuteToDisplay(totalLateSeconds));
            setDisplaySoonTime(convertSecondToHourMinuteToDisplay(totalSoonSeconds));

            setDisplayData(_displayData);
        }
    }, [dataTimekeeping, dateRange]);

    const columns: any[] = [
        {
            title: 'STT',
            width: 30,
            align: 'center',
            search: false,
            render: (val, record) => displayData.indexOf(record) + 1,
        },
        {
            title: 'Ngày',
            width: 120,
            align: 'center',
            search: false,
            dataIndex: 'date',
            render: (_, record) => (
                <div>{moment(record.date).format('DD/MM/YYYY')}</div>
            ),
        },
        {
            title: 'Giờ check-in',
            width: 120,
            align: 'center',
            search: false,
            dataIndex: 'checkInTime',
            render: (val, row) =>
            {
                if (row.status === 'off')
                {
                    return <span style={{ color: 'red' }}>{val}</span>;
                }
                if (row.status === 'acceptedOff')
                {
                    return <span style={{ color: 'orange' }}>{val}</span>;
                }
                if (row.status === 'notAttendance')
                {
                    return <span style={{ color: 'navy' }}>{val}</span>;
                }
                return <b>{val}</b>;
            },
        },
        {
            title: 'Giờ check-out',
            width: 120,
            align: 'center',
            search: false,
            dataIndex: 'checkOutTime',
            render: (val, row) =>
            {
                if (row.status === 'off')
                {
                    return <span style={{ color: 'red' }}>{val}</span>;
                }
                if (row.status === 'acceptedOff')
                {
                    return <span style={{ color: 'orange' }}>{val}</span>;
                }
                if (row.status === 'notAttendance')
                {
                    return <span style={{ color: 'navy' }}>{val}</span>;
                }
                return <b>{val}</b>;
            },
        },
        {
            title: 'Số giờ không tính lương',
            width: 120,
            align: 'center',
            dataIndex: 'totalNoSalaryTime',
            search: false,
            render: (val, row) =>
            {
                if (row.status === 'off')
                {
                    return <span style={{ color: 'red' }}>{val}</span>;
                }
                if (row.status === 'acceptedOff')
                {
                    return <span style={{ color: 'orange' }}>{val}</span>;
                }
                if (row.status === 'notAttendance')
                {
                    return <span style={{ color: 'navy' }}>{val}</span>;
                }
                return <b>{val}</b>;
            },
        },
        {
            title: 'Số giờ tính lương',
            width: 120,
            align: 'center',
            dataIndex: 'totalSalaryTime',
            search: false,
            render: (val, row) =>
            {
                if (row.status === 'off')
                {
                    return <span style={{ color: 'red' }}>{val}</span>;
                }
                if (row.status === 'acceptedOff')
                {
                    return <span style={{ color: 'orange' }}>{val}</span>;
                }
                if (row.status === 'notAttendance')
                {
                    return <span style={{ color: 'navy' }}>{val}</span>;
                }
                return <b>{val}</b>;
            },
        },
        {
            title: 'Số giờ đi muộn',
            width: 120,
            align: 'center',
            dataIndex: 'totalLateTime',
            search: false,
            render: (val, row) =>
            {
                if (row.status === 'off')
                {
                    return <span style={{ color: 'red' }}>{val}</span>;
                }
                if (row.status === 'acceptedOff')
                {
                    return <span style={{ color: 'orange' }}>{val}</span>;
                }
                if (row.status === 'notAttendance')
                {
                    return <span style={{ color: 'navy' }}>{val}</span>;
                }
                return <b>{val}</b>;
            },
        },
        {
            title: 'Số giờ về sớm',
            width: 120,
            align: 'center',
            dataIndex: 'totalSoonTime',
            search: false,
            render: (val, row) =>
            {
                if (row.status === 'off')
                {
                    return <span style={{ color: 'red' }}>{val}</span>;
                }
                if (row.status === 'acceptedOff')
                {
                    return <span style={{ color: 'orange' }}>{val}</span>;
                }
                if (row.status === 'notAttendance')
                {
                    return <span style={{ color: 'navy' }}>{val}</span>;
                }
                return <b>{val}</b>;
            },
        },
    ];

    return (
        <div style={{ backgroundColor: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 20 }}>
                <ProFormDateRangePicker
                    name="dateRange"
                    label="Lọc theo khoảng thời gian"
                    placeholder={['Chọn ngày', 'Chọn ngày']}
                    fieldProps={{
                        onChange: setDateRange,
                        value: dateRange,
                        format: 'DD/MM/YYYY',
                    }}
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <span style={{ marginLeft: 40, fontSize: 16 }}>
          Số giờ đi muộn:{' '}
                    <b style={{ color: 'black' }}>{displayLateTime}</b>
                </span>
                <span style={{ marginLeft: 40, fontSize: 16 }}>
          Số giờ về sớm: <b style={{ color: 'black' }}>{displaySoonTime}</b>
                </span>
                <span style={{ marginLeft: 40, fontSize: 16 }}>
          Số giờ không tính lương:{' '}
                    <b style={{ color: 'black' }}>{displayNoSalaryTime}</b>
                </span>
                <span style={{ marginLeft: 40, fontSize: 16 }}>
          Số giờ tính lương:{' '}
                    <b style={{ color: 'black' }}>{displaySalaryTime}</b>
                </span>
            </div>
            <Spin spinning={loading}>
                <ProTable
                    columns={columns}
                    pagination={{
                        showQuickJumper: true,
                        pageSize: 10,
                    }}
                    rowKey={(e) => e.date}
                    search={false}
                    dataSource={displayData}
                    headerTitle={(
                        <Download
                            columns={columnsExcel}
                            data={displayData}
                            fileName="Chấm công của tôi"
                        />
                    )}
                    bordered
                />
            </Spin>
        </div>
    );
};

export default MyAttendance;
