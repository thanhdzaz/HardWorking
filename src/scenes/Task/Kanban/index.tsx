/* eslint-disable no-alert */
import { Button } from 'antd';
import { KanbanBoard } from 'components/Kanban/Board';
import { STATUS_LIST } from 'constant';
import { firestore } from 'firebase';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { taskAtom } from 'stores/atom/task';
import { CreateIssuePage } from '../component/CreateTask';
import { IssueDetail } from '../component/IssueDetails';
import '../index.less';


const KB = observer((_):JSX.Element=>
{
  
    const [visibleIssuePopupDetail, setVisibleIssuePopupDetail] = useState(false);
    const [visibleIssueCreate, setVisibleIssueCreate] = useState(false);
    const [curentId,setId] = useState('');

    const [task,setTask] = useRecoilState(taskAtom);

    const [data,setData] = useState({
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
    const getAll = async() =>
    {
        await firestore.get('Tasks').then(setTask);
    };

    const togglePopupDetail = () => setVisibleIssuePopupDetail(!visibleIssuePopupDetail);
    const togglePopupCreate = () => setVisibleIssueCreate(!visibleIssueCreate);

    useEffect(() =>
    {
        getAll();

    },[]);

    useEffect(() =>
    {
        console.log(task);
        
        setData(() => ({
            lanes: [...STATUS_LIST]
                .sort((a, b) => a.id - b.id)
                .map((pj) => ({
                    ...pj,
                    style: {
                        width: 335,
                    },
                    cards: task.filter((item) => item?.status === pj.id)
                        .map((item) => ({
                            ...item,
                            laneId: pj.id,
                            handleShowPopUp: ()=>
                            {
                                setId(item.id);
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
        }) as any);
    },[task]);

    return (
        <div>
            <Button
                onClick={()=>
                {
                    togglePopupCreate();
                }}
            >Thêm mới
            </Button>
            <KanbanBoard
                data={data}
                projectStatus={[]}
                handleLaneDragEnd={(_)=>
                {
                    console.log(_);
                    
                }}
                // handleShowPopUp={toggleUpdateModal}
                onCardAdd={()=>true}
                onLaneAdd={(onLaneAdd)=>
                {
                    console.log(onLaneAdd);
                    
                }}
                onCardMoveAcrossLanes={(_o,n,id)=>
                {
                    firestore.update('Tasks',id,{
                        status: n,
                    });
                    
                }}
                onCardClick={(id)=>
                {
                    // console.log(hi);
                    
                    setId(id);
                    togglePopupDetail();
                }}
            />
            {
                visibleIssueCreate && (
                  
                    <CreateIssuePage
                        pageMode='modal'
                        reloadAndClose={()=>
                        {
                            getAll();
                            togglePopupCreate();
                        }}
                    />
                )
            }

            {
                visibleIssuePopupDetail && (
                    <IssueDetail
                        pageMode='modal'
                        id={curentId}
                        reloadAndClose={()=>
                        {
                            getAll();
                            togglePopupDetail();
                        }}
                    />
                )
            }
        </div>
    );
});

export default KB;
