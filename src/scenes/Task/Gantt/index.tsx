import { firestore } from 'firebase';
import { getDocs, query, where } from 'firebase/firestore/lite';
import { TaskDto } from 'models/Task/dto';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { taskAtom } from 'stores/atom/task';
import { getDate } from 'utils';
import GanttTemplate from './Gantt';
import Toolbar from './ToolBar';


// interface IData { id?: number, text?: string, start_date?: Date, duration?: number, progress?: number, type?: string }
// interface ILink { id?: number, source?: string, target?: string, type?: string }

const Gantt = ():JSX.Element =>
{
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        data: [
            // { id: "number", text: "string", start_date: new Date(), progress: 20, type: "project" },
            // { id: "number2", text: "string", start_date: new Date(), duration: 4, progress: 20, type: "task", parent: "number" },
            // { id: "number3", text: "string", start_date: new Date(), duration: 8, progress: 20, type: "task", parent: "number" }
        ],
        links: [],
    });
    const [issue,setIssue] = useRecoilState(taskAtom);

    const getAll = async () =>
    {
        setLoading(true);
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

        setIssue(t);
        setLoading(false);
    };

    
    const getType = (id:string):string =>
    {
        const children = issue.filter(doc => doc.parentId === id);
        if (children.length > 0)
        {
            return 'project';
        }
        return 'task';
    };
    
    useEffect(() =>
    {
        setLoading(true);
        setData(():any =>
        {
            const d = [...issue].map((i) => ({ ...i, start_date: getDate(i.startTime as any), duration: moment(getDate(i.endTime as any)).diff(moment(getDate(i.startTime as any)), 'days'), text: i.title, type: getType(i.id), ...i.parentId ? { parent: i.parentId } : {} }));
            return {
                data: d,
                links: [],
            };
        });
        setTimeout(() =>
        {
            setLoading(false);
        }, 200);
    }, [issue]);

    useEffect(() =>
    {
        getAll();
    },[]);

    const [currentZoom, setZoom] = useState('Days');
    

    if (loading)
    {
        return null as any;
    }

  
    return (
        <div
            className="content"
            style={{
                padding: 5,
            }}
        >
            <Toolbar
                zoom={currentZoom}
                onZoomChange={setZoom}
            />

            <div className="gantt-container">
                <GanttTemplate
                    tasks={data ?? {
                        data: [],
                        links: [],
                    }}
                    zoom={currentZoom}
                    onDataUpdated={(entityType, _action, item, _id) =>
                    {
                        if (entityType === 'link')
                        {
                            switch (item['!nativeeditor_status'])
                            {
                                case 'deleted':
                                    // this.onDelete(id);
                                    break;
                                case 'inserted':
                                    // this.handleCreateLink(item);

                                    break;
                                default: break;
                            }

                        }


                    }}
                    onUpdateOpen={(_id) =>
                    {
                        // props.toggleUpdateModal && props.toggleUpdateModal(id);
                    }
                    }
                />
            </div>
        </div>
    );
};

export default Gantt;
