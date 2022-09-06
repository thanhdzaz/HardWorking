import { Calendar, Popover, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
// import { ReactComponent as CalendarIcon } from '@/assets/svg/calendar.svg';
// import { ReactComponent as ListIcon } from '@/assets/svg/list.svg';
import './index.less';

const Month:React.FunctionComponent<any> = ({ dataUsers, dataTimekeeping }) =>
{
    const [loading, setLoading] = useState(true);
    const [dataCalendar, setDataCalendar] = useState([]);

    const dateCellRender = (value) =>
    {
        const dateCell = value.format('YYYY-MM-DD');
        const data:any = dataCalendar.find((i:any) => i.date === dateCell);
        
        return data?.totalEmployee
            ? (
                    <Popover
                        placement="right"
                        className="popover-calendar"
                        content={data.listName.map((name, index) => (
                            <div key={index}>
                                {name}
                            </div>
                        ))}
                        trigger="hover"
                    >
                        <div style={{ fontSize: 17 }}>
                            <span style={{ fontWeight: 600 }}>{data.totalEmployee}</span>/
                            {dataUsers.length} thành viên
                        </div>
                    </Popover>
                    
                )
            : (
                    ''
                );
    };

    const handleMapDataCalendar = () =>
    {
        const data = {};
        dataTimekeeping.map(dt => dt.date).filter((dt, index, arr) => index === arr.indexOf(dt)).forEach((dt) =>
        {
            dataTimekeeping.forEach((d) =>
            {
                if (dt === d.date)
                {
                    data[d.date] = data[d.date] ? [...data[d.date], d] : [d];
                }
            });
        });

        // const dt = {};
        console.log(data);
        const _dataCalendar:any = Object.keys(data).map((date) =>
        {
            return {
                date: date,
                listName: data[date].map(tk => dataUsers.find(us => us.id === tk.userId).fullName),
                totalEmployee: data[date].length,
            };
        });

        setDataCalendar(_dataCalendar);
        setLoading(false);
    };
    
    useEffect(() =>
    {
        handleMapDataCalendar();
    }, [dataTimekeeping, dataUsers]);

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
