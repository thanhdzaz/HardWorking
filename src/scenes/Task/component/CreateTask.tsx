/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';

import {
    Button,
    Col,
    DatePicker,
    Form,
    FormInstance,
    Input,
    Modal,
    Row,
    Select,
    Slider,
    Upload,
} from 'antd';
import { PRIORITY_LIST, STATUS_LIST } from 'constant';
import { firestore } from 'firebase';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { userAtom } from 'stores/atom/user';
// import { useSearchParams } from 'react-router-dom';
// import { CharacterAvatar } from '../../../components/avatar/CharacterAvatar';
// import { priorityObj } from '../../../constants';


// const listType = ['v_relationship', 'v_list', 'v_user'];

export function CreateIssuePage({
    project = '',
    listStatus = '',
    pageMode = '',
    onCancel = ()=>
    {
        //
    },
} = {})
{

    const form = React.createRef<FormInstance>();
    const [meta] = useState([]);

    const users = useRecoilValue(userAtom);
    const [craeteState] = useState(false);
    const [subIssues, setSubIssues] = useState<any[]>([]);


    const handleCreate = () =>
    {
        form?.current && form.current?.validateFields().then(async (val) =>
        {
            val;
        });
    };

    const handleUploadFile = async ({ fileList: _newFileList }) =>
    {
        //
    };

    const onOk = () =>
    {
        form.current?.validateFields().then(async (vals) =>
        {
            const data = {
                title: vals?.title ?? '',
                description: vals?.description ?? '',
                status: vals?.status ?? '',
                priority: vals?.priority ?? '',
                startTime: vals?.date[0].format('DD/MM/YYYY') ?? '',
                endTime: vals?.date[1].format('DD/MM/YYYY') ?? '',
            };
            firestore.add('Tasks',data).then(({ id }) =>
            {
                if (subIssues.length > 0)
                {
                    subIssues.forEach(issue =>
                    {
                        firestore.add('Tasks',{ ...data,title: issue,parentId: id });

                    });
                }
            });
            
        });
    };


    useEffect(() =>
    {
        form?.current?.setFieldsValue({
            status: 0,
            progress: 0,
            priority: 2,
        });
    }, [meta, project, listStatus]);

    return (
        <Modal
            width={'80%'}
            title="Thêm mới công việc"
            okText='Thêm mới'
            visible
            onCancel={onCancel}
            onOk={onOk}
        >
            <Form
                ref={form}
                style={{ height: 'auto' }}
            
            >
                <div className="create-issue-container">
                    <div className="left-side">
                        <h3 style={{ marginTop: 0, fontSize: 14 }}>
                           Tiêu đề:
                        </h3>
                        <Form.Item
                            name="title"
                            rules={[
                                {
                                    required: true,
                                    message: 'Tên không được rỗng',
                                },
                            ]}
                        >
                            <Input
                                placeholder="Tên công việc"
                                style={{}}
                            />
                        </Form.Item>
                        <div>
                            <h3 style={{ marginTop: 0, fontSize: 14 }}>
                                Mô tả:
                            </h3>
                         
                        </div>
                        <div
                            className="div-btn"
                            // disabled={!permissions.DW__WORK__EDIT}
                            onClick={() => setSubIssues((prev:any) => [...prev, 1])}
                        >
                            <PlusOutlined /> Thêm nhiệm vụ con
                        </div>
                        <Row
                            className="row-child-issue-input-wrapper"
                            gutter={[0, 8]}
                        >
                            {subIssues.length
                                ? subIssues.map((_, index) => (
                                    <Col
                                        key={index}
                                        span={24}
                                    >
                                        <Form.Item
                                            style={{ marginTop: -10 }}
                                            labelCol={{ span: 24 }}
                                            className="child-issue-input-wrapper"
                                            label={`Nhiệm vụ con ${index + 1}`}
                                            name={`exchange${index}`}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Trường này là bắt buộc',
                                                },
                                            ]}
                                        >
                                            <Input
                                                bordered={false} // handleCreateSubIssue(e.target.value, index)}
                                                onPressEnter={(e) =>
                                                {
                                                    setSubIssues((prev) =>
                                                    {
                                                        const data = [...prev];
                                                        data[index] = e.currentTarget.value;
                                                        return data;
                                                    });
                                                    e.currentTarget.blur();
                                                }}
                                            />
                                        </Form.Item>
                                        <CloseOutlined
                                            className="close-icon"
                                            style={{ position: 'absolute', bottom: 10, right: 10 }}
                                            onClick={() =>
                                                setSubIssues((prev) =>
                                                {
                                                    const tt = [...prev];
                                                    tt.splice(index, 1);
                                                    return tt;
                                                })
                                            }
                                        />
                                    </Col>
                                ))
                                : ''}
                        </Row>
                        <div style={{ marginTop: 10 }}>
                            <Upload
                                listType="picture-card"
                                // disabled={!permissions.DW__WORK__EDIT}
                                beforeUpload={() => false}
                                onChange={handleUploadFile}
                            >
                                <div>
                                    <PlusOutlined />
                                    <div
                                        style={{
                                            marginTop: 8,
                                        }}
                                    >
                    Upload
                                    </div>
                                </div>
                            </Upload>
                        </div>

                        <Form.Item
                            name="parent_id"
                            label="Công việc cha"
                            labelCol={{ span: 24 }}
                        >
                            <Select
                                placeholder="Tên công việc"
                                filterOption={(input, option):any => (option?.children)?.includes(input as any)}
                                filterSort={(optionA: any, optionB: any) =>
                                    (optionA?.children)?.toLowerCase()
                                        .localeCompare((optionB?.children)?.toLowerCase())
                                }
                                allowClear
                                showSearch
                                onChange={(_value) =>
                                {
                                    // setParent(value ?? '');
                                }}
                            >
                               
                                {
                                    //
                                }
                            </Select>
                        </Form.Item>
                        
                    </div>
                    <div className="right-side">
                        <Form.Item name="status">
                            <Select
                                style={{ width: 150 }}
                                {...{
                                    blue: 'blue',
                                } as any}
                            >
                               
                                {
                                    STATUS_LIST.map((status) =>(
                                        <Select.Option
                                            key={status.id}
                                            value={status.id}
                                        >
                                            {status.title}
                                        </Select.Option>
                                    ))

                                }
                            </Select>
                        </Form.Item>
                        <div className="user-container">
                            <Row>
                                <Col span={2}>
                                    {/* <Avatar src="https://joeschmoe.io/api/v1/random" /> */}
                                    {/* <CharacterAvatar
                                        title={currentUser}
                                        size={35}
                                    /> */}
                                </Col>
                                <Col span={22}>
                                    <Form.Item name="assign_to">
                                        <Select
                                            placeholder="Giao cho"
                                            className="user_select"
                                            allowClear
                                            onChange={(val) =>
                                            {
                                                // const us = userList.find(
                                                //     (u) => u.id.toString() === val?.toString(),
                                                // );
                                                // if (us)
                                                // {
                                                //     setCurrentUser(
                                                //         (us?.firstName ?? '') + (us?.lastName ?? ''),
                                                //     );
                                                // }
                                                // else
                                                // {
                                                //     setCurrentUser('');
                                                // }
                                                val;
                                            }}
                                        >
                                           
                                            {
                                                users.map((user) =>(
                                                    <Select.Option
                                                        key={user.id}
                                                        value={user.id}
                                                    >
                                                        {user.fullName}
                                                    </Select.Option>
                                                ))
                                            }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <Form.Item
                                        name="progress"
                                        label="Tiến độ"
                                    >
                                        <Slider
                                            tooltipPlacement="bottom"
                                            range={false}
                                            min={0}
                                            max={100}
                                            style={{ height: '35px' }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Item
                                        name="date"
                                        label="Thời gian"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Thời gian không được rỗng',
                                            },
                                        ]}
                                    >
                                        <DatePicker.RangePicker showTime />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: '10px' }}>
                                <Col>
                                    <Form.Item
                                        name="priority"
                                        label="Độ ưu tiên"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Hãy chọn độ ưu tiên !!',
                                            },
                                        ]}
                                    >
                                        <Select style={{ width: 150 }}>
                                            {
                                                PRIORITY_LIST.map((status) =>(
                                                    <Select.Option
                                                        key={status.id}
                                                        value={status.id}
                                                    >
                                                        {status.title}
                                                    </Select.Option>
                                                ))

                                            }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <div className="divider" />
                            <Row style={{ padding: '5px' }}>
                                <Col span={12}>Trạng thái: Mới</Col>
                                <Col span={12}>Id nhiệm vụ: null</Col>
                            </Row>
                        </div>
                    </div>
                    <div className="footer">
                        {pageMode !== 'modal' && (
                            <>
                                <Button
                                    onClick={() =>
                                    {
                                        if (craeteState)
                                        {
                                            history?.back();
                                        }
                                        else
                                        {
                                            Modal.confirm({
                                                title: 'Cảnh báo',
                                                content: 'Thao tác chưa lưu bạn có chắc muốn hủy?',
                                                okText: 'Xác nhận',
                                                cancelText: 'Đóng',
                                                onOk: () =>
                                                {
                                                    history?.back();
                                                },
                                            });
                                        }
                                    }}
                                >
                Quay lại
                                </Button>
                       
                                <Button
                                    type="primary"
                                    onClick={handleCreate}
                                >
              Thêm
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </Form>
        </Modal>
    );
}
