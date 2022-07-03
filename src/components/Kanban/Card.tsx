import { Progress } from 'antd';
import { ReactComponent as Calendar } from 'asset/calendar.svg';
import moment from 'moment';
// import { ReactComponent as Trello } from 'assets/trello.svg';
import { observer } from 'mobx-react';

const priorityObj = {
    0: {
        color: 'blue',
        name: 'Bình thường',
    },
    1: {
        color: 'yellow',
        name: 'Trung bình',
    },
    2: {
        color: 'red',
        name: 'Cao',
    },
};

export const Card = observer((props)=>
{
    const {
        onClick,
        title,
        // handleShowPopUp,
        priority,
        // parent_id: parentId,
        start_datetime: start,
        end_datetime: end,
        progress,
    } = props;

    // const [parent, setParent] = React.useState(null);
    // React.useEffect(() =>
    // {
    //     if (parentId)
    //     {
    //         setParent(() =>
    //             issue.find((p) => p.id.toString() === parentId.toString()),
    //         );
    //     }
    // }, [parentId, issue]);

    // const listPriority = useRecoilValue(listProjectPriorityAtom);

    const prio =
    // listPriority.find((item) => item.id.toString() === priority?.toString()) ??
    priorityObj[priority];

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
            {/* {parent && (
                <Popover content={<Trans>Công việc cha</Trans>}>
                    <div
                        type="text"
                        style={{
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            alignContent: 'center',
                        }}
                        onClick={(e) =>
                        {
                            handleShowPopUp && handleShowPopUp(parent.id);
                            e.currentTarget.blur();
                        }}
                    >
                        <Trello
                            className="svg-parent-ic"
                            stroke="#1890FF"
                            height="20"
                            width="20"
                        />
                        <Typography.Text
                            color="blue"
                            underline
                            ellipsis
                        >
                            {parent.title}
                        </Typography.Text>
                    </div>
                </Popover>
            )} */}
            <div
                style={{
                    fontWeight: 'bold',
                    width: '100%',
                    cursor: 'pointer',
                }}
                className="card-item-name"
                onClick={onClick}
            >
                {title}
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
            </div>
            <div>
                <Calendar fill="#9EA3A9" /> &nbsp;{' '}
                <span
                    style={{
                        color: '#9EA3A9',
                    }}
                >
                    {moment(start).format('DD-MM-YYYY')}
                </span>
        &nbsp;
                <Calendar fill="#9EA3A9" />
        &nbsp;
                <span
                    style={{
                        color: '#9EA3A9',
                    }}
                >
                    {moment(end).format('DD-MM-YYYY')}
                </span>
            </div>
            <br />
            {prio
                ? (
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
                            {prio.name}
                        </div>
                    )
                : null}
        </article>
    );
});
