/* eslint-disable indent */
import { SettingOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { Button, Card, Dropdown, Menu, Progress, Select, Tooltip } from 'antd';
import Notify from 'components/Notify';
import { PRIORITY_LIST, STATUS_LIST } from 'constant';
import { firestore } from 'firebase';
import { getDocs, query, where } from 'firebase/firestore/lite';
import { isGranted } from 'lib/abpUtility';
import { TaskDto } from 'models/Task/dto';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { permissionsAtom } from 'stores/atom/permission';
import { taskAtom } from 'stores/atom/task';
import HeaderFilter from '../component/HeaderFilter';
import { IssueDetail } from '../component/IssueDetails';
import '../index.less';

const ListView: React.FunctionComponent<any> = (): JSX.Element =>
{
  const [visibleIssuePopupDetail, setVisibleIssuePopupDetail] = useState(false);
  const [tasks, setTasks] = useState<any>([]);
  const [filteredTasks, setFilteredTasks] = useState<any>([]);
  const [users, setUsers] = useState<any>([]);
  const [taskId, setTaskId] = useState<string>();
  const permissionList = useRecoilValue(permissionsAtom);
  const taskLocalList = useRecoilValue(taskAtom);


  const handleDeleteIssue = (id: string) =>
{
    const taskFiltered = taskLocalList.filter((task) => task?.parentId?.toString() === id.toString());
    if (taskFiltered.length === 0)
{
      firestore.delete('Tasks', id).then(() =>
{
        getTasks();
      });
    }
else
{
      Notify('error',`Công việc này đang có ${taskFiltered.length} công việc con, không thể xóa!!`);
    }
  };

  const columns: any = [
    {
      align: 'center',
      fixed: 'left',
      title: 'STT',
      dataIndex: 'title',
      width: 55,
      render: (_, _item) =>
        tasks.indexOf(_item) + 1 === 0 ? '' : tasks.indexOf(_item) + 1,
    },
    {
      title: <SettingOutlined />,
      fixed: 'left',
      dataIndex: 'id',
      width: 55,
      align: 'center',
      render: (id) => (
        <Dropdown
            overlay={(
            <Menu
                style={{
                borderRadius: 7,
              }}
            >
              <Menu.Item
                  key="2"
                  onClick={() =>
{
                  setTaskId(id);
                  togglePopupDetail();
                }}
              >
                Sửa
              </Menu.Item>
              {
                isGranted('TASK_DELETE', permissionList) && (
                  <Menu.Item
                      key="1"
                      onClick={() => handleDeleteIssue(id)}
                  >
                    Xóa
                  </Menu.Item>
                )}
            </Menu>
          )}
            className="user-drop-down"
            trigger={['click']}
        >
          <Button
              icon={<SettingOutlined />}
              type="primary"
          />
        </Dropdown>
      ),
    },
    {
      title: 'Tên nhiệm vụ',
      dataIndex: 'title',
      width: 300,
      fixed: 'left',
      ellipsis: {
        showTitle: false,
      },
      render: (txt) => (
        <Tooltip title={txt}>
          {txt.length > 125 ? `${txt.substring(0, 125)}...` : txt}
        </Tooltip>
      ),
    },
    {
      align: 'center',
      title: 'Tiến độ',
      dataIndex: 'progress',
      render: (progress) =>
{
        const per = progress ?? 0;
        return (
          <div
              style={{
              width: '100%',
              paddingRight: 15,
            }}
          >
            <Progress
                percent={per}
                className="issue_process_bar"
                strokeColor={
                per > 75
                  ? '#00F044'
                  : per <= 75
                    ? '#F58632'
                    : per <= 25
                      ? '#E5493A'
                      : 'grey'
              }
                strokeLinecap="butt"
                status="active"
            />
          </div>
        );
      },
      width: 250,
    },
    {
      align: 'center',
      title: 'Người thực hiện',
      dataIndex: 'assignTo',
      render: (txt) =>
{
        const user = users?.find((u) => u.id === txt);
        if (user)
{
          return `${user.fullName}`;
        }
        return txt === '-' ? 'Chưa có' : txt;
      },
    },
    {
      align: 'center',
      title: 'Người giao',
      dataIndex: 'assigned_by',
      render: (txt) =>
{
        const user = users?.find((u) => u.id === txt);
        if (user)
{
          return `${user.fullName}`;
        }
        return txt === '-' ? 'Chưa có' : txt;
      },
    },
    {
      align: 'center',
      title: 'Độ ưu tiên',
      dataIndex: 'priority',
      render: (txt) =>
{
        const pri = PRIORITY_LIST.find(pr => pr.id === txt);
        return (
          <span
              style={{
              backgroundColor: pri?.color,
              borderRadius: 30,
              display: 'inline-block',
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 2,
              paddingBottom: 2,
              color: 'white',
            }}
          >
            {pri?.title ?? txt}
          </span>
        );
      },
    },
    {
      align: 'center',
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (txt, item: any) => (
        <Select
            key={item.id}
            className="no-border-select"
            value={txt}
            style={{ width: '100%' }}
            onChange={(val) => handleChangeStatus(val, item.id)}
        >
          {STATUS_LIST.map(st => (
            <Select.Option
                key={st.id}
                value={st.id}
            >
              {st.title}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      align: 'center',
      title: 'Ngày bắt đầu',
      dataIndex: 'startTime',
    },
    {
      align: 'center',
      title: 'Ngày kết thúc',
      dataIndex: 'endTime',
    },
  ];

  const togglePopupDetail = () =>
    setVisibleIssuePopupDetail(!visibleIssuePopupDetail);

  const getTasks = async () =>
{
    const q = query(
      firestore.collection('Tasks'),
      where('projectId', '==', localStorage.getItem('project')),
    );
    const querySnapshot = await getDocs(q);
    const t: TaskDto[] = [];
    querySnapshot.forEach((doc) =>
{
      t.push(doc.data() as any);
    });

    setTasks(t);
  };

  const getUsers = async () =>
{
    const users = await firestore.get('Users');
    setUsers(users);
  };

  function handleChangeStatus(val, id)
{
    const data = {
      status: val,
    };
    firestore.update('Tasks', id, data).then(() =>
{
      Notify('success', 'Cập nhật trạng thái thành công');
      getTasks();
    });

  }

  useEffect(() =>
{
    getUsers();
  }, []);

  return (
    <>
      <div className="calendar">
        <div className="calendar__header">
          <div className="calendar__content">
            <div className="calendar__content-left" />
            <div className="calendar__content-right">
              <HeaderFilter
                  getTasks={getTasks}
                  tasks={tasks}
                  renderData={setFilteredTasks}
              />
            </div>
          </div>
        </div>
      </div>
      <Card>
        <ProTable
            dataSource={filteredTasks}
            columns={columns}
            className="list-issuetable"
            toolBarRender={false}
            scroll={{ y: '60vh', x: 1800 }}
            expandable={{
            expandIconColumnIndex: 2,
            childrenColumnName: 'children',
            showExpandColumn: true,
            rowExpandable: (record) => record.children.length > 0,
          }}
            pagination={{
            pageSize: 50,
            showTotal: (total, range) =>
              `${range[0]} - ${range[1]} nhiệm vụ ${total} nhiệm vụ`,
          }}
            search={false}
            rowKey={(record) => record.id}
            size="small"
            bordered
        />
      </Card>
      {visibleIssuePopupDetail && (
        <IssueDetail
            pageMode="modal"
            id={taskId}
            tasks={tasks}
            reloadAndClose={() =>
{
            getTasks();
            togglePopupDetail();
          }}
        />
      )}
    </>
  );
};

export default ListView;
