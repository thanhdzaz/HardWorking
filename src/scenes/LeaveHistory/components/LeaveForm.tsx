import { ExclamationCircleOutlined, PlusCircleFilled } from '@ant-design/icons';
import {
    ModalForm,
    ProFormDateRangePicker,
    ProFormTextArea,
} from '@ant-design/pro-form';
import { Button, Col, Modal, Row, Space } from 'antd';
import Notify from 'components/Notify';
import { NGHI_CO_PHEP, NGHI_KHONG_PHEP } from 'constant';
import { auth, firestore } from 'firebase';
import { getDocs, query, where } from 'firebase/firestore/lite';
import { LeaveDto } from 'models/Task/dto';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import './LeaveForm.less';
import LeaveRulePopUp from './LeaveRulePopUp';

const LeaveForm:React.FunctionComponent<any> = ({ refreshData }): JSX.Element =>
{
    // const [employee, setEmployee] = useState([]);
    const [dataLeaveRule, setDataLeaveRule] = useState<any>([]);
    const formRef = useRef();

    const addLeave = (data) =>
    {
        firestore
            .add('Leave', data)
            .then((rs) =>
            {
                if (rs.id)
                {
                    Notify('success', 'Thêm mới thành công');
                    refreshData();
                }
            });
    };
    
    const handleSubmit = async (vals) =>
    {
        const startDate = moment(vals.dateRange[0], 'DD-MM-YYYY');
        const endDate = moment(vals.dateRange[1], 'DD-MM-YYYY');
        const totalDayOff = endDate.diff(startDate, 'days') + 1;
        const leaveRule: any = dataLeaveRule.find(
            (lr) => lr.totalDate === totalDayOff,
        );
        const isExistInLeaveRule = leaveRule ? true : false;
        let status = NGHI_KHONG_PHEP;

        const q = query(
            firestore.collection('Leave'),
            where('status', '==', NGHI_CO_PHEP),
            where('userId', '==', auth?.currentUser?.uid),
        );

        const querySnapshot = await getDocs(q);

        const l: LeaveDto[] = [];
        querySnapshot.forEach((doc: any) =>
        {
            l.push(doc.data());
        });

        const totalLeaveThisMonth = l.filter(
            (lv) =>
                moment(lv.sendDate).isSameOrAfter(moment().startOf('M')) &&
        moment(lv.sendDate).isSameOrBefore(moment().endOf('M')),
        ).length;

        if (totalLeaveThisMonth >= 1)
        {
            const onOk = async () =>
            {
                status = NGHI_KHONG_PHEP;
                addLeave({
                    startDate: startDate.format('YYYY-MM-DD'),
                    endDate: endDate.format('YYYY-MM-DD'),
                    userId: auth?.currentUser?.uid,
                    reason: vals.reason ?? '',
                    sendDate: moment().format('YYYY-MM-DD'),
                    status,
                });
            };
            Modal.confirm({
                title: 'Xóa phòng',
                icon: <ExclamationCircleOutlined />,
                content:
          'Bạn đã xin nghỉ quá 1 lần trong tháng, nếu tiếp tục đơn xin nghỉ của bạn sẽ bị tính là không phép, bạn có muốn tiếp tục không?',
                onOk,
                okText: 'Có',
                cancelText: 'Không',
            });
        }
        else if (isExistInLeaveRule)
        {
        // Nếu số ngày nghỉ có trong quy định nghỉ
            const { totalDateBefore } = leaveRule;
            const now = moment();
            const totalDayFromNowToDayOff =
        moment(startDate, 'YYYY-MM-DD 00:00:00').diff(now, 'days') + 1;
            if (totalDayFromNowToDayOff >= totalDateBefore)
            {
                status = NGHI_CO_PHEP;
                addLeave({
                    startDate: startDate.format('YYYY-MM-DD'),
                    endDate: endDate.format('YYYY-MM-DD'),
                    userId: auth?.currentUser?.uid,
                    reason: vals.reason ?? '',
                    sendDate: moment().format('YYYY-MM-DD'),
                    status,
                });
            }
            else
            {
                addLeave({
                    startDate: startDate.format('YYYY-MM-DD'),
                    endDate: endDate.format('YYYY-MM-DD'),
                    userId: auth?.currentUser?.uid,
                    reason: vals.reason ?? '',
                    sendDate: moment().format('YYYY-MM-DD'),
                    status,
                });
            }
        }
        return true;
    };
    const getAllLeaveRule = async () =>
    {
        const res = await firestore.get('LeaveRule');
        setDataLeaveRule(res);
    };

    useEffect(() =>
    {
        getAllLeaveRule();
    }, []);

    return (
        <ModalForm
            style={{ zIndex: 0 }}
            formRef={formRef}
            title={'Đăng ký nghỉ'}
            trigger={(
                <Button
                    style={{ marginLeft: 7 }}
                    type="primary"
                >
                    <Space>
                        <PlusCircleFilled />
            Đăng ký nghỉ
                    </Space>
                </Button>
            )}
            modalProps={{
                cancelText: 'Hủy',
                okText: 'Đăng ký',
                destroyOnClose: true,
            }}
            autoFocusFirstInput
            onFinish={handleSubmit}
        >
            <Row
                gutter={[80, 0]}
                style={{ padding: 10 }}
            >
                <Col span={12}>
                    <ProFormDateRangePicker
                        width="xl"
                        fieldProps={{ format: 'DD/MM/YYYY' }}
                        name="dateRange"
                        label={'Khoảng thời gian nghỉ'}
                        placeholder={['Chọn ngày', 'Chọn ngày']}
                        rules={[{ required: true, message: 'Vui lòng nhập' }]}
                    />
                </Col>
                <Col span={12}>
                    <ProFormTextArea
                        name="reason"
                        width="xl"
                        label="Nội dung xin nghỉ"
                        placeholder="Nhập nội dung xin nghỉ..."
                    />
                </Col>
                <Col span={24}>
                    <LeaveRulePopUp />
                </Col>
            </Row>
        </ModalForm>
    );
};

export default LeaveForm;
