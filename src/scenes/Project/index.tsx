import { SettingOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { Button, Card, Dropdown, Menu } from 'antd';
import { getStore } from 'firebase';
import { collection, getDocs } from 'firebase/firestore/lite';
import { ProjectDto } from 'models/Task/dto';
import { useEffect, useState } from 'react';
import { CreateOrUpdateProject } from './components/createOrUpdate';

const ProjectManagement = (): JSX.Element =>
{
    const [projectData, setProjectData] = useState<ProjectDto[]>([]);
    const projectCollection = collection(getStore(),'project');

    const columns = [
        {
            title: 'STT',
            dataIndex: 'id',
            align: 'center',
            width: 55,
            key: 'index',
            render: (_, item) => projectData.indexOf(item) + 1,
        },
        {
            title: <SettingOutlined />,
            align: 'center',
            width: 55,
            dataIndex: 'id',
            render: (_, record) =>
            {
                return (
                    <Dropdown
                        overlay={(
                            <Menu>
                                <Menu.Item>
                                    <CreateOrUpdateProject
                                        getProject={getProject}
                                        act="update"
                                        record={record}
                                    />
                                </Menu.Item>
                            </Menu>
                        )}
                        trigger={['click']}
                    >
                        <Button
                            type="primary"
                            icon={<SettingOutlined />}
                        />
                    </Dropdown>
                );
            },
        },
        {
            title: 'Tên dự án',
            align: 'center',
            dataIndex: 'title',
            key: 'name',
        },
        {
            title: 'Mô tả',
            align: 'center',
            dataIndex: 'description',
            key: 'description',
        },
    ];
    const getProject = async () =>
    {
        const project = await getDocs(projectCollection);
        const projectList:ProjectDto[] = project.docs.map(doc => ({ ...doc.data(),id: doc.id }) as ProjectDto);
        setProjectData(projectList);
        return projectList;
    };

    const onSearch = (keyword: string):boolean =>
    {

        getProject().then(data =>
        {
            const cloneProjectData = [...data];
            const resultSearch = cloneProjectData.filter(i => i.title.toLowerCase().includes(keyword.toLowerCase()));
            setProjectData(resultSearch);
        });
        return true;
    };

    useEffect(() =>
    {
        getProject();
    }, []);

    return (
        <Card>
            <ProTable
                rowSelection={{
               
                }}
                rowKey="id"
                columns={columns as any}
                headerTitle={(
                    <div>
                        <CreateOrUpdateProject
                            getProject={getProject}
                            act="create"
                        />
                    </div>
                )}
                search={false}
                toolbar={undefined}
                pagination={{
                    pageSize: 10,
                    showTotal: (total, range) =>
                        `${range[0]} - ${range[1]} trên ${total} dự án`,
                }}
                options={{
                    search: {
                        onSearch: onSearch,
                    },
                }}
                locale={{
                    emptyText: (<div>Trống</div>),
                    selectAll: 'Chọn tất cả',
                }}
                dataSource={projectData}
            />
        </Card>

    );
};

export default ProjectManagement;
