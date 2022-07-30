import { Calendar, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
// import { ReactComponent as CalendarIcon } from '@/assets/svg/calendar.svg';
// import { ReactComponent as ListIcon } from '@/assets/svg/list.svg';
import './index.less';

const Month:React.FunctionComponent<any> = ({ dataUsers, dataTimekeeping, dateRange }) =>
{
    const [loading, setLoading] = useState(true);
    const [dataCalendar, setDataCalendar] = useState([]);

    const dateCellRender = (value) =>
    {
        const dateCell = value.format('YYYY-MM-DD');
        const data:any = dataCalendar.find((i:any) => i.date === dateCell);
        return data?.totalEmployee
            ? (
                    <div style={{ fontSize: 17 }}>
                        <span style={{ fontWeight: 600 }}>{data.totalEmployee}</span>/
                        {dataUsers.length} thành viên
                    </div>
                )
            : (
                    ''
                );
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
                    if (at.userId === a.userId)
                    {
                        dt[a.userId] = dt[a.userId]
                            ? [...dt[a.userId], a]
                            : [a];
                    }
                });
            });

            return {
                date: atendancesOfDate[0].date,
                totalEmployee: Object.keys(dt).length,
            };
        });
        setDataCalendar(_dataCalendar);
        setLoading(false);
    };

    useEffect(() =>
    {

        handleMapDataCalendar();
    }, [dataTimekeeping, dataUsers]);

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
        }
    }, [dateRange]);

    return (
        <div className="month">
            <Spin spinning={loading}>
                <div className="calendar">
                    <Calendar dateCellRender={dateCellRender} />
                </div>
            </Spin>
        </div>
    );
};

export default Month;
