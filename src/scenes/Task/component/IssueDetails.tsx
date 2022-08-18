
// import ImageVideoPreview from 'components/ImageVideoPreview';
// import { PRIORITY_LIST } from 'constant';

// import { config } from '@/utils/ckeditor';
import {
    CheckOutlined,
    CloseOutlined,
    DownOutlined,
    PlusOutlined,
    RightOutlined,
    SendOutlined,
} from '@ant-design/icons';
import { ProFormDateRangePicker, ProFormSlider } from '@ant-design/pro-form';
import {
    Avatar,
    Button, Col,
    Form,
    FormInstance,
    Input, Modal, Row,
    Select,
    Skeleton,
    Spin,
    Typography,
} from 'antd';
import Title from 'antd/lib/typography/Title';
import Notify from 'components/Notify';
import { PRIORITY_LIST, STATUS_LIST } from 'constant';
import { auth, firestore, storage } from 'firebase';
import { deleteField, getDocs, query, where } from 'firebase/firestore/lite';
import { checkLog } from 'hook/useCheckLog';
import { CheckLog, TaskDto,TaskCommentedDto } from 'models/Task/dto';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { taskAtom } from 'stores/atom/task';
import { userProjectAtom } from 'stores/atom/user';
import { ACTION, getDate, LOGKEYS } from 'utils';
// import ImageCarousel from './ImageCarousel';

export const IssueDetail:React.FunctionComponent<any> = ({
    id,
    loading,
    setLoading,
    reloadAndClose,
}) =>
{
    const formRef = React.createRef<FormInstance>();
    const messageRef = React.createRef<Input>();
    const [imageLinks] = useState([]);
    const [currentRecord, setCurrentRecord] = useState<TaskDto>({ id: '0' } as any);
    const userList = useRecoilValue(userProjectAtom);
    const [showTitleTool, setShowTitleTool] = useState(false);
    const [showSubIssueTool, setShowSubIssueTool] = useState(false);
    const [showCkeditor, setCkeditor] = useState(false);
    const [subIssues,setSubIssues] = useState([] as any);
    const [idIssue, setIdIssue] = useState(id);
    const [repplingMessage, setRepplingMessage] = useState<TaskCommentedDto | null>(null);
    const [hideActivities, setHideActivities] = useState(true);
    // const [imgLoading] = useState(true);
    const [description,setDescription] = useState('');
    const tasks = useRecoilValue(taskAtom);
    const [message,setMessage] = useState('');
    const [listMessage,setListMessage] = useState<TaskCommentedDto[]>([]);
    const [avatar, setAvatar] = useState<string>('');

    const [showInputSubIssue, setShowInputSubIssue] = useState(false);
    const titleInputRef = React.createRef<Input>();
    const subIssueInputRef = React.createRef<Input>();
    const [logs,setLogs] = useState<CheckLog[]>([]);

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
        console.log('issue');

        firestore.getByDoc('Tasks',idIssue ?? '').then(setCurrentRecord);
    };

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
        const data = { [key]: value ?? deleteField() };
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
        if (key === 'dateRange')
        {
            const startTime = value[0].format('DD/MM/YYYY');
            const endTime = value[1].format('DD/MM/YYYY');
            firestore.update('Tasks',idIssue ?? '', { startTime, endTime }).then(() =>
            {
           
                Notify('success','Cập nhật thành công');
                Promise.all([checkLog({
                    action: 'update',
                    field: 'startTime',
                    newValue: startTime ?? '',
                    oldValue: currentRecord.startTime?.toString() ?? '',
                    taskId: currentRecord.id,
                }),
                checkLog({
                    action: 'update',
                    field: 'endTime',
                    newValue: endTime ?? '',
                    oldValue: currentRecord.endTime?.toString() ?? '',
                    taskId: currentRecord.id,
                })]).then(() =>
                {
                    setCurrentRecord({ ...currentRecord, startTime, endTime });
                    handleGetIssueById();
                })
                ;

            
            }).catch((err) =>err);
            return true;
        }
        
        firestore.update('Tasks',idIssue ?? '', data).then(() =>
        {
           
            Notify('success','Cập nhật thành công');
            checkLog({
                action: 'update',
                field: key,
                newValue: value ?? '',
                oldValue: currentRecord[key] ?? '',
                taskId: currentRecord.id,
            }).then(()=>
            {
                setCurrentRecord({ ...currentRecord, [key]: value });
                handleGetIssueById();
            });
            
        }).catch((err) =>err);

        return true;
    };

    const getMessage = async() =>
    {
        console.log('message');
        
        setMessage('');
        setRepplingMessage(null);
        const q = query(
            firestore.collection('Comments'),
            where('taskId', '==', idIssue),
        );
        const querySnapshot = await getDocs(q);
        const t: TaskCommentedDto[] = [];
        querySnapshot.forEach((doc) =>
        {
            t.push(doc.data() as any);
        });

        setListMessage(t.sort((a,b)=>b.time.seconds - a.time.seconds));
    };

    // get list user

    useEffect(() =>
    {
        
        handleGetIssueById();
    }, [idIssue]);


    const getLogs = async() =>
    {
        console.log('logs');

        const q = query(firestore.collection('CheckLogs'),where('taskId', '==', currentRecord.id));
        const querySnapshot = await getDocs(q);
                
        const l:CheckLog[] = [];
        querySnapshot.forEach((doc: any) =>
        {
            l.push(doc.data());
        });
        setLogs(l.sort((a, b) =>b.time.seconds - a.time.seconds));
    };

    const getSubIssue = async() =>
    {
        const q = query(firestore.collection('Tasks'),where('parentId', '==', currentRecord.id));
        const querySnapshot = await getDocs(q);
                
        const l:CheckLog[] = [];
        querySnapshot.forEach((doc: any) =>
        {
            l.push(doc.data());
        });
        setSubIssues(l);
    };


    const handleSubmitMessage = () =>
    {
    
        console.log({
            userId: auth.currentUser?.uid,
            taskId: id,
            content: message,
            time: new Date(),
            ...repplingMessage && repplingMessage !== undefined ? { repply: repplingMessage.id } : {},
        });
       
        firestore.add('Comments',{
            userId: auth.currentUser?.uid,
            taskId: id,
            content: message,
            time: new Date(),
            ...repplingMessage && repplingMessage !== undefined ? { repply: repplingMessage.id } : {},
        }).then(getMessage);
    };


    const handleUploadFile = (file:any) =>
    {
        if (file?.target?.files[0])
        {
            storage.upload(`public/task/${currentRecord.id}/${file?.target?.files[0].name}`,file?.target?.files[0]).then((response)=>
            {
                firestore.update('Tasks',idIssue ?? '', { fileAttachs: [...currentRecord.fileAttachs ?? [] , { name: file?.target?.files[0].name,realUrl: response }] }).then(()=>
                {
                    handleGetIssueById();
                    Notify('success','Cập nhật thành công');
                });
            });
        }
        else
        {
            console.log('file null');
            
        }
        
    };

    const handleRepply = (message: TaskCommentedDto) =>
    {
        messageRef.current?.focus();
        setRepplingMessage(message);
    };

    const renderRep = (currMess: TaskCommentedDto) =>
    {
        const message = listMessage.find(m=>m.id === currMess.repply);

        const u = userList.find((u) =>u.id === message?.userId);

        return (
            <div
                key={message?.id}
                style={{
                    width: '99%',
                    backgroundColor: '#cccccc80',
                    borderRadius: 10,
                    paddingLeft: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    paddingTop: 10,
                    paddingBottom: 10,
                    justifyContent: 'center',
                    marginBottom: 5,
                    opacity: 0.8,
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',

                    }}
                >
                    <Avatar src={u?.avatarUrl} />
                    <span
                        style={{
                            marginLeft: 20,
                            maxWidth: '90%',
                        }}
                    >
                        <Typography.Text strong>{u?.fullName}</Typography.Text>
                        <br />
                        <Typography.Text>{message?.content}</Typography.Text>
                    </span>
                </div>
                <div style={{ color: '#00000090' }}>{moment.unix(message?.time?.seconds as any).format('DD/MM/YYYY HH:mm')}</div>

            </div>
        );
    };

    // get meta and user by tenant
    useEffect(() =>
    {
        //
    }, []);

    const handleCreateSubIssue = (title) =>
    {
        const parent:any = { ...currentRecord };

        delete parent.title;
        delete parent.id;
        delete parent.assignTo;
        delete parent.parentId;
        delete parent.fileAttachs;
        firestore.add('Tasks',{ ...parent,parentId: currentRecord.id,title }).then(getSubIssue);
        
    };


    useEffect(() =>
    {
        getLogs();
        getSubIssue();
        const u = userList.find((user)=> user.id === currentRecord.assignTo);
        setAvatar(u?.avatarUrl ?? '');
        getMessage();

        if (formRef.current && currentRecord.id !== '0')
        {
            
           
            formRef?.current?.setFieldsValue({
                ...currentRecord,
                assignTo: currentRecord?.assignTo ?? null,
                priority: currentRecord.priority,
                parentId: currentRecord.parentId,
                dateRange: [getDate(currentRecord.startTime as any), getDate(currentRecord.endTime as any)],
            });
        }
    }, [currentRecord]);

    console.log('currentRecord',currentRecord);
    console.log('message',message);


    return (
        <Modal
            title="Chi tiết công việc"
            footer={false}
            width="95%"
            visible
            onCancel={reloadAndClose}
        >
            <Form ref={formRef}>
                <div
                    className="card-containter"
                    style={{
                        height: '70vh',
                    }}
                >
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
                                <Form.Item
                                    name="description"
                                    className="child-issue-wrapper"
                                >
                                    <Input.TextArea
                                        placeholder="Nhập mô tả....."
                                        value={description}
                                        autoSize
                                        onChange={(val)=>
                                        {
                                            setDescription(val.currentTarget.value);
                                        }}
                                        onClick={() =>
                                        {
                                            setCkeditor(true);
                                        }}
                                    />
                                    <div className="title-confirm-wrapper">
                                        {showCkeditor && (
                                            <div className="title-confirm">
                                                <Button
                                                    onClick={() =>
                                                    {
                                                        handleUpdate('description',description);
                                                    }}
                                                >
                                                    <CheckOutlined />
                                                </Button>
                                                <Button
                                                    onClick={() =>
                                                    {
                                                        setCkeditor(false);
                                                    }}
                                                >
                                                    <CloseOutlined />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </Form.Item>
                            
                                
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
                                    <Col
                                        span={24}
                                        style={{ marginTop: -8 }}
                                    >
                                        <Button
                                            type="dashed"
                                            onClick={() =>
                                            {
                                                const btn:any = document.querySelectorAll('#input-file-upload')?.[0];
                                                btn.click();
                                            }}
                                        >
                                            <Input
                                                id="input-file-upload"
                                                type="file"
                                                style={{
                                                    display: 'none',
                                                }}
                                                onChange={handleUploadFile}
                                            />
                                            <PlusOutlined />
                                            Thêm tệp đính kèm
                                        </Button>
                                    </Col>

                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                        }}
                                    >
                                        {
                                            currentRecord?.fileAttachs?.map((fileAttachment,index) =>(
                                                <a
                                                    key={index}
                                                    href={fileAttachment.realUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    style={{
                                                        marginTop: 10,
                                                    }}
                                                >
                                                    {fileAttachment.name}

                                                </a>
                                            ))
                                        }
                                    </div>
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
                                                    tasks
                                                        .filter(
                                                            (item:any) =>
                                                                item.id.toString() !== idIssue &&
                                                    !subIssues.map((is) => is.id).includes(item.id),
                                                        )
                                                        .map((item:any) => (
                                                            <Select.Option
                                                                key={item.id?.toString()}
                                                                value={item.id?.toString()}
                                                            >
                                                                {item.title}
                                                            </Select.Option>
                                                        ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                          
                            
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <Form.Item
                                            label="Trao đổi"
                                            labelCol={{ span: 24 }}
                                            wrapperCol={{ span: 24 }}
                                        >
                                            <Input
                                                ref={messageRef}
                                                style={{ width: '100%' }}
                                                className="child-issue-wrapper"
                                                placeholder="Nhập tin nhắn trao đổi....."
                                                value={message}
                                                addonAfter={(
                                                    <SendOutlined
                                                        style={{
                                                            border: 'none',
                                                        }}
                                                        onClick={handleSubmitMessage}
                                                    />
                                                )}
                                                onChange={(e)=>setMessage(e.target.value)}
                                            />
                                   
                                        </Form.Item>
                                        {
                                            repplingMessage && (
                                                <div
                                                    style={{
                                                        marginTop: -20,
                                                        marginBottom: 10,
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        cursor: 'auto',
                                                    }}
                                                >
                                                    Đang trả lời: &nbsp;
                                                    <Typography.Text
                                                        style={{
                                                            width: '85%',
                                                        }}
                                                        ellipsis
                                                    >{repplingMessage.content}
                                                    </Typography.Text>
                                                    <Typography.Link
                                                        onClick={()=>setRepplingMessage(null)}
                                                    >
                                                        Bỏ
                                                    </Typography.Link>
                                                </div>
                                            )
                                        }
                                    </Col>
                                </Row>
                                <Row>
                                    {
                                        listMessage.length > 0 && (
                                            <Col
                                                span={24}
                                                className="child-issue-wrapper"
                                                style={{
                                                    height: 400,
                                                    overflowY: 'scroll' ,

                                                }}
                                            >
                                                {
                                                    listMessage.map((message) =>
                                                    {
                                                        const u = userList.find((u) =>u.id === message.userId);
                                                        return (
                                                            <div
                                                                key={message.id}
                                                                style={{
                                                                    width: '100%',
                                                                    backgroundColor: '#fff',
                                                                    borderRadius: 10,
                                                                    paddingLeft: 10,
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    paddingTop: 10,
                                                                    paddingBottom: 10,
                                                                    justifyContent: 'center',
                                                                    marginBottom: 5,
                                                                }}
                                                            >
                                                                {
                                                                    message.repply && renderRep(message)
                                                                }
                                                        

                                                                <div
                                                                    style={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        ...message.repply && { paddingLeft: '10%' },
                                                                    }}
                                                                >
                                                                    <Avatar src={u?.avatarUrl} />
                                                                    <span
                                                                        style={{
                                                                            marginLeft: 20,
                                                                            maxWidth: '90%',
                                                                        }}
                                                                    >
                                                                        <Typography.Text strong>{u?.fullName}</Typography.Text>
                                                                        <br />
                                                                        <Typography.Text>{message.content}</Typography.Text>
                                                                    </span>
                                                                </div>
                                                               
                                                                <div style={{ color: '#00000090', ...message.repply && { paddingLeft: '10%' } }}>{moment.unix(message.time.seconds).format('DD/MM/YYYY HH:mm')}</div>
                                                                <div
                                                                    style={{
                                                                        width: message.repply ? 200 : 100,
                                                                        display: 'flex',
                                                                        justifyContent: 'space-around',
                                                                        ...message.repply && { paddingLeft: '10%' },
                                                                    }}
                                                                >
                                                                    <Typography.Link
                                                                        color='red'
                                                                        onClick={()=>
                                                                        {
                                                                            handleRepply(message);
                                                                        }}
                                                                    >Trả lời
                                                                    </Typography.Link>
                                                                    <Typography.Link color='red'>Thích</Typography.Link>
                                                                </div>
                                                        
                                                            </div>
                                                        );
                                                    })
                                                }
                                            </Col>
                                        )
                                    }
                                 
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
                                   
                                            <Avatar
                                                src={
                                                    avatar === ''
                                                        ? 'https://joeschmoe.io/api/v1/random'
                                                        : avatar
                                                }
                                            />
                                        </Col>
                                        <Col span={21}>
                                            <Form.Item name="assignTo">
                                                <Select
                                                    placeholder="Giao cho"
                                                    className="user_select"
                                                    allowClear
                                                    // onSelect={(val) => handleUpdate('assignTo', val)}
                                                    onSelect={(val) =>
                                                    {
                                                        const u = userList.find((user)=> user.id === val);
                                                        setAvatar(u?.avatarUrl ?? '');
                                                        handleUpdate('assignTo', val);
                                                    }}
                                                >
                                                    {userList &&
                        userList.length > 0 &&
                        userList.map((item) => (
                            <Select.Option
                                key={item.id.toString()}
                                value={item.id.toString()}
                            >
                                {item.fullName}
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
                                            <ProFormDateRangePicker
                                                name="dateRange"
                                                label="Deadline"
                                                className="no-border-select"
                                                fieldProps={{
                                                    format: 'DD/MM/YYYY',
                                                    onChange: (val) => handleUpdate('dateRange', val),
                                                }}
                                            />
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
                                        <Col
                                            span={24}
                                            style={{
                                                overflowY: hideActivities ? 'auto' : 'hidden',
                                                maxHeight: '32vh',
                                            }}
                                        >
                                            <Title level={5}>
                                                Lịch sử &nbsp;
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
                                            {
                                                !hideActivities && (
                                                    <div
                                                        style={{
                                                            overflowY: hideActivities ? 'auto' : 'scroll',
                                                            maxHeight: '32vh',
                                                        }}
                                                    >
                                                        {
                                                            logs.map((log) =>
                                                            {
                                                                const u = userList.find((u) =>u.id === log.userId);

                                                                if (log.field === 'assignTo')
                                                                {
                                                                    const u1 = userList.find((u) =>u.id === log.oldValue);
                                                                    const u2 = userList.find((u) =>u.id === log.newValue);
                                                                 
                                                                    return (
                                                                        <div key={log.id}>
                                                                            <b>{moment.unix(log.time.seconds).format('DD/MM/YYYY HH:mm')}</b> <b>{u?.fullName}</b> - {ACTION[log.action]} {LOGKEYS[log.field]} từ <b>{u1?.fullName}</b> sang <b>{u2?.fullName}</b>
                                                                        </div>
                                                                    );

                                                                }

                                                                if (log.field === 'parentId')
                                                                {
                                                                    const u1 = tasks.find((u) =>u.id === log.oldValue);
                                                                    const u2 = tasks.find((u) =>u.id === log.newValue);
                                                                 
                                                                    return (
                                                                        <div key={log.id}>
                                                                            <b>{moment.unix(log.time.seconds).format('DD/MM/YYYY HH:mm')}</b> <b>{u?.fullName}</b> - {ACTION[log.action]} {LOGKEYS[log.field]} từ <b>{u1?.title}</b> sang <b>{u2?.title}</b>
                                                                        </div>
                                                                    );

                                                                }

                                                                if (log.field === 'status')
                                                                {
                                                                    const u1 = STATUS_LIST.find((u:any) =>u.id === log.oldValue);
                                                                    const u2 = STATUS_LIST.find((u:any) =>u.id === log.newValue);
                                                                 
                                                                    return (
                                                                        <div key={log.id}>
                                                                            <b>{moment.unix(log.time.seconds).format('DD/MM/YYYY HH:mm')}</b> <b>{u?.fullName}</b> - {ACTION[log.action]} {LOGKEYS[log.field]} từ <b>{u1?.title}</b> sang <b>{u2?.title}</b>
                                                                        </div>
                                                                    );

                                                                }

                                                                if (log.field === 'priority')
                                                                {
                                                                    const u1 = PRIORITY_LIST.find((u:any) =>u.id.toString() === log.oldValue.toString());
                                                                    const u2 = PRIORITY_LIST.find((u:any) =>u.id.toString() === log.newValue.toString());
                                                                 
                                                                    return (
                                                                        <div key={log.id}>
                                                                            <b>{moment.unix(log.time.seconds).format('DD/MM/YYYY HH:mm')}</b> <b>{u?.fullName}</b> - {ACTION[log.action]} {LOGKEYS[log.field]} từ <b>{u1?.title}</b> sang <b>{u2?.title}</b>
                                                                        </div>
                                                                    );

                                                                }

                                                                return <div key={log.id}><b>{moment.unix(log.time.seconds).format('DD/MM/YYYY HH:mm')}</b> <b>{u?.fullName}</b> - {ACTION[log.action]} {LOGKEYS[log.field]} từ <b>{log.oldValue}</b> sang <b>{log.newValue}</b></div>;
                                                            })
                                                        }
                                                    </div>
                                                )
                                            }
                                        </Col>
                                    </Row>
                                </Skeleton>
                            </div>
                        </div>
                    </div>
                </div>
            </Form>
        </Modal>
    );
};
