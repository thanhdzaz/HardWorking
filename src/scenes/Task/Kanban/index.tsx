import { Button } from 'antd';
import { KanbanBoard } from 'components/Kanban/Board';
import { data } from 'components/Kanban/data';
import { observer } from 'mobx-react';
import { useState } from 'react';
import { CreateIssuePage } from '../component/CreateTask';
import '../index.less';


const KB = observer((_):JSX.Element=>
{
  
    const [visible,setVisible] = useState(false);

    return (
        <div>
            <Button
                onClick={()=>
                {
                    setVisible(!visible);
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
                onCardMoveAcrossLanes={()=>
                {
                    console.log('move');
                    
                }}
                onLaneDelete={()=>
                {
                    //
                }}
                onLaneUpdate={()=>
                {
                    //
                }}
                onCardClick={()=>
                {
                    //
                }}
            />
            {
                visible && (
                  
                    <CreateIssuePage
                        pageMode='modal'
                        onCancel={()=>
                        {
                            setVisible(false);
                        }}
                    />
                )
            }
        </div>
    );
});

export default KB;
