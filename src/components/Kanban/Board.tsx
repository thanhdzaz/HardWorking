import Board from 'components/Kanban/Trello';
import * as React from 'react';

import { Card } from './Card';
import './index.less';
import { CustomLaneHeader as LaneHeader } from './LandHeader';

const handleDragStart = (cardId, laneId) =>
{
    console.log(
        `drag started:
      cardId: ${cardId},
      lane: ${laneId}`,
    );
};

const shouldReceiveNewData = (nextData) =>
{
    console.log('data has changed', nextData);
};

function AddCardLink({ onClick })
{
    return (
        <div
            style={{
                textAlign: 'center',
                border: '1px dashed #1890FF',
                borderRadius: 10,
                filter: 'drop-shadow(0px 1px 40px rgba(0, 0, 0, 0.05))',
                height: 30,
                color: '#1890FF',
                cursor: 'pointer',
                justifyContent: 'center',
                alignItems: 'center',
            }}
            onClick={() =>
            {
                onClick();
            }}
        >
      Thêm nhiệm vụ
        </div>
    );
}

export const KanbanBoard = React.memo(
    ({
        data,
        onCardMoveAcrossLanes,
        handleLaneDragEnd,
        onLaneDelete,
        onLaneUpdate,
        onCardClick,
        onCardAdd,
        onLaneAdd,
    }:any) =>
    {
        return (
            <div>
                <Board
                    data={data}
                    components={{ Card, LaneHeader, AddCardLink }}
                    handleDragStart={handleDragStart}
                    lang="vi"
                    handleLaneDragEnd={handleLaneDragEnd}
                    editable
                    draggable
                    canAddLanes
                    onCardMoveAcrossLanes={onCardMoveAcrossLanes}
                    onDataChange={shouldReceiveNewData}
                    onCardAdd={onCardAdd}
                    onLaneAdd={onLaneAdd}
                    onLaneUpdate={onLaneUpdate}
                    // collapsibleLanes
                    onCardClick={onCardClick}
                    onLaneDelete={onLaneDelete}
                />
            </div>
        );
    },
);
