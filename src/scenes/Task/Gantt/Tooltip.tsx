// import React from 'react';
import moment from 'moment';
import css from './Tooltip.module.css';

export default function MyTooltipContent({ data }:{data: any}):JSX.Element
{
    const { type = '', text = '', start_date: startDate = '', end_date: endDate = '' } = data;

    let name = [...type];
    if (type.length > 0)
    {
        name[0] = type[0]?.toUpperCase();
        name = [...name];
    }

    return (
        <div className={css.data}>
            <div>
                <span className={css.caption}>{name}: </span>
                <span>{text}</span>
            </div>

            <div className={css.text}>
                <span className={css.caption}>Bắt đầu: </span>
                {moment(startDate).format('DD/MM/YYYY')}
            </div>

            <div className={css.text}>
                <span className={css.caption}>Kết thúc: </span>
                {moment(endDate).format('DD/MM/YYYY')}
            </div>
        </div>
    );
}
