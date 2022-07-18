import { PlusCircleFilled } from '@ant-design/icons';
import { ModalForm, ProFormDigit } from '@ant-design/pro-form';
import { Button, Col, Row, Space } from 'antd';
import Notify from 'components/Notify';
import { firestore } from 'firebase';
import { useRef } from 'react';
import './LeaveRuleForm.less';

const LeaveRuleForm: React.FunctionComponent<any> = ({
    act,
    record,
    refreshData,
}) =>
{
    const formRef = useRef<any>();

    const handleSubmit = async (vals) =>
    {
        if (act === 'create')
        {
            firestore.add('LeaveRule', vals).then((rs) =>
            {
                if (rs.id)
                {
                    Notify('success', 'Thêm mới thành công');
                    refreshData();
                }
            });
        }
        else
        {
            firestore.update('LeaveRule', record.id, vals).then(() =>
            {
                Notify('success', 'Cập nhật thành công');
                refreshData();
            });
        }

        return true;
    };
    return (
        <ModalForm
            formRef={formRef}
            title={act === 'create' ? 'Thêm quy định' : 'Sửa quy định'}
            initialValues={{ ...record }}
            trigger={
                act === 'create'
                    ? (
                            <Button
                                style={{ marginLeft: 7 }}
                                type="primary"
                            >
                                <Space>
                                    <PlusCircleFilled />
              Thêm cấu hình
                                </Space>
                            </Button>
                        )
                    : (
                            <Button
                                style={{ width: '100%', height: 30 }}
                                type="primary"
                            >
            Sửa
                            </Button>
                        )
            }
            modalProps={{
                cancelText: 'Hủy',
                okText: act === 'create' ? 'Thêm mới' : 'Cập nhật',
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
                    <ProFormDigit
                        label={'Thời gian'}
                        name="totalDate"
                        placeholder="Nhập số"
                        addonAfter="ngày"
                        rules={[{ required: true, message: 'Vui lòng nhập' }]}
                    />
                </Col>
                <Col span={12}>
                    <ProFormDigit
                        label={'Xin nghỉ trước'}
                        name="totalDateBefore"
                        placeholder="Nhập số"
                        addonAfter="ngày"
                        rules={[{ required: true, message: 'Vui lòng nhập' }]}
                    />
                </Col>
            </Row>
        </ModalForm>
    );
};

export default LeaveRuleForm;
