import { PlusCircleFilled } from '@ant-design/icons';
import {
    ModalForm,
    ProFormDateRangePicker,
    ProFormTextArea,
} from '@ant-design/pro-form';
import { Button, Col, Row, Space } from 'antd';
import Notify from 'components/Notify';
import { NGHI_CO_PHEP, NGHI_KHONG_PHEP } from 'constant';
import { auth, firestore } from 'firebase';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import './LeaveForm.less';
import LeaveRulePopUp from './LeaveRulePopUp';

const LeaveForm:React.FunctionComponent<any> = ({ refreshData }): JSX.Element =>
{
    // const [employee, setEmployee] = useState([]);
    const [dataLeaveRule, setDataLeaveRule] = useState<any>([]);
    const formRef = useRef();
    
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

        // Nếu số ngày nghỉ có trong quy định nghỉ
        if (isExistInLeaveRule)
        {
            const { dateBefore } = leaveRule;
            const now = moment();
            const totalDayFromNowToDayOff =
        moment(startDate, 'YYYY-MM-DD 00:00:00').diff(now, 'days') + 1;
            if (totalDayFromNowToDayOff >= dateBefore)
            {
                status = NGHI_CO_PHEP;
            }
        }

        firestore
            .add('Leave', {
                startDate: startDate.format('YYYY-MM-DD'),
                endDate: endDate.format('YYYY-MM-DD'),
                userId: auth?.currentUser?.uid,
                reason: vals.reason ?? '',
                status,
            })
            .then((rs) =>
            {
                if (rs.id)
                {
                    Notify('success', 'Thêm mới thành công');
                    refreshData();
                }
            });
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
                        rules={[{ required: true, message: 'Vui lòng nhập' }]}
                    />
                </Col>
                <Col span={12}>
                    <ProFormTextArea
                        name="reason"
                        width="xl"
                        label="Nội dung xin nghỉ"
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
