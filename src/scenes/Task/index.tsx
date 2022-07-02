import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { useStore } from 'stores';

const Task = observer((
    _:any,
)=>
{

    const { projectStore } = useStore();

    console.log(toJS(projectStore.listProject));
  
    
    return <></>;
});


export default Task;
