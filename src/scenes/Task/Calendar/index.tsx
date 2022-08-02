import { Calendar, Popover } from 'antd';
import { PRIORITY_LIST } from 'constant';
import { firestore } from 'firebase';
import { getDocs, query, where } from 'firebase/firestore/lite';
import { TaskDto } from 'models/Task/dto';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import HeaderFilter from '../component/HeaderFilter';
import { IssueDetail } from '../component/IssueDetails';
import '../index.less';

const IssueCalendar = (): JSX.Element =>
{
    const [tasks, setTasks] = useState<TaskDto[]>([]);
    const [filterdTasks, setFilterdTasks] = useState<TaskDto[]>([]);
    const [visibleIssuePopupDetail, setVisibleIssuePopupDetail] = useState(false);
    const [taskId, setTaskId] = useState<string>();

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

    const dateCellRender = useCallback(
        (dateMoment) =>
        {
            const tasksOfCell = filterdTasks.filter(
                (t) =>
                    moment(t.startTime, 'DD-MM-YYYY').isSameOrBefore(dateMoment, 'day') &&
          moment(t.endTime, 'DD-MM-YYYY').isSameOrAfter(dateMoment, 'day'),
            );
            return (
                <Popover
                    placement="right"
                    className="popover-calendar"
                    content={(
                        <div className="calendar__cell-wrapper">
                            {tasksOfCell.map((t, index) => (
                                <div
                                    key={t.id}
                                    style={{
                                        color: PRIORITY_LIST.find((pr) => (pr.id === t.priority))
                                            ?.color,
                                        cursor: 'pointer',
                                    }}
                                    onClick={() =>
                                    {
                                        setTaskId(t.id);
                                        togglePopupDetail();
                                    }}
                                >
                                    {index + 1}. {t.title}
                                </div>
                            ))}
                        </div>
                    )}
                    trigger="hover"
                >
                    <div className="calendar__cell-wrapper">
                        {tasksOfCell.length ? `${tasksOfCell.length} công việc` : ''}
                    </div>
                </Popover>
            );
        },
        [filterdTasks],
    );

    useEffect(() =>
    {
        setFilterdTasks(tasks);
    }, [tasks]);

    return (
        <>
            <div className="calendar">
                <div className="calendar__header">
                    <div className="calendar__content">
                        <div className="calendar__content-left" />
                        <div className="calendar__content-right">
                            <HeaderFilter
                                showChild={false}
                                getTasks={getTasks}
                                tasks={tasks}
                                renderData={setFilterdTasks}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="issue-calendar-container">
                <Calendar dateCellRender={dateCellRender} />
            </div>
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

export default IssueCalendar;
