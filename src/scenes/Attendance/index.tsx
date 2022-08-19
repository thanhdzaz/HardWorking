import { DoubleRightOutlined, SettingTwoTone } from '@ant-design/icons';
import { notification } from 'antd';
import Notify from 'components/Notify';
import { SHIFT_OBJ } from 'constant';
import { auth, firestore } from 'firebase';
import { getDocs, query, where } from 'firebase/firestore/lite';

import moment from 'moment';
import 'moment/locale/vi';
import { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ACTIVE } from './constant';
import ipRangeCheck from 'ip-range-check';
import './index.less';

const Attendance = (): JSX.Element =>
{
    const [time, setTime] = useState(moment());
    const [leaves, setLeaves] = useState<any>([]);
    const [ips, setIps] = useState<any>([]);
    const [myIp, setMyIp] = useState<any>([]);
    const [attendanceRecord, setAttendanceRecord] = useState<any>({});
    const user = auth?.currentUser;

    const getAllLeave = () =>
    {
        firestore.get('Leave').then(setLeaves);
    };

    const getActiveIps = async () =>
    {
        firestore.get('IpConfig').then((data) => setIps(data.filter(d => d.status === ACTIVE)));
    };

    const convertMsToHourMinSecondFormat = (milisecond) =>
    {
        const convertToHour = milisecond / 1000 / 60 / 60;
        let hour = Math.floor(convertToHour);
        const convertToMinute = (convertToHour - hour) * 60;
        let minute = Math.floor(convertToMinute);
        let second = Math.ceil((convertToMinute - minute) * 60);

        if (second === 60)
        {
            second = 0;
            minute += 1;
            if (minute === 60)
            {
                minute = 0;
                hour += 1;
            }
        }

        if (hour <= 0)
        {
            hour = 0;
            minute = 0;
            second = 0;
        }
        if (minute < 0)
        {
            minute = 0;
            second = 0;
        }
        if (second < 0)
        {
            second = 0;
        }

        return `${hour < 10 ? `0${hour}` : hour}:${
            minute < 10 ? `0${minute}` : minute
        }:${second < 10 ? `0${second}` : second}`;
    };

    const handleCheckValidIp = (ip) =>
    {
        const isValid = ipRangeCheck(ip, ips.map(i => i.name));
        if (isValid)
        {
            return true;
        }
        Notify('error', 'Địa chỉ mạng của bạn không khớp với công ty');
        return false;
    };

    const handleCheckin = (): boolean =>
    {
        const isValid = handleCheckValidIp(myIp);
        if (isValid)
        {
            const isLeave = leaves.find(
                (l) =>
                    moment(l.startDate).isSameOrBefore(moment(), 'day') &&
          moment(l.endDate).isSameOrAfter(moment(), 'day'),
            );

            if (attendanceRecord.checkInTime)
            {
                return false;
            }

            if (isLeave)
            {
                notification.warning({
                    message: 'Bạn không thể checkin vì đã xin nghỉ',
                    placement: 'topRight',
                });
                return false;
            }

            const date = moment().format('YYYY-MM-DD');
            const checkInTime = moment().format('YYYY-MM-DD HH:mm:ss');
            firestore
                .add('Timekeeping', {
                    userId: user?.uid,
                    date,
                    checkInTime,
                    checkOutTime: '',
                    salaryTime: '',
                    soonTime: '',
                    lateTime: '',
                    noSalaryTime: '',
                    timeRange: '',
                })
                .then((rs) =>
                {
                    if (rs.id)
                    {
                        notification.success({
                            message: 'Check in thành công',
                            placement: 'topRight',
                        });
                        setTimeout(() =>
                        {
                            handleCheckAttendance();
                        }, 1000);
                    }
                });
            return true;
        }
        return false;
    };

    const handleCheckout = (): boolean =>
    {
        const isValid = handleCheckValidIp(myIp);
        if (isValid)
        {
            // nếu đã check out hoặc chưa check in thì không cho check nữa
            if (attendanceRecord.checkOutTime)
            {
                return false;
            }
            if (!attendanceRecord.checkInTime)
            {
                notification.warning({
                    message: 'Vui lòng check in trước',
                    placement: 'topRight',
                });
                return false;
            }
            const startTime = moment(
                `${moment().format('YYYY-MM-DD')} ${SHIFT_OBJ.startTime}`,
            );
            const endTime = moment(
                `${moment().format('YYYY-MM-DD')} ${SHIFT_OBJ.endTime}`,
            );

            const checkInTime = moment(
                attendanceRecord.checkInTime,
                'YYYY-MM-DD HH:mm:ss',
            );
            const checkOutTime = moment();
            const timeRange = `${checkInTime.format(
                'HH:mm:ss',
            )} - ${checkOutTime.format('HH:mm:ss')}`;
            let noSalaryMilisecond = 0;
            let soonMilisecond = 0;
            let lateMilisecond = 0;
            let salaryMilisecond = 0;
            let noSalaryTime = '00:00:00';
            let soonTime = '00:00:00';
            let lateTime = '00:00:00';
            let salaryTime = '00:00:00';

            // Tính số milisecond không tính lương (đến sớm hơn giờ checkin hoặc muộn hơn giờ checkout)
            if (checkInTime.isBefore(startTime))
            {
                const milisecond = startTime.diff(checkInTime, 'milliseconds');
                noSalaryMilisecond += milisecond;
            }
            if (checkOutTime.isAfter(endTime))
            {
                const milisecond = checkOutTime.diff(endTime, 'milliseconds');
                noSalaryMilisecond += milisecond;
            }
            // Thời gian không tính lương HH:mm:ss
            noSalaryTime = convertMsToHourMinSecondFormat(noSalaryMilisecond);

            // Tính số milisecond checkin muộn
            if (checkInTime.isAfter(startTime))
            {
                const milisecond = checkInTime.diff(startTime, 'milliseconds');
                lateMilisecond += milisecond;
            }

            // Thời gian đi muộn HH:mm:ss
            lateTime = convertMsToHourMinSecondFormat(lateMilisecond);

            // Tính số milisecond checkout sớm
            if (checkOutTime.isBefore(endTime))
            {
                const milisecond = endTime.diff(checkOutTime, 'milliseconds');
                soonMilisecond += milisecond;
            }

            soonTime = convertMsToHourMinSecondFormat(soonMilisecond);

            // Tính tổng thời gian tính lương
            salaryMilisecond =
        checkOutTime.diff(checkInTime, 'milliseconds') - noSalaryMilisecond;
            salaryTime = convertMsToHourMinSecondFormat(salaryMilisecond);

            firestore
                .update('Timekeeping', attendanceRecord.id, {
                    checkOutTime: checkInTime.format('YYYY-MM-DD HH:mm:ss'),
                    salaryTime,
                    soonTime,
                    lateTime,
                    noSalaryTime,
                    timeRange,
                })
                .then(() =>
                {
                    notification.success({
                        message: 'Check out thành công',
                        placement: 'topRight',
                    });
                    handleCheckAttendance();
                });
            return true;
        }
        return false;
    };

    const handleCheckAttendance = async () =>
    {
        const q = query(
            firestore.collection('Timekeeping'),
            where('date', '==', moment().format('YYYY-MM-DD')),
        );
        const res: any = [];
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) =>
        {
            console.log(doc.data());

            res.push(doc.data());
        });
        if (res.length)
        {
            setAttendanceRecord(res[0]);
        }
    };

    const getIpaddress = () =>
    {
        fetch('https://jsonip.com/')
            .then((res) =>
            {
                return res.json();
            })
            .then((data) =>
            {
                setMyIp(data.ip);
            })
            .catch((err) =>
            {
                console.log(`There was an error ${err}`);
            });
    };

    // check xem đã check in hoặc check out chưa
    useEffect(() =>
    {
        if (window.location.pathname.split('/').includes('attendance'))
        {
            handleCheckAttendance();
            getAllLeave(); // lấy tất cả ngày xin nghỉ của cả tổ chức
            getIpaddress();
            getActiveIps();
        }
    }, [window.location.pathname]);

    // update real time clock
    useEffect(() =>
    {
        setInterval(() =>
        {
            setTime(moment());
        }, 1000);
    }, []);

    return (
        <div className="attendances-container">
            <div className="setting-btn">
                <Link to="/network-config">
                    <SettingTwoTone className="icon" />
                </Link>
            </div>
            <div className="header">
                <h1 className="title">Chấm công</h1>
                <div className="note">
          Nhân viên lưu ý: Giờ làm việc của công ty chúng ta là từ:{' '}
                    {SHIFT_OBJ.startTime} - {SHIFT_OBJ.endTime}. Mong mọi người đến đúng
          giờ!
                </div>
                <div className="time">
                    {time.format('dddd').charAt(0).toUpperCase() +
            time
                .format('dddd [ngày] DD [tháng] MM [năm] YYYY HH:mm:ss')
                .slice(1)}
                </div>
            </div>
            <div className="content">
                <div
                    className={`attendance-btn checkin-btn ${
                        attendanceRecord.checkInTime ? 'is-check' : ''
                    }`}
                    onClick={handleCheckin}
                >
                    <DoubleRightOutlined />
                    <span className="text">Check-in</span>
                </div>
                <div
                    className={`attendance-btn checkout-btn ${
                        attendanceRecord.checkOutTime ? 'is-check' : ''
                    }`}
                    onClick={handleCheckout}
                >
                    <DoubleRightOutlined />
                    <span className="text">Check-out</span>
                </div>
            </div>
        </div>
    );
};
export default memo(Attendance);
