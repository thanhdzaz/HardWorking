import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import ProTable from '@ant-design/pro-table';
import { Button, Space, Table, Tabs } from 'antd';
import Notify from 'components/Notify';
import { firestore } from 'firebase';
import { ProjectDto } from 'models/Task/dto';
import React, { useEffect, useRef, useState } from 'react';
import '../index.less';

type propType = {
  act: string;
  record?: ProjectDto;
  getProject: any;
};

type rowData = {
  index: number;
  fullName: string;
  email: string;
  id: number;
};

export const CreateOrUpdateProject: React.FC<propType> = ({
    act,
    record,
    getProject,
}) =>
{
    const [selectedUserProject, setSelectedsUserProject] = useState<any>([]);
    const [selectedUserId, setSelectedUserId] = useState<React.Key[]>([]);
    const [isSave, setIsSave] = useState<boolean>(true);
    const [projectId, setProjectId] = useState<String>();
    const [allUserOfProject, setAllUserOfProject] = useState<any>([]);
    const [viewType, setViewType] = useState('info');
    const tableRef = useRef();
    const formRef = useRef<any>();
    const columns = [
        {
            title: 'STT',
            align: 'center',
            width: 55,
            key: 'index',
            render: (_, record) => allUserOfProject.indexOf(record) + 1,
        },
        {
            title: 'Họ và tên',
            align: 'center',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Email',
            align: 'center',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'id',
            align: 'center',
            dataIndex: 'id',
            key: 'id',
            hideInSearch: true,
            hideInTable: true,
        },
    ];

    const getUsers = async () =>
    {
        const users = await firestore.get('Users');
        if (act === 'update')
        {
            const dataUserProject = await firestore.get('UsersProject');
            const userProjects = dataUserProject
                .filter((i) => i.projectId === (record?.id ?? projectId))
                .map((i) => ({ userId: i.userId, id: i.id }));
            setSelectedsUserProject(userProjects);
        }
        const data = users.filter(us => us.role !== 'ADMIN');
        setAllUserOfProject(data);
        return data;
    };

    const handleSaveMebember = async () =>
    {
        const orginalSelectedUserIds = selectedUserProject.map(e => e.userId);
        const addUserIds = selectedUserId.filter(id => !orginalSelectedUserIds.includes(id));
        const deletedUserIds = orginalSelectedUserIds.filter(id => !selectedUserId.includes(id));
        const deletedUserProjectIds = selectedUserProject.filter(usProject => deletedUserIds.includes(usProject.userId)).map(i => i.id);

        let count = 0;
        addUserIds.forEach(id =>
        {
            firestore.add('UsersProject', { userId: id, projectId: projectId }).then((rs) =>
            {
                rs.id && count++;
            });
        });

        deletedUserProjectIds.forEach(id =>
        {
            firestore.delete('UsersProject', id).then((rs) =>
            {
                rs && count++;
            });
        });
        getUsers();
        setIsSave(true);
        Notify('success', 'Lưu thành công');
    };

    const handleSubmitProjectInfo = async () =>
    {
        const val = formRef?.current?.getFieldsValue();
        if (act === 'create')
        {
            await firestore.add('project', val).then((rs) =>
            {
                rs.id && Notify('success', 'Thêm mới thành công');
                getProject();
                setProjectId(rs.id);
            });
            setViewType('member');
            return Promise.resolve(false);
        }
        else
        {
            await firestore.update('project', record?.id as any, val).then(() =>
            {
                Notify('success', 'Cập nhật thành công');
                getProject();
                setProjectId(record?.id);
            });
            return Promise.resolve(false);
        }
    };

    const onSearch = (keyword: string):boolean =>
    {

        getUsers().then(data =>
        {
            const resultSearch = data.filter(i => i.fullName.toLowerCase().includes(keyword.toLowerCase()));
            setAllUserOfProject(resultSearch);
        });
        return true;
    };

    useEffect(() =>
    {
        if (projectId)
        {
            getUsers();
        }
    }, [projectId]);

    useEffect(() =>
    {
        if (record?.id)
        {
            setProjectId(record?.id);
        }
    }, [record?.id]);

    useEffect(() =>
    {
        if (selectedUserProject.length)
        {
            const selectedUserId = selectedUserProject.map((i) => i.userId);
            setSelectedUserId(selectedUserId);
        }
    }, [selectedUserProject]);

    return (
        <ModalForm
            modalProps={{
                okText: 'Thêm',
                cancelText: 'Đóng',
                destroyOnClose: true,
            }}
            className="modal-container"
            formRef={formRef}
            submitter={{
                render: false,
            }}
            initialValues={record ?? { title: '', description: '', id: '' }}
            title={act === 'create' ? 'Thêm dự án' : 'Sửa thông tin dự án'}
            trigger={
                act === 'create'
                    ? (
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() =>
                                {
                                    setViewType('info');
                                    setProjectId('');
                                }}
                            >
                                Thêm mới
                            </Button>
                        )
                    : (
                            <div onClick={() =>
                            {
                                const originalSelectedUserId = selectedUserProject.map(i => i.userId);
                                setSelectedUserId(originalSelectedUserId);
                                setViewType('info');
                                setIsSave(true);
                            }}
                            >Sửa
                            </div>
                        )
            }
        >
            <Tabs
                activeKey={viewType}
                onChange={(key) =>
                {
                    if (act === 'update')
                    {
                        setViewType(key);
                    }
                }}
            >
                <Tabs.TabPane
                    key="info"
                    tab="Thông tin"
                >
                    <ProFormText
                        label="Tên dự án"
                        fieldProps={{
                            type: 'email',
                        }}
                        name={'title'}
                        placeholder={'Vui lòng điền tên dự án'}
                    />

                    <ProFormText
                        label="Mô tả"
                        name={'description'}
                        placeholder={'Vui lòng nhập mô tả'}
                    />
                    <Button
                        type="primary"
                        size="large"
                        block
                        onClick={handleSubmitProjectInfo}
                    >Lưu
                    </Button>

                </Tabs.TabPane>
                {(projectId || record?.id) && (
                    <Tabs.TabPane
                        key="member"
                        tab="Thành viên"
                    >
                        <ProTable
                            actionRef={tableRef}
                            className="member-table"
                            columns={columns as any}
                            rowSelection={{
                                selections: [Table.SELECTION_ALL],
                                onSelect: (row: rowData, isAdd: boolean) =>
                                {
                                    const cloneSelectedUserId = [...selectedUserId];
                                    if (isAdd)
                                    {
                                        cloneSelectedUserId.push(row.id);
                                        setSelectedUserId([...cloneSelectedUserId]);
                                    }
                                    else
                                    {
                                        const userId = row.id;
                                        const index = cloneSelectedUserId.indexOf(userId);
                                        cloneSelectedUserId.splice(index, 1);
                                        setSelectedUserId(cloneSelectedUserId);
                                    }
                                    const originalSelectedUserIds = selectedUserProject.map(i => i.userId);
                                    const isDifference = originalSelectedUserIds.sort().toString() !== cloneSelectedUserId.sort().toString();
                                    isDifference ? setIsSave(false) : setIsSave(true);
                                },
                                onSelectAll: (
                                    isSelected: boolean,
                                    rows: rowData[],
                                    manipulateRows: Array<any>,
                                ) =>
                                {
                                    let newSelectedUserIds;
                                    const userIds = manipulateRows.map((i) => i.id);
                                    if (isSelected)
                                    {
                                        newSelectedUserIds = [
                                            ...userIds,
                                            ...selectedUserId,
                                        ].filter(
                                            (value, index, self) =>
                                                index ===
                                    self.indexOf(value),
                                        );
                                    }
                                    else
                                    {
                                        newSelectedUserIds = selectedUserId.filter(i => !userIds.includes(i));
                                    }
                                    setSelectedUserId(newSelectedUserIds);
                                    const originalSelectedUserIds = selectedUserProject.map(i => i.userId);
                                    const isDifference = originalSelectedUserIds.sort().toString() !== newSelectedUserIds.sort().toString();
                                    isDifference ? setIsSave(false) : setIsSave(true);
                                },
                                selectedRowKeys: selectedUserId,
                            }}
                            tableAlertRender={() => (
                                <Space size={24}>
                  Đã chọn:{' '}
                                    <span style={{ color: '#1890FF' }}>
                                        {selectedUserProject.length ?? 0}
                                    </span>{' '}
                  thành viên
                                </Space>
                            )}
                            pagination={{
                                pageSize: 10,
                                showTotal: (total, range) =>
                                    `${range[0]} - ${range[1]} trên ${total} thành viên`,
                            }}
                            search={false}
                            options={{
                                search: {
                                    onSearch: onSearch,
                                },
                            }}
                            dataSource={allUserOfProject}
                            rowKey={(e: any) => e.id}
                            headerTitle={<div style={{ fontSize: 18, fontWeight: 600 }}>Thành viên thuộc dự án</div>}
                        />
                        <Button
                            disabled={isSave}
                            size="large"
                            type="primary"
                            block
                            onClick={handleSaveMebember}
                        >Lưu
                        </Button>
                    </Tabs.TabPane>
                )}
            </Tabs>
        </ModalForm>
    );
};
