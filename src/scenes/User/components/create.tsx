import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { Button } from 'antd';
import { firestore } from 'firebase';
import { UserInfo } from 'models/User/dto';

interface Props{
    onClose: (_event: any) => void
}

export const CreateUser:React.FunctionComponent<Props> = ({
    onClose,
}):JSX.Element =>
{
    return (
        <ModalForm
            modalProps={{
                okText: 'Thêm',
                cancelText: 'Đóng',
            }}
            title={'Thêm người dùng'}
            trigger={<Button icon={<PlusOutlined />} />}
            onFinish={async(val:UserInfo)=>
            {
                await firestore.createUser({ ...val,fullName: val.firstName + ' ' + val.lastName,password: '123456' }).then(onClose);
                return Promise.resolve(true);
            }}
        >
            <ProFormText
                label="Email"
                fieldProps={{
                    type: 'email',
                }}
                name={'email'}
                placeholder={'Email'}
            />

            <ProFormText
                label="Họ"
                name={'firstName'}
                placeholder={'Họ'}
            />

            <ProFormText
                label="Tên"
                name={'lastName'}
                placeholder={'Tên'}
            />

            <ProFormText
                label="Địa chỉ"
                name={'address'}
                placeholder={'Địa chỉ'}
            />

        </ModalForm>
    );
};
