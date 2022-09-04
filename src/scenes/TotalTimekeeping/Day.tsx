import ProTable from '@ant-design/pro-table';
import { Spin } from 'antd';

import React, { useEffect, useRef, useState } from 'react';
import Download from 'components/ExportExcelButton';
import './index.less';
import { NGHI_CO_PHEP } from 'constant';
import { firestore } from 'firebase';
import { getDocs, query, where } from 'firebase/firestore/lite';
import moment from 'moment';

const coloumnsExcel = [
    {
        label: 'Họ và Tên',
        widthPx: 100,
        value: 'userName',
    },
    {
        label: 'Giờ làm',
        widthPx: 100,
        value: 'real_shift',
    },
    {
        label: 'Thời gian tính lương',
        widthPx: 100,
        value: 'salaryTime',
    },
    {
        label: 'Thời gian đi muộn',
        widthPx: 100,
        value: 'lateTime',
    },
    {
        label: 'Thời gian về sớm',
        widthPx: 100,
        value: 'soonTime',
    },
    {
        label: 'Thời gian không tính lương',
        widthPx: 100,
        value: 'noSalaryTime',
    },
];


const Day:React.FunctionComponent<any> = ({ dataUsers, dataTimekeeping, date }) =>
{
    const [loading, setLoading] = useState<any>(false);
    const [dataDisplay, setDataDisplay] = useState<any>([]);
    const [leave, setLeave] = useState<any>([]);

    const tableRef = useRef();

    console.log('dataDisplay: ', dataDisplay);
   

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
        setLoading(true);
        const dt: any = {};
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
                dt[us.id] = [{ id: us.id, userName: us.fullName }];
            }
        });
        const dtDisplay = Object.keys(dt).map((usId) =>
        {
            const attendances = dt[usId] || [0]; // các lần chấm công trong ngày của 1 nhân viên
            if (attendances.length && attendances[0]?.date)
            { // nếu không nghỉ
                const attendanceRange = attendances.map((at) => at.timeRange);
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
                const totalSalaryMinutes = Math.floor(
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

                return {
                    userName: attendances[0].userName,
                    real_shift: attendanceRange.join(', '),
                    salaryTime: `${totalSalaryHours} giờ ${totalSalaryMinutes} phút`,
                    noSalaryTime: `${totalNoSalaryHours} giờ ${totalNoSalaryMinutes} phút`,
                    lateTime: `${totalLateHours} giờ ${totalLateMinutes} phút`,
                    soonTime: `${totalSoonHours} giờ ${totalSoonMinutes} phút`,
                };
            }
            
            if (date.isSameOrAfter(moment(), 'days'))
            {
                return {
                    userName: attendances[0].userName,
                    real_shift: 'Chưa chấm công',
                    status: 'notAttendance',
                    salaryTime: '0 giờ',
                    noSalaryTime: '0 giờ',
                    lateTime: '0 giờ',
                    soonTime: '0 giờ',
                };
            }
            else
            {
                const isAcceptedLeave = leave.find(l =>
                {
                    return moment(l.startDate).isSameOrBefore(date, 'days') && moment(l.endDate).isSameOrAfter(date, 'days') && usId === l.userId;
                });
                
                return {
                    userName: attendances[0].userName,
                    real_shift: isAcceptedLeave ? 'Nghỉ có phép' : 'Nghỉ không phép',
                    status: isAcceptedLeave ? 'acceptedOff' : 'off',
                    salaryTime: '0 giờ',
                    noSalaryTime: '0 giờ',
                    lateTime: '0 giờ',
                    soonTime: '0 giờ',
                };
            }
            
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
            dataIndex: 'userName',
            align: 'center',
            key: 'userName',
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
            dataIndex: 'lateTime',
            key: 'lateTime',
            render: (val) => <b>{val}</b>,
        },
        {
            title: 'Số giờ về sớm',
            width: 150,
            align: 'center',
            dataIndex: 'soonTime',
            key: 'soonTime',
            render: (val) => <b>{val}</b>,
        },
        {
            title: 'Số giờ không tính lương',
            width: 150,
            align: 'center',
            dataIndex: 'noSalaryTime',
            key: 'noSalaryTime',
            render: (val) => <b>{val}</b>,
        },
        {
            title: 'Số giờ tính lương',
            width: 150,
            align: 'center',
            dataIndex: 'salaryTime',
            key: 'salaryTime',
            render: (val) => <b>{val}</b>,
        },
        {
            title: 'Giờ làm',
            width: 150,
            dataIndex: 'real_shift',
            align: 'center',
            key: 'real_shift',
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
        <Spin spinning={loading}>
            <ProTable
                className="shift-table"
                actionRef={tableRef}
                columns={columns}
                dataSource={dataDisplay}
                pagination={{
                    pageSize: 10,
                    showTotal: (total, range) =>
                        `${range[0]} - ${range[1]} trên ${total} bản ghi`,
                }}
                search={false}
                rowKey={(e:any) => e.id}
                headerTitle={(
                    <Download
                        columns={coloumnsExcel}
                        data={dataDisplay}
                        fileName={`Tổng hợp chấm công ngày ${date.format('DD-MM-YYYY')}`}
                    />
                )}
            />
        </Spin>
    );
};

export default Day;
