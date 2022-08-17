import { Avatar, Popover, Progress, Typography } from 'antd';
import { ReactComponent as Calendar } from 'asset/calendar.svg';
// import { ReactComponent as Trello } from 'assets/trello.svg';
import { PRIORITY_LIST } from 'constant';
import { observer } from 'mobx-react';
import { TaskDto } from 'models/Task/dto';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { taskAtom } from 'stores/atom/task';
import { userProjectAtom } from 'stores/atom/user';

import { ReactComponent as Child } from 'asset/child.svg';


export const Card = observer((props) =>
{
    const {
        onClick,
        title,
        handleShowPopUp,
        priority,
        parentId,
        startTime,
        endTime,
        progress,
    } = props;

    const {
        assignTo,
        assignBy,
    } = props as TaskDto;

    const task = useRecoilValue(taskAtom);
    const users = useRecoilValue(userProjectAtom);

    const nguoiLam = users.find(user => user.id === assignTo);
    const nguoiGiao = users.find(user => user.id === assignBy);

    const [parent, setParent] = React.useState<TaskDto | null>(null);
    React.useEffect(() =>
    {
        if (parentId)
        {
            setParent(
                () => task.find((p) => p.id.toString() === parentId.toString()) ?? null,
            );
        }
    }, [parentId, task]);
    

    const prio = PRIORITY_LIST.find(
        (item) => item.id.toString() === priority?.toString(),
    );

    return (
        <article
            style={{
                background: '#FFFFFF',
                padding: '10px',
                minHeight: '62px',
                margin: '5px',
                borderRadius: '10px',
                height: 'auto',
                overflow: 'hidden',
            }}
            className="card-border"
            onDoubleClick={onClick}
        >
            {parent && (
                <Popover content={'Công việc cha'}>
                    <div
                        style={{
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            alignContent: 'center',
                        }}
                        onClick={(e) =>
                        {
                            e.stopPropagation();
                            handleShowPopUp && handleShowPopUp(parentId);
                            e.currentTarget.blur();
                        }}
                    >
                        {/* <Trello
                            className="svg-parent-ic"
                            stroke="#1890FF"
                            height="20"
                            width="20"
                        /> */}
                        <Typography.Text
                            underline
                            ellipsis
                        >
                            {parent.title}
                        </Typography.Text>
                    </div>
                </Popover>
            )}
            <div
                style={{
                    fontWeight: 'bold',
                    width: '100%',
                    cursor: 'pointer',
                    display: 'flex',
                }}
                className="card-item-name"
                onClick={onClick}
            >
                {
                    parent && (
                        <Child
                            fill='blue'
                            style={{
                                alignSelf: 'center',
                                marginRight: 10,
                            }}
                        />
                    )
                }
                <Popover
                    title={title}
                >
                    <Typography.Text
                        style={{
                            width: parent && parent.id ? '90%' : '100%',
                        }}
                        ellipsis
                    >
                        {title}
                    </Typography.Text>
                </Popover>
            </div>
            {/* {description && (
        <p
          style={{
            marginBottom: 0,
          }}
          className="ellip-custom"
        >
          <i style={{ color: "#9EA3A9" }}>Mô tả:</i>&nbsp;
          <span style={{ color: "#9EA3A9" }}>
            {description.length > 125
              ? `${description.substring(0, 125)}...`
              : description}
          </span>
        </p>
      )} */}
            <div
                className="card-progress"
                color={
                    progress > 75
                        ? 'blue'
                        : progress > 25
                            ? 'orange'
                            : progress > 0
                                ? 'red'
                                : 'grey'
                }
            >
                <Progress
                    percent={progress ?? 0}
                    strokeColor={
                        progress > 75
                            ? '#1890FF'
                            : progress > 25
                                ? '#F58632'
                                : progress > 0
                                    ? '#E5493A'
                                    : 'grey'
                    }
                />
                {nguoiLam && (
                    <Popover
                        content={
                            nguoiLam?.fullName
                        }
                    >
                        <Avatar
                            style={{
                                cursor: 'pointer',
                                marginLeft: 20,
                            }}
                            src={nguoiLam?.avatarUrl}
                        />
                    </Popover>
                )}
                

            </div>
            <div>
                <Calendar fill="#9EA3A9" /> &nbsp;{' '}
                <span
                    style={{
                        color: '#9EA3A9',
                    }}
                >
                    {startTime}
                </span>
        &nbsp;
                <Calendar fill="#9EA3A9" />
        &nbsp;
                <span
                    style={{
                        color: '#9EA3A9',
                    }}
                >
                    {endTime}
                </span>
            </div>
            <br />
            {prio
                ? (
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div
                                style={{
                                    width: 'fit-content',
                                    paddingLeft: 10,
                                    paddingRight: 10,
                                    borderRadius: 5,
                                    fontWeight: 'bold',
                                    height: 24,
                                    backgroundColor: prio.color,
                                    color: 'white',
                                }}
                            >
                                {prio.title}
                            </div>
                            {nguoiGiao && (
                                <Popover
                                    content={
                                        nguoiGiao?.fullName
                                    }
                                >
                                    <Typography.Text>Người giao: {nguoiGiao.fullName}</Typography.Text>
                                </Popover>
                            )}
                           
                        </div>
                       
                    )
                : null}
        </article>
    );
});
