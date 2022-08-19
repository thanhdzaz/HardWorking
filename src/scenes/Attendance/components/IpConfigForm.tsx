import { PlusCircleFilled } from '@ant-design/icons';
import { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { Button, Space } from 'antd';
import Notify from 'components/Notify';
import { firestore } from 'firebase';
import { useRef } from 'react';

const IpConfigForm: React.FunctionComponent<any> = ({
    refreshData,
    act,
    record,
}): JSX.Element =>
{
    const formRef = useRef();

    const handleSubmit = async (vals) =>
    {
        if (act === 'create')
        {
            firestore.add('IpConfig', vals).then((rs) =>
            {
                if (rs.id)
                {
                    Notify('success', 'Thêm mới thành công');
                    refreshData();
                }
            });
            return true;
        }
        else
        {
            firestore.update('IpConfig', record.id, vals).then(() =>
            {
                Notify('success', 'Cập nhật thành công');
                refreshData();
            });
            return true;
        }
    };

    return (
        <ModalForm
            style={{ zIndex: 0 }}
            formRef={formRef}
            title={act === 'create' ? 'Thêm địa chỉ IP' : 'Sửa địa chỉ ip'}
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
                okText: act === 'create' ? 'Thêm' : 'Cập nhật',
                destroyOnClose: true,
            }}
            autoFocusFirstInput
            onFinish={handleSubmit}
        >
            <ProFormText
                label="Tên dải mạng"
                name="name"
                placeholder="Tên dải mạng..."
                rules={[{ required: true, message: 'Vui lòng nhập' }]}
            />
            <ProFormSelect
                label="Trạng thái"
                name="status"
                placeholder="Chọn trạng thái"
                options={[
                    { value: 1, label: 'Kích hoạt' },
                    { value: 0, label: 'Chưa kích hoạt' },
                ]}
            />
        </ModalForm>
    );
};

export default IpConfigForm;
