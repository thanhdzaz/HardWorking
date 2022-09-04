/* eslint-disable indent */
import { ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { DatePicker } from 'antd';
import Text from 'antd/lib/typography/Text';
import { firestore } from 'firebase';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { listUserInfoAtom } from 'stores/atom/user';
import Day from './Day';
import Month from './Month';
import Week from './Week';

const TotalTimeKeeping = (): JSX.Element =>
{
  const [viewMode, setViewMode] = useState('day');
  const [dataTimekeeping, setDataTimekeeping] = useState([]);
  const [dateRange, setDateRange] = useState<any>([moment(), moment()]);
  const [monthDateRange, setMonthDateRange] = useState<any>([moment().startOf('month'), moment().endOf('month')]);
  const [dataUsers, setDataUsers] = useState<any>([]);
  const [date, setDate] = useState(moment());
  const listUser = useRecoilValue(listUserInfoAtom);
  const [keyword, setKeyword] = useState('');

  const getTimeKeeping = async () =>
{
    const rs = await firestore.get('Timekeeping');
    let timekeepings;
    if (viewMode === 'day')
{
      timekeepings = rs.filter((t) => moment(t.date).isSame(date, 'day'));
    }
    if (viewMode === 'week')
{
      timekeepings = rs.filter(
        (t) =>
          moment(t.date).isSameOrAfter(dateRange[0], 'day') &&
          moment(t.date).isSameOrBefore(dateRange[1], 'day'),
      );
    }
    if (viewMode === 'month')
{
      timekeepings = rs.filter(
        (t) =>
          moment(t.date).isSameOrAfter(monthDateRange[0], 'day') &&
          moment(t.date).isSameOrBefore(monthDateRange[1], 'day'),
      );
    }
    setDataTimekeeping(timekeepings);
  };

  const getUsers = async () =>
{
    const us = listUser.filter(us => us.fullName?.toLocaleLowerCase().includes(keyword.toLocaleLowerCase()));
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
  // vì moment trước là startOf, vì chưa clone nên khi moment.endOf thì thằng startOf cũng thành endOf
  // Chính vì thế nên chúng ta cần clone();
    setMonthDateRange([_moment.clone().startOf('month'), _moment.clone().endOf('month')]);
  };
  useEffect(() =>
{
    getTimeKeeping();
  }, [date, dateRange, monthDateRange, viewMode]);

  useEffect(() =>
{
    getUsers();
  }, [listUser, keyword]);

  return (
    <div className="total-time-keeping-container">
      <div className="header">
        <span />
        <div className="header-filter">
         {viewMode !== 'month' && (
          <div className="header-filter-item">
                <Text>Tìm kiếm:</Text>
                <ProFormText
                    width="md"
                    name="search"
                    label=""
                    placeholder="Nhập từ khóa"
                    fieldProps={{
                    onChange: (e) => setKeyword(e.target.value),
                  }}
                />
          </div>
          )}
          <div className="header-filter-item">
            <Text>Chế độ xem:</Text>
            <ProFormSelect
                name="viewMode"
                label=""
                fieldProps={{
                value: viewMode,
                onChange: setViewMode,
              }}
                width="sm"
                options={[
                { value: 'day', label: 'Theo ngày' },
                { value: 'week', label: 'Theo khoảng thời gian' },
                { value: 'month', label: 'Theo tháng' },
              ]}
            />
          </div>
          <div className="header-filter-item">
            <Text>Chọn thời gian:</Text>
            <div>
              {viewMode === 'day' && (
                <DatePicker
                    name="date"
                    format="DD-MM-YYYY"
                    value={date}
                    placeholder="Chọn ngày"
                    allowClear={false}
                    onChange={handleSelectDate}
                />
              )}
              {viewMode === 'week' && (
                <DatePicker.RangePicker
                    format="DD-MM-YYYY"
                    value={dateRange}
                    name="dateRange"
                    allowClear={false}
                    onChange={handleSelectDateRange}
                />
              )}
              {viewMode === 'month' && (
                <DatePicker.MonthPicker
                    name="month"
                    format="MM-YYYY"
                    value={monthDateRange[0]}
                    allowClear={false}
                    placeholder="Chọn tháng"
                    onChange={handleSelectMonth}
                />
              )}
            </div>
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
            date={date}
        />
      )}
      {viewMode === 'week' && (
        <Week
            dataUsers={dataUsers}
            dataTimekeeping={dataTimekeeping}
            dateRange={dateRange}
        />
      )}

      {viewMode === 'month' && (
        <Month
            dataUsers={dataUsers}
            dataTimekeeping={dataTimekeeping}
        />
      )}
    </div>
  );
};

export default TotalTimeKeeping;
