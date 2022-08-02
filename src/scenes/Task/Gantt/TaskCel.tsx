import { PRIORITY_LIST } from 'constant';
import { TaskDto } from 'models/Task/dto';

export const TaskCells:React.FunctionComponent<{
    task: TaskDto,
}> = ({ task }):JSX.Element =>
{

    const prio = PRIORITY_LIST.find((item) => item.id.toString() === task.priority?.toString());
    return (
        <div
            style={{
                backgroundColor: prio?.color ?? 'red',
                top: 0, left: 0,
                position: 'absolute',
                minWidth: `${Math.floor(task.progress)}%`,
                borderRadius: 3,
            }}
        >
            {
                // task.title
            }
      &nbsp;
        </div>
    );
};
