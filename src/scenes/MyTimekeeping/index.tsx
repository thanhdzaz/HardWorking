import { ProFormDateRangePicker } from '@ant-design/pro-form';
import ProTable from '@ant-design/pro-table';
import { auth, firestore } from 'firebase';
import moment from 'moment';
import { useEffect, useState } from 'react';
import Download from 'components/ExportExcelButton';

const columnsExcel = [
    {
        label: 'Ngày',
        widthPx: 100,
        value: 'date',
    },
    {
        label: 'Số giờ không tính lương',
        widthPx: 300,
        value: 'noSalaryTime',
    },
    {
        label: 'Số giờ tính lương',
        widthPx: 300,
        value: 'salaryTime',
    },
    {
        label: 'Số giờ đi muộn',
        widthPx: 300,
        value: 'lateTime',
    },
    {
        label: 'Số giờ về sớm',
        widthPx: 300,
        value: 'soonTime',
    },
];

const MyAttendance = (): JSX.Element =>
{
    const [dateRange, setDateRange] = useState([
        moment().format('YYYY-MM-DD'),
        moment().format('YYYY-MM-DD'),
    ]);
    const [dataTimekeeping, setDataTimekeeping] = useState([]);
    const [displayData, setDisplayData] = useState<any>([]);
    const [displaySalaryTime, setDisplaySalaryTime] = useState<any>(0);
    const [displayNoSalaryTime, setDisplayNoSalaryTime] = useState<any>(0);
    const [displayLateTime, setDisplayLateTime] = useState<any>(0);
    const [displaySoonTime, setDisplaySoonTime] = useState<any>(0);
    const user = auth?.currentUser;

    const getMyTimeKeeping = async () =>
    {
        const tp = await firestore.get('Timekeeping');
        const myTp = tp.filter(
            (t) =>
                (t.id =
          user?.uid &&
          moment(dateRange[0]).isSameOrBefore(t.date) &&
          moment(t.date).isSameOrBefore(dateRange[1])),
        );
        setDataTimekeeping(myTp);
    };

    const handleSelectDateRange = (arrMoment): void =>
    {
        const startDate = arrMoment[0].format('YYYY-MM-DD');
        const endDate = arrMoment[1].format('YYYY-MM-DD');
        setDateRange([startDate, endDate]);
    };

    useEffect(() =>
    {
        if (user?.uid)
        {
            getMyTimeKeeping();
        }
    }, [user, dateRange]);

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

    useEffect(() =>
    {
        const startDate = moment(dateRange[0], 'YYYY-MM-DD');
        const endDate = moment(dateRange[1], 'YYYY-MM-DD');
        const totalDate = endDate.diff(startDate, 'days');
        const dates: any[] = [];
        for (let i = 0; i <= totalDate; i++)
        {
            const date = startDate.clone().add(i, 'days').format('YYYY-MM-DD');
            dates.push(date);
        }
        const _displayData: any[] = [];
        let totalNoSalarySeconds = 0;
        let totalSalarySeconds = 0;
        let totalLateSeconds = 0;
        let totalSoonSeconds = 0;
        dates.forEach((date) =>
        {
            const dataOfDate: any[] = dataTimekeeping.filter(
                (dt: any) => dt.date === date,
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
                    data: dataOfDate,
                    totalNoSalaryTime: `${totalHours} giờ ${totalMinutes} phút`,
                    totalSalaryTime: `${totalHoursSalary} giờ ${totalMinutesSalary} phút`,
                    totalLateTime: `${totalHoursLate} giờ ${totalMinutesLate} phút`,
                    totalSoonTime: `${totalHoursSoon} giờ ${totalMinutesSoon} phút`,
                });
            }
            else
            {
                _displayData.push({
                    date,
                    totalNoSalaryTime: 'Nghỉ',
                    totalSalaryTime: 'Nghỉ',
                    totalLateTime: 'Nghỉ',
                    totalSoonTime: 'Nghỉ',
                });
            }
        });

        setDisplaySalaryTime(
            convertSecondToHourMinuteToDisplay(totalSalarySeconds),
        );
        setDisplayNoSalaryTime(
            convertSecondToHourMinuteToDisplay(totalNoSalarySeconds),
        );
        setDisplayLateTime(convertSecondToHourMinuteToDisplay(totalLateSeconds));
        setDisplaySoonTime(convertSecondToHourMinuteToDisplay(totalSoonSeconds));

        setDisplayData(_displayData);
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
            title: 'Số giờ không tính lương',
            width: 120,
            align: 'center',
            dataIndex: 'totalNoSalaryTime',
            search: false,
            render: (val, row) =>
                moment(row.date).isSameOrBefore(moment())
                    ? (
                            <span style={{ color: 'red' }}>{val}</span>
                        )
                    : (
                            <span style={{ color: 'orange' }}>Chưa chấm công</span>
                        ),
        },
        {
            title: 'Số giờ tính lương',
            width: 120,
            align: 'center',
            dataIndex: 'totalSalaryTime',
            search: false,
            render: (val, row) =>
                moment(row.date).isSameOrBefore(moment())
                    ? (
                            <span style={{ color: val === 'Nghỉ' ? 'red' : 'green' }}>{val}</span>
                        )
                    : (
                            <span style={{ color: 'orange' }}>Chưa chấm công</span>
                        ),
        },
        {
            title: 'Số giờ đi muộn',
            width: 120,
            align: 'center',
            dataIndex: 'totalLateTime',
            search: false,
            render: (val, row) =>
                moment(row.date).isSameOrBefore(moment())
                    ? (
                            <span style={{ color: 'red' }}>{val}</span>
                        )
                    : (
                            <span style={{ color: 'orange' }}>Chưa chấm công</span>
                        ),
        },
        {
            title: 'Số giờ về sớm',
            width: 120,
            align: 'center',
            dataIndex: 'totalSoonTime',
            search: false,
            render: (val, row) =>
                moment(row.date).isSameOrBefore(moment())
                    ? (
                            <span style={{ color: 'red' }}>{val}</span>
                        )
                    : (
                            <span style={{ color: 'orange' }}>Chưa chấm công</span>
                        ),
        },
    ];

    return (
        <div style={{ backgroundColor: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 20 }}>
                <ProFormDateRangePicker
                    name="dateRange"
                    label="Khoảng thời gian"
                    placeholder={['Chọn ngày', 'Chọn ngày']}
                    fieldProps={{
                        onChange: handleSelectDateRange,
                    }}
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <span style={{ marginLeft: 40, fontSize: 16 }}>
          Số giờ đi muộn:{' '}
                    <span style={{ color: 'red' }}>{displayLateTime}</span>
                </span>
                <span style={{ marginLeft: 40, fontSize: 16 }}>
          Số giờ về sớm: <span style={{ color: 'red' }}>{displaySoonTime}</span>
                </span>
                <span style={{ marginLeft: 40, fontSize: 16 }}>
          Số giờ không tính lương:{' '}
                    <span style={{ color: 'red' }}>{displayNoSalaryTime}</span>
                </span>
                <span style={{ marginLeft: 40, fontSize: 16 }}>
          Số giờ tính lương:{' '}
                    <span style={{ color: '#4DB24D' }}>{displaySalaryTime}</span>
                </span>
            </div>
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
                        data={dataTimekeeping}
                        fileName="Chấm công của tôi"
                    />
                )}
                bordered
            />
        </div>
    );
};

export default MyAttendance;
