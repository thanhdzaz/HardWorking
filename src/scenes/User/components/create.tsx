import { ProFormText } from '@ant-design/pro-form';
import { Form, FormInstance, Modal, Typography } from 'antd';
import { firestore } from 'firebase';
import { UserInfo } from 'models/User/dto';
import { useRef } from 'react';

const avatarDefault = 'https://icon-library.com/images/avatar-png-icon/avatar-png-icon-13.jpg';
interface Props{
    onClose: (_event: any) => void
    onOk: (_p:Promise<any>) => void
}

export const CreateUser:React.FunctionComponent<Props> = ({
    onClose,
    onOk,
}):JSX.Element =>
{

    const form = useRef<FormInstance>();
    return (
        <Modal
            {...{
                okText: 'Thêm',
                cancelText: 'Đóng',
            }}
            title={'Thêm người dùng'}
            width={'70%'}
            visible
            onCancel={onClose}
            onOk={()=>
            {
                form.current?.validateFields().then((val: UserInfo)=>
                {
                    onOk(new Promise((resolve,_reject) =>
                    {
                        return resolve(async()=>
                        {
                            await firestore.createUser({ ...val,fullName: val.firstName + ' ' + val.lastName,password: '123456',avatarUrl: avatarDefault,disable: false }).then(onClose);
                            return Promise.resolve(true);
                        });
                    }));
                }).catch(e=>e);
                
                
            }}
        >
            <Form
                ref={form as any}
            >
                <ProFormText
                    label="Email"
                    fieldProps={{
                        type: 'email',
                    }}
                    name={'email'}
                    rules={[{ required: true, message: 'Vui lòng nhập Email' }]}
                    wrapperCol={{ span: 19 }}
                    labelCol={{ span: 5 }}
                    placeholder={'Email'}
                />

                <ProFormText
                    label="Họ"
                    name={'firstName'}
                    rules={[{ required: true, message: 'Vui lòng nhập Họ' }]}
                    wrapperCol={{ span: 19 }}
                    labelCol={{ span: 5 }}
                    placeholder={'Họ'}
                />

                <ProFormText
                    label="Tên"
                    name={'lastName'}
                    rules={[{ required: true, message: 'Vui lòng nhập Tên' }]}
                    wrapperCol={{ span: 19 }}
                    labelCol={{ span: 5 }}
                    placeholder={'Tên'}
                />

                <ProFormText
                    label="Địa chỉ"
                    name={'address'}
                    rules={[{ required: true, message: 'Vui lòng nhập Địa chỉ' }]}
                    wrapperCol={{ span: 19 }}
                    labelCol={{ span: 5 }}
                    placeholder={'Địa chỉ'}
                />
            </Form>
            <div>
                <Typography.Text type="danger">Lưu ý: Tài khoản sau khi tạo sẽ có mật khẩu mặc định là 123456</Typography.Text>
            </div>
        </Modal>
    );
};
