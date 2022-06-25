import { Card, Col, Form, FormInstance, Input, Modal, Row, Table } from 'antd';
import Header from 'components/HeaderTool';
import { getStore } from 'firebase';
import { addDoc, collection, doc, getDocs, updateDoc } from 'firebase/firestore/lite';
import { L } from 'lib/abpUtility';
import { ProjectDto } from 'models/Task/dto';
import React, { useEffect, useState } from 'react';
import rules from './index.validation';

const ProjectManagement = (): JSX.Element =>
{
    const [projectData, setProjectData] = useState<ProjectDto[]>([]);
    const [visible, setVisible] = useState(false);
    const formRef = React.createRef<FormInstance>();
    const projectCollection = collection(getStore(),'project');

    const columns = [
        {
            title: 'STT',
            dataIndex: 'id',
            key: 'index',
            render: (_, item) => projectData.indexOf(item) + 1,
        },
        {
            title: 'Tên dự án',
            dataIndex: 'title',
            key: 'name',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
    ];
    const getProject = async () =>
    {
        const project = await getDocs(projectCollection);
        const projectList:ProjectDto[] = project.docs.map(doc => doc.data() as ProjectDto);
        setProjectData(projectList);
    };

    const toggleModal = () =>
    {
        setVisible(!visible);
    };

    const handleSubmit = () =>
    {
        formRef.current?.validateFields().then(async (values) =>
        {
            const docRef = await addDoc(projectCollection, values);
            const itemRef = doc(getStore(), 'project', docRef.id);
            await updateDoc(itemRef, {
                id: docRef.id,
            }).then(() =>
            {
                toggleModal();
                getProject();
                formRef.current?.resetFields();
            }).catch();
        });
    };

    useEffect(() =>
    {
        getProject();
    }, []);

    return (
        <Card>
            <Header Click2={toggleModal} />
            <Table
                style={{ marginTop: 10 }}
                size='small'
                dataSource={projectData}
                columns={columns}
            />
            <Modal
                title={'Thêm dự án'}
                cancelButtonProps={{ style: { display: 'none ' } }}
                okText={'Thêm'}
                visible={visible}
                onOk={handleSubmit}
                onCancel={toggleModal}
            >
                <Form
                    ref={formRef}
                    className=""
                >
                    <Row
                        style={{ marginTop: 10 }}
                    >
                        <Col
                            span={24}
                        >
                            <Form.Item
                                name="title"
                                rules={rules.title}
                                label="Tên dự án"
                            >
                                <Input
                                    placeholder={L('Vui lòng nhập')}
                                    size="large"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row
                        style={{ marginTop: 10 }}
                    >
                        <Col
                            span={24}
                        >
                            <Form.Item
                                name="description"
                                label="Mô tả dự án"
                            >
                                <Input
                                    placeholder={L('Vui lòng nhập')}
                                    size="large"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </Card>
    );
};

export default ProjectManagement;
