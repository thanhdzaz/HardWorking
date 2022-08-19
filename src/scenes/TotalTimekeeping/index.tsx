/* eslint-disable indent */
import {
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import { DatePicker } from 'antd';
import { firestore } from 'firebase';
import moment from 'moment';
import { useEffect, useState } from 'react';
import Day from './Day';
import Month from './Month';
import Week from './Week';

const coloumnsExcel = [
  {
    label: 'Họ và Tên',
    widthPx: 100,
    value: 'userName',
  },
  {
    label: 'Ngày',
    widthPx: 100,
    value: 'date',
  },
  {
    label: 'Giờ check in',
    widthPx: 100,
    value: 'checkInTime',
  },
  {
    label: 'Giờ check out',
    widthPx: 100,
    value: 'checkOutTime',
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


const TotalTimeKeeping = (): JSX.Element =>
{
  const [viewMode, setViewMode] = useState('day');
  const [dataTimekeeping, setDataTimekeeping] = useState([]);
  const [dateRange, setDateRange] = useState<any>([moment(), moment()]);
  const [dataUsers, setDataUsers] = useState<any>([]);
  const [date, setDate] = useState(moment());

  const getTimeKeeping = async () =>
{
    const rs = await firestore.get('Timekeeping');
    let timekeepings;
    if (viewMode === 'day')
{
      timekeepings = rs.filter((t) => moment(t.date).isSame(date, 'day'));
    }
    if (viewMode === 'week' || viewMode === 'month')
{
      timekeepings = rs.filter(
        (t) =>
          moment(t.date).isSameOrAfter(dateRange[0], 'day') &&
          moment(t.date).isSameOrBefore(dateRange[1], 'day'),
      );
    }
    setDataTimekeeping(timekeepings);
  };

  console.log(dataTimekeeping);

  const getUsers = async () =>
{
    const us = await firestore.get('Users');
    setDataUsers(us);
  };

  const handleSelectDateRange = (arrMoment) =>
{
    const startDate = arrMoment[0];
    const endDate = arrMoment[1];
    setDateRange([startDate, endDate]);
  };

  const handleSelectDate = (dateMoment) =>
{
    setDate(dateMoment);
  };

  const handleSelectMonth = (_moment) =>
{
    const thirtyDayMonth = [4, 6, 8, 11];
    let month = _moment.month() + 1 || moment().month() + 1;
    const year = _moment.year() || moment().year();

    let lastDateInMonth;
    if (thirtyDayMonth.includes(month))
{
      lastDateInMonth = 30;
    }
 else if (month === 2)
{
      const isLeapYear = moment(year).isLeapYear();
      lastDateInMonth = isLeapYear ? 29 : 28;
    }
 else
{
      lastDateInMonth = 31;
    }
    month < 10 ? (month = `0${month}`) : month;
    setDateRange([
      `${year}-${month}-01`,
      `${year}-${month}-${lastDateInMonth}`,
    ]);
  };

//   const convertMsToHourMinSecondFormat = (milisecond) =>
// {
//     const convertToHour = milisecond / 1000 / 60 / 60;
//     let hour = Math.floor(convertToHour);
//     const convertToMinute = (convertToHour - hour) * 60;
//     let minute = Math.floor(convertToMinute);
//     let second = Math.ceil((convertToMinute - minute) * 60);

//     if (second === 60)
// {
//       second = 0;
//       minute += 1;
//       if (minute === 60)
// {
//         minute = 0;
//         hour += 1;
//       }
//     }

//     return `${hour < 10 ? `0${hour}` : hour}:${
//       minute < 10 ? `0${minute}` : minute
//     }:${second < 10 ? `0${second}` : second}`;
//   };

//   const handleAttendance = async (val) =>
// {
//     const startTime = moment(
//       `${moment(val.checkInTime, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD')} ${
//         SHIFT_OBJ.startTime
//       }`,
//     );
//     const endTime = moment(
//       `${moment(val.checkInTime, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD')} ${
//         SHIFT_OBJ.endTime
//       }`,
//     );

//     const checkInTime = moment(val.checkInTime, 'YYYY-MM-DD HH:mm:ss');
//     const checkOutTime = moment(val.checkOutTime, 'YYYY-MM-DD HH:mm:ss');
//     const timeRange = `${checkInTime.format('HH:mm:ss')} - ${checkOutTime.format('HH:mm:ss')}`;
//     let noSalaryMilisecond = 0;
//     let soonMilisecond = 0;
//     let lateMilisecond = 0;
//     let salaryMilisecond = 0;
//     let noSalaryTime = '00:00:00';
//     let soonTime = '00:00:00';
//     let lateTime = '00:00:00';
//     let salaryTime = '00:00:00';

//     // Tính số milisecond không tính lương (đến sớm hơn giờ checkin hoặc muộn hơn giờ checkout)
//     if (checkInTime.isBefore(startTime))
// {
//       const milisecond = startTime.diff(checkInTime, 'milliseconds');
//       noSalaryMilisecond += milisecond;
//     }
//     if (checkOutTime.isAfter(endTime))
// {
//       const milisecond = checkOutTime.diff(endTime, 'milliseconds');
//       noSalaryMilisecond += milisecond;
//     }
//     // Thời gian không tính lương HH:mm:ss
//     noSalaryTime = convertMsToHourMinSecondFormat(noSalaryMilisecond);

//     // Tính số milisecond checkin muộn
//     if (checkInTime.isAfter(startTime))
// {
//       const milisecond = checkInTime.diff(startTime, 'milliseconds');
//       lateMilisecond += milisecond;
//     }

//     // Thời gian đi muộn HH:mm:ss
//     lateTime = convertMsToHourMinSecondFormat(lateMilisecond);

//     // Tính số milisecond checkout sớm
//     if (checkOutTime.isBefore(endTime))
// {
//       const milisecond = endTime.diff(checkOutTime, 'milliseconds');
//       soonMilisecond += milisecond;
//     }

//     soonTime = convertMsToHourMinSecondFormat(soonMilisecond);

//     // Tính tổng thời gian tính lương
//     salaryMilisecond =
//       checkOutTime.diff(checkInTime, 'milliseconds') - noSalaryMilisecond;
//     salaryTime = convertMsToHourMinSecondFormat(salaryMilisecond);

//     firestore
//       .add('Timekeeping', {
//         userId: user?.uid,
//         date: checkInTime.format('YYYY-MM-DD'),
//         checkInTime: val.checkInTime,
//         checkOutTime: val.checkOutTime,
//         salaryTime,
//         soonTime,
//         lateTime,
//         noSalaryTime,
//         timeRange,
//       })
//       .then((rs) =>
// {
//         if (rs.id)
// {
//           notification.success({
//             message: 'Chấm công ca làm thành công',
//             placement: 'topRight',
//           });
//           getTimeKeeping();
//         }
//       });
//   };

  const handleSearch = (): void =>
{
  // import
};

  useEffect(() =>
{
    getTimeKeeping();
  }, [date, dateRange]);

  useEffect(() =>
{
    getUsers();
  }, []);

  useEffect(() =>
{
viewMode === 'week'
? setDateRange([moment(), moment()])
    : viewMode === 'month' ? setDateRange([moment().startOf('month'), moment().endOf('month')]) : '';

  }, [viewMode]);

  return (
    <div className="total-time-keeping-container">
      <div className="header">
        <span />
        <div className="header-filter">
          <div className="header-filter-item">
            <ProFormText
                width="xl"
                name="search"
                label=""
                placeholder="Tìm kiếm"
                fieldProps={{
                onChange: handleSearch,
              }}
            />
          </div>
          <div className="header-filter-item">
            <ProFormSelect
                name="viewMode"
                label=""
                fieldProps={{
                value: viewMode,
                onChange: setViewMode,
              }}
                width="xl"
                options={[
                { value: 'day', label: 'Theo ngày' },
                { value: 'week', label: 'Theo khoảng thời gian' },
                { value: 'month', label: 'Theo tháng' },
              ]}
            />
          </div>
          <div
              className="header-filter-item"
              style={{ width: '25%' }}
          >
            {viewMode === 'day' && (
              <DatePicker
                  name="date"
                  format='DD-MM-YYYY'
                  placeholder="Chọn ngày"
                  allowClear={false}
                  onChange={handleSelectDate}
              />
            )}
            {viewMode === 'week' && (
              <DatePicker.RangePicker
                  format='DD-MM-YYYY'
                  value={dateRange}
                  name="dateRange"
                  allowClear={false}
                  onChange={handleSelectDateRange}
              />
            )}
            {viewMode === 'month' && (
              <DatePicker.MonthPicker
                  name="month"
                  format='MM-YYYY'
                  value={dateRange[0]}
                  allowClear={false}
                  placeholder="Chọn tháng"
                  onChange={handleSelectMonth}
              />
            )}
          </div>
        </div>
      </div>
      {/* <ProForm onFinish={handleAttendance}>
        <ProFormDateTimePicker
            label="Giờ check-in"
            name="checkInTime"
        />
        <ProFormDateTimePicker
            label="Giờ check-out"
            name="checkOutTime"
        />
      </ProForm> */}
      {viewMode === 'day' && (
        <Day
            dataUsers={dataUsers}
            dataTimekeeping={dataTimekeeping}
            coloumnsExcel={coloumnsExcel}
        />
      )}
      {viewMode === 'week' && (
        <Week
            dataUsers={dataUsers}
            dataTimekeeping={dataTimekeeping}
            dateRange={dateRange}
            coloumnsExcel={coloumnsExcel}
        />
      )}

      {viewMode === 'month' && (
        <Month
            dataUsers={dataUsers}
            dataTimekeeping={dataTimekeeping}
            dateRange={dateRange}
        />
      )}
    </div>
  );
};

export default TotalTimeKeeping;
