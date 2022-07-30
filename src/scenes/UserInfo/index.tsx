import { UserOutlined } from '@ant-design/icons';
import { ProFormRadio } from '@ant-design/pro-form';
import { Avatar, Button, Card, Col, Form, FormInstance, Input, Popover, Row, Typography } from 'antd';
import Notify from 'components/Notify';
import { auth, firestore, storage } from 'firebase';
import { L } from 'lib/abpUtility';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { userInfoAtom } from 'stores/atom/user';

const UserInfo:React.FunctionComponent = () =>
{
    const form = React.createRef<FormInstance>();
    const [userInfo,setUserInfo] = useRecoilState(userInfoAtom);
    const [isEdit,setIsEdit] = useState(false);

    const getUser = () =>
    {
        if (auth.currentUser?.uid)
        {
            firestore.getByDoc('Users',auth.currentUser?.uid ?? '').then((userInfo) =>
            {
                setUserInfo(userInfo);
            });
        }
    };

    useEffect(() =>
    {
        getUser();
    },[]);


    useEffect(() =>
    {
        form.current?.setFieldsValue(userInfo);
    },[userInfo]);

    const handleUpdate = async () =>
    {
        form.current?.validateFields().then((value)=>
        {
            firestore.update('Users',auth.currentUser?.uid ?? '',{ ...value,fullName: `${value.firstName} ${value.lastName}` }).then(() =>
            {
                Notify('success','Cập nhật thành công');
                setIsEdit(false);
                getUser();
            }).catch(err=>
            {
                Notify('success',JSON.stringify(err));
            });
        }).catch(err=>err);
    };
    
    const handleUpdateAvatar = (e: any) =>
    {
        storage.upload(`public/avatar/${auth.currentUser?.uid}.jpg`,e.currentTarget.files[0]).then((response)=>
        {
            firestore.update('Users',auth.currentUser?.uid ?? '',{ avatarUrl: response }).then(()=>
            {
                getUser();
                Notify('success','Cập nhật thành công');
            });
        });
    };

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            md: { span: 5 },
        },
        wrapperCol: {
            xs: { span: 24 },
            md: { span: 18 },
        },
    };

    
    return (
        <Card>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                }}
            >
                <Popover
                    content='Bấm để thay đổi'
                >
                    <div
                        style={{
                            cursor: 'pointer',
                        }}
                        onClick={()=>
                        {
                            document.getElementById('fileNe')?.click();
                        }}
                    >
                        <Avatar
                            size={100}
                            icon={!userInfo.avatarUrl && <UserOutlined />}
                            src={userInfo?.avatarUrl ?? null}
                    
                        />
                    </div>
                </Popover>
                <div
                    style={{
                        display: 'flex',
                        paddingLeft: 40,
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}
                >
                    
                    <Input
                        id={'fileNe'}
                        style={{ display: 'none' }}
                        type="file"
                        onChange={handleUpdateAvatar}
                    />
                  
                    <Typography.Text
                        strong
                    >
                        {
                            userInfo.fullName
                        }
                    </Typography.Text>
                    <Typography.Text
                        type={'secondary'}
                    >
                        {
                            userInfo.email
                        }
                    </Typography.Text>
                </div>
            </div>
            <Form
                ref={form}
                style={{
                    paddingLeft: 100,
                    paddingTop: 30,
                }}
            >
                <Row>
                    <Col span={1} />
                    <Col span={11}>
                        <Form.Item
                            {...formItemLayout}
                            name='firstName'
                            label="Họ"
                            rules={[
                                { required: true, message: L('Nhập Họ') },
                            ]}
                        >
                            <Input
                                disabled={!isEdit}
                                placeholder='Họ'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={1} />
                    <Col span={11}>
                        <Form.Item
                            {...formItemLayout}
                            name='lastName'
                            label="Tên"
                            rules={[
                                { required: true, message: L('Nhập Tên') },
                            ]}
                        >
                            <Input
                                disabled={!isEdit}
                                placeholder='Tên'
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={1} />
                    <Col span={11}>
                        <Form.Item
                            {...formItemLayout}
                            name='email'
                            label="Email"
                            rules={[
                                { required: true, message: L('Nhập Email') },
                                {
                                    pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g,
                                    message: L('Sai định dạng Email'),
                                },
                            ]}
                        >
                            <Input
                                placeholder='Email'
                                disabled
                            />
                        </Form.Item>
                    </Col>
                    <Col span={1} />
                    <Col span={11}>
                        <Form.Item
                            {...formItemLayout}
                            name='phone'
                            label="Số điện thoại"
                            rules={[{
                                required: true, message: L('Nhập Số Điện Thoại'),
                            },
                            {
                                pattern: /^([0]{1}[0-9]{9})$/g,
                                message: L('Số điện thoại phải đủ 10 số và bắt đầu bằng 0'),
                            }]}
                        >
                            <Input
                                disabled={!isEdit}
                                placeholder='Số điện thoại'
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={1} />

                    <Col span={11}>
                        <Form.Item
                            {...formItemLayout}
                            name='address'
                            label="Địa chỉ"
                        >
                            <Input.TextArea
                                disabled={!isEdit}
                                placeholder='Địa chỉ'
                                autoSize
                            />
                        </Form.Item>
                    </Col>
                    <Col span={1} />
                    <Col span={11}>
                      
                        <ProFormRadio.Group
                            formItemProps={{ ...formItemLayout }}
                            name="gender"
                            disabled={!isEdit}
                            label="Giới tính"
                            options={[
                                {
                                    label: 'Nam',
                                    value: '0',
                                },
                                {
                                    label: 'Nữ',
                                    value: '1',
                                },
                                {
                                    label: 'Khác',
                                    value: '2',
                                },
                            ]}
                        />
                    </Col>
                </Row>
            </Form>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                }}
            >
                {
                    isEdit && (
                        <Button
                            style={{
                                paddingLeft: 40,paddingRight: 40,
                                marginRight: 10,
                            }}
                            onClick={()=>
                            {
                                form.current?.setFieldsValue(userInfo);
                                setIsEdit(false);
                            }}
                        >
                            Hủy
                        </Button>
                    )
                }
                <Button
                    style={{
                        paddingLeft: 40,paddingRight: 40,
                    }}
                    type={isEdit ? 'primary' : 'default'}
                    onClick={() =>
                    {
                        if (isEdit)
                        {
                            handleUpdate();
                        }
                        else
                        {
                            setIsEdit(true);
                        }
                    }}
                >
                    {isEdit ? 'Lưu' : 'Sửa'}
                </Button>
            </div>
        </Card>
    );
};

export default UserInfo;
