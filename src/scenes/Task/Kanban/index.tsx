/* eslint-disable no-alert */
import { Button } from 'antd';
import { KanbanBoard } from 'components/Kanban/Board';
import { STATUS_LIST } from 'constant';
import { firestore } from 'firebase';
import { getDocs, query, where } from 'firebase/firestore/lite';
import { checkLog } from 'hook/useCheckLog';
import { observer } from 'mobx-react';
import { TaskDto } from 'models/Task/dto';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { taskAtom } from 'stores/atom/task';
import { CreateIssuePage } from '../component/CreateTask';
import HeaderFilter from '../component/HeaderFilter';
import { IssueDetail } from '../component/IssueDetails';
import '../index.less';

const KB = observer((_): JSX.Element =>
{
    const [visibleIssuePopupDetail, setVisibleIssuePopupDetail] = useState(false);
    const [visibleIssueCreate, setVisibleIssueCreate] = useState(false);
    const [curentId, setId] = useState('');

    const [task, setTask] = useRecoilState <TaskDto[]>(taskAtom);


    const [filteredTasks, setFilteredTasks] = useState<TaskDto[]>([]);

    const [data, setData] = useState({
        lanes: [
            {
                id: 'WIP',
                color: '#DD241D',
                title: 'Đang thực hiện',
                style: {
                    width: 335,
                },
                cards: [
                    {
                        id: 'Wip111',
                        title: 'Clean House',
                        label: '30 mins',
                        description:
              'Soap wash and polish floor. Polish windows and doors. Scrap all broken glasses',
                    },
                ],
            },
        ],
    });


    const getAll = async () =>
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

        setTask(t);
    };

    const togglePopupDetail = () =>
        setVisibleIssuePopupDetail(!visibleIssuePopupDetail);
    const togglePopupCreate = () => setVisibleIssueCreate(!visibleIssueCreate);

    // useEffect(() =>
    // {
    //     getAll();
    // }, []);

    useEffect(() =>
    {
        setData(
            () =>
                ({
                    lanes: [...STATUS_LIST]
                        .sort((a, b) => a.id - b.id)
                        .map((pj) => ({
                            ...pj,
                            style: {
                                width: 335,
                            },
                            cards: filteredTasks
                                .filter((item) => item?.status === pj.id)
                                .map((item) => ({
                                    ...item,
                                    laneId: pj.id,
                                    handleShowPopUp: (id) =>
                                    {
                                        setId(id);
                                        togglePopupDetail();
                                    },
                                    // permissions.DW__WORK__VIEW
                                    //     ? toggleUpdateModal
                                    //     : () =>
                                    //             notification.error({
                                    //                 description: i18n._(t`Bạn không có quyền xem công việc!`),
                                    //                 message: i18n._(t`Lỗi`),
                                    //             }),
                                })),
                        })),
                } as any),
        );
    }, [filteredTasks]);

    return (
        <div>
            <div className="calendar">
                <div className="calendar__header">
                    <div className="calendar__content">
                        <div className="calendar__content-left">
                            <Button
                                onClick={() =>
                                {
                                    togglePopupCreate();
                                }}
                            >
        Thêm mới
                            </Button>
                        </div>
                        <div className="calendar__content-right">
                            <HeaderFilter
                                showChild={false}
                                showStatusFilter={false}
                                getTasks={getAll}
                                tasks={task}
                                renderData={setFilteredTasks}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <KanbanBoard
                data={data}
                projectStatus={[]}
                handleLaneDragEnd={(_) =>
                {
                    console.log(_);
                }}
                // handleShowPopUp={toggleUpdateModal}
                onCardAdd={() => true}
                onLaneAdd={(onLaneAdd) =>
                {
                    console.log(onLaneAdd);
                }}
                onCardMoveAcrossLanes={(o, n, id) =>
                {
                    firestore
                        .update('Tasks', id, {
                            status: n,
                        })
                        .then(() =>
                        {
                            checkLog({
                                taskId: id,
                                action: 'update',
                                field: 'status',
                                newValue: n,
                                oldValue: o,
                            });
                        });
                }}
                onCardClick={(id) =>
                {
                    // console.log(hi);

                    setId(id);
                    togglePopupDetail();
                }}
            />
            {visibleIssueCreate && (
                <CreateIssuePage
                    pageMode="modal"
                    reloadAndClose={() =>
                    {
                        getAll();
                        togglePopupCreate();
                    }}
                />
            )}
            {visibleIssuePopupDetail && (
                <IssueDetail
                    pageMode="modal"
                    tasks={task}
                    id={curentId}
                    reloadAndClose={() =>
                    {
                        getAll();
                        togglePopupDetail();
                    }}
                />
            )}
        </div>
    );
});

export default KB;
