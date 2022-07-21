
// import ImageVideoPreview from 'components/ImageVideoPreview';
// import { PRIORITY_LIST } from 'constant';

// import { config } from '@/utils/ckeditor';
import {
    CalendarOutlined,
    CheckOutlined,
    CloseOutlined,
    DownOutlined,
    PlusOutlined,
    RightOutlined,
} from '@ant-design/icons';
import { ProFormSlider } from '@ant-design/pro-form';
import {
    Button,
    Card,
    Col,
    Form,
    FormInstance,
    Input, Modal, notification,
    Row,
    Select,
    Skeleton,
    Spin,
} from 'antd';
import Title from 'antd/lib/typography/Title';
import { PRIORITY_LIST, STATUS_LIST } from 'constant';
import { firestore } from 'firebase';
import { TaskDto } from 'models/Task/dto';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { taskAtom } from 'stores/atom/task';
// import ImageCarousel from './ImageCarousel';

export const IssueDetail:React.FunctionComponent<any> = ({
    id,
    loading,
    setLoading,
    onCancel,
}) =>
{
    const formRef = React.createRef<FormInstance>();
    const [imageLinks] = useState([]);
    const [currentRecord, setCurrentRecord] = useState<TaskDto>({ id: '0' } as any);
    const [userList] = useState([]);
    const [showTitleTool, setShowTitleTool] = useState(false);
    const [showSubIssueTool, setShowSubIssueTool] = useState(false);
    const [showCkeditor, setCkeditor] = useState(false);
    const [subIssues] = useState([] as any);
    const [idIssue, setIdIssue] = useState(id);
    const [hideActivities, setHideActivities] = useState(true);
    // const [imgLoading] = useState(true);
    const [description] = useState('');
    const task = useRecoilValue(taskAtom);

    const [showInputSubIssue, setShowInputSubIssue] = useState(false);
    const titleInputRef = React.createRef<Input>();
    const subIssueInputRef = React.createRef<Input>();


    const showSkeleton = () =>
    {
        setLoading && setLoading(true);

        setTimeout(() =>
        {
            setLoading && setLoading(false);
        }, 1000);
    };

   
    // get sub issue
    useEffect(() =>
    {
        showSkeleton();
    }, [idIssue]);

    // set id issue
    useEffect(() =>
    {
        setIdIssue(id);
    }, [id]);

    const handleGetIssueById = () =>
    {
        firestore.getByDoc('Tasks',idIssue ?? '').then(setCurrentRecord);
    };
    console.log(currentRecord,'currentRecord');

    // set record
    useEffect(() =>
    {
        if (idIssue)
        {
            handleGetIssueById();
        }
    }, [idIssue]);

    const handleUpdate = (key, value):boolean =>
    {

        if (key === 'title' && value === currentRecord.title)
        {
            return false;
        }
        if (key === 'description' && value === currentRecord.description)
        {
            return false;
        }
        if (key === 'priority' && value === currentRecord.priority)
        {
            return false;
        }

        firestore.update('Tasks',idIssue ?? '', { [key]: value }).then(({ data: d }) =>
        {
            if (d.id)
            {
                notification.success({
                    message: 'Cập nhật nhiệm vụ thành công',
                    placement: 'topRight',
                });
                handleGetIssueById();
            }
        }).catch((err) =>err);
        return true;
    };

    // get list user

    useEffect(() =>
    {
        //
    }, []);

    // set data
    useEffect(() =>
    {
        if (formRef.current && currentRecord.id !== '0')
        {
            
           
            formRef?.current?.setFieldsValue({
                ...currentRecord,
                date: [
                    moment(currentRecord.startTime),
                    moment(currentRecord.endTime),
                ],
                assign_to: currentRecord?.assignTo ?? null,
                priority_real: currentRecord.priority.toString(),
                parent_id: currentRecord.parentId?.toString(),
            });
        }
    }, [currentRecord]);

    // get meta and user by tenant
    useEffect(() =>
    {
        //
    }, []);

    const handleCreateSubIssue = (title) =>
    {
        title;
    };


    useEffect(() =>
    {
        // if (currentRecord.project_id)
        // {
        //     getUserInproject(currentRecord.project_id, 'project').then((res) =>
        //     {
        //         setUserProject(res.data);
        //     });
        // }
        // if (idIssue)
        // {
        //     getConversationByResourceId(idIssue).then((res) =>
        //     {
        //         setConversation(res.data);
        //     });
        // }
    }, [currentRecord]);

    return (
        <Modal
            title="Chi tiết công việc"
            width="80%"
            visible
            onCancel={onCancel}
        >
            <Form ref={formRef}>
                <Card className="card-containter">
                    <div className="issue-detail-container">
                        <div
                            className="left-side"
                            style={{ paddingTop: 0 }}
                        >
                            <Skeleton
                                loading={loading}
                                active
                            >
                                <h3 style={{ marginTop: 10, fontSize: 14 }}>
                            Tiêu đề:
                                </h3>
                                <Form.Item
                                    name="title"
                                    className="title-form-control"
                                    rules={[{ required: true, message: 'Tên không được rỗng' }]}
                                >
                                    <Input
                                        ref={titleInputRef}
                                        placeholder="Tên công việc"
                                        style={{ fontSize: 22 }}
                                        onFocus={() => setShowTitleTool(true)}
                                    />
                                </Form.Item>
                                <div className="title-confirm-wrapper">
                                    {showTitleTool && (
                                        <div className="title-confirm">
                                            <Button
                                                onClick={() =>
                                                {
                                                    handleUpdate(
                                                        'title',
                                                        titleInputRef.current && titleInputRef.current.input.value,
                                                    );
                                                    setShowTitleTool(false);
                                                }}
                                            >
                                                <CheckOutlined />
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                {
                                                    formRef?.current?.setFieldsValue({
                                                        title: currentRecord.title,
                                                    });
                                                    setShowTitleTool(false);
                                                }}
                                            >
                                                <CloseOutlined />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                <h3 style={{ marginTop: 10, fontSize: 14 }}>
                            Mô tả:
                                </h3>
                                {!showCkeditor && description === '' && (
                                    <Form.Item name="description">
                                        <Input
                                            placeholder="Nhập mô tả....."
                                            onClick={() =>
                                            {
                                                setCkeditor(true);
                                            }}
                                        />
                                    </Form.Item>
                                )}
                                <Input.TextArea />
                            </Skeleton>
                            <Skeleton
                                loading={loading}
                                active
                            >
                                <h3 style={{ fontSize: 14 }}>
                            Nhiệm vụ con
                                </h3>
                                <Row gutter={[0, 8]}>
                                    {subIssues.map((is, index) => (
                                        <Col
                                            key={is.id}
                                            span={24}
                                        >
                                            <div
                                                className="child-issue-wrapper"
                                                onClick={() => setIdIssue(is.id)}
                                            >
                                        Nhiệm con {index + 1}: {is.title}
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                                <Row
                                    className="row-child-issue-input-wrapper"
                                    gutter={[0, 8]}
                                >
                                    <Col span={24}>
                                        {showInputSubIssue && (
                                            <Form.Item
                                                className="child-issue-input-wrapper"
                                                name="subIssue"
                                            >
                                                <Input
                                                    ref={subIssueInputRef}
                                                    placeholder={`Nhập tên nhiệm vụ con ${subIssues.length + 1}...`}
                                                    onFocus={() => setShowSubIssueTool(true)}
                                                />
                                                <div className="title-confirm-wrapper">
                                                    {showSubIssueTool && (
                                                        <div className="title-confirm">
                                                            <Button
                                                                onClick={() =>
                                                                {
                                                                    handleCreateSubIssue(
                                                                        subIssueInputRef.current && subIssueInputRef.current.input.value,
                                                                    );
                                                                    setShowSubIssueTool(false);
                                                                    setShowInputSubIssue(false);
                                                                }}
                                                            >
                                                                <CheckOutlined />
                                                            </Button>
                                                            <Button
                                                                onClick={() =>
                                                                {
                                                                    setShowSubIssueTool(false);
                                                                    setShowInputSubIssue(false);
                                                                }}
                                                            >
                                                                <CloseOutlined />
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </Form.Item>
                                        )}
                                    </Col>
                                    {!showInputSubIssue && (
                                        <Col
                                            span={24}
                                            style={{ marginTop: -8 }}
                                        >
                                            <Button
                                                type="dashed"
                                                onClick={() => setShowInputSubIssue(true)}
                                            >
                                                <PlusOutlined /> Thêm nhiệm vụ con
                                            </Button>
                                        </Col>
                                    )}
                                </Row>
                                <h3 style={{ marginTop: 10, fontSize: 14 }}>Thêm tệp đính kèm</h3>
                                <Spin
                                    size="large"
                                    spinning={false}// imgLoading
                                >
                                    <div style={{ minHeight: imageLinks.length ? 50 : 0 }}>
                                        {/* <ImageCarousel
                                    imageLinks={imageLinks}
                                    onItemClick={handleItemClick}
                                /> */}
                                    </div>
                                </Spin>
                                {/* <ImageVideoPreview
                            items={imageLinks}
                            imageGalleryRef={imageGalleryRef}
                            startIndex={startIndex}
                            setStartIndex={setStartIndex}
                        /> */}

                                <div style={{ marginTop: 10 }}>
                                    {/* <Upload
                                listType="picture-card"
                                beforeUpload={() => false}
                                onChange={(e) => handleUploadFile(e)}
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
                            </Upload> */}
                                </div>
                            </Skeleton>
                            <Skeleton
                                loading={loading}
                                active
                            >
                                <Row>
                                    <Col span={24}>
                                        <Form.Item
                                            label="Công việc cha"
                                            name="parentId"
                                            labelCol={{ span: 24 }}
                                        >
                                            <Select
                                                placeholder="Tên công việc"
                                                optionFilterProp="children"
                                                filterOption={(input:any, option:any) =>
                                                    option?.children
                                                        .toLowerCase()
                                                        .includes(input.toLowerCase())
                                                }
                                                showSearch
                                                allowClear
                                                onSelect={(val) => handleUpdate('parentId',val)}
                                            >
                                                {
                                                    task
                                                        .filter(
                                                            (item:any) =>
                                                                item.id.toString() !== idIssue &&
                                                !subIssues.map((is) => is.id).includes(item.id),
                                                        )
                                                        .map((item:any) => (
                                                            <Select.Option
                                                                key={item.id.toString()}
                                                                value={item.id.toString()}
                                                            >
                                                                {item.title}
                                                            </Select.Option>
                                                        ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                          
                            
                                </Row>
                            </Skeleton>
                        </div>
                        <div className="right-side">
                            {!loading && (
                                <Form.Item name="status">
                                    <Select
                                        style={{ width: 150 }}
                                        {...{
                                            blue: 'blue',
                                        } as any}
                                        onChange={(val)=>handleUpdate('status',val)}
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

                            )}

                            <div className="user-container">
                                <Skeleton
                                    loading={loading}
                                    avatar
                                    active
                                >
                                    <Row>
                                        <Col span={3}>
                                            {/* <CharacterAvatar
                                        title={currentUser}
                                        size={35}
                                    /> */}
                                        </Col>
                                        <Col span={21}>
                                            <Form.Item name="assign_to">
                                                <Select
                                                    placeholder="Giao cho"
                                                    className="user_select"
                                                    allowClear
                                                    onSelect={(val) => handleUpdate('assignTo', val)}
                                                    onChange={(_val) =>
                                                    {
                                                        // const _user = userList.find(
                                                        //     (u) => u.id.toString() === val?.toString(),
                                                        // );
                                                        // if (_user)
                                                        // {
                                                        //     setCurrentUser(
                                                        //         (_user?.firstName ?? '') + (_user?.lastName ?? ''),
                                                        //     );
                                                        // }
                                                        // else
                                                        // {
                                                        //     setCurrentUser('');
                                                        // }
                                                    }}
                                                >
                                                    {userList &&
                        userList.length > 0 &&
                        userList.map((item:any) => (
                            <Select.Option
                                key={item.id.toString()}
                                value={item.id.toString()}
                            >
                                {item?.firstName ?? ''}
                                {item?.lastName ?? ''}
                            </Select.Option>
                        ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col
                                            span={24}
                                            style={{ height: 40, marginTop: 0 }}
                                        >
                                            <ProFormSlider
                                                fieldProps={{
                                                    onAfterChange: (val) => handleUpdate('progress', val),
                                                    defaultValue: currentRecord.progress,
                                                }}
                                                name="progress"
                                                width="lg"
                                                min={0}
                                                max={100}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <span>
                                                <CalendarOutlined /> Từ:{' '}
                                                {currentRecord.startTime}
                                            </span>
                                            <span style={{ marginLeft: 15 }}>
                    Đến:{' '}
                                                {currentRecord.endTime}
                                            </span>
                                        </Col>
                                    </Row>
                                    <Row style={{ marginTop: 5 }}>
                                        <Col span={24}>
                                            <Form.Item
                                                style={{ marginTop: 0 }}
                                                name="priority"
                                                label="Độ ưu tiên"
                                            >
                                                <Select
                                                    style={{ width: 150 }}
                                                    onSelect={(val) => handleUpdate('priority', val)}
                                                >
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
                                   
                                </Skeleton>
                            </div>
                            <div className="user-container">
                                <Skeleton
                                    loading={loading}
                                    active
                                >
                                    <Row>
                                        <Col span={24}>
                                            <Title level={5}>
                    Lịch sử{' '}
                                                {!hideActivities
                                                    ? (
                                                            <DownOutlined
                                                                style={{ fontSize: 14 }}
                                                                onClick={() => setHideActivities(true)}
                                                            />
                                                        )
                                                    : (
                                                            <RightOutlined
                                                                style={{ fontSize: 14 }}
                                                                onClick={() => setHideActivities(false)}
                                                            />
                                                        )}
                                            </Title>
                                    
                                        </Col>
                                    </Row>
                                </Skeleton>
                            </div>
                        </div>
                    </div>
                </Card>
            </Form>
        </Modal>
    );
};
