import { KanbanBoard } from 'components/Kanban/Board';
import { data } from 'components/Kanban/data';
import { observer } from 'mobx-react';


const KB = observer((_):JSX.Element=>
{
  

    return (
        <div>
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
        </div>
    );
});

export default KB;
