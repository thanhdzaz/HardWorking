import ProTable from '@ant-design/pro-table';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { useStore } from 'stores';

const Task = observer((
    _:any,
)=>
{

    const { projectStore } = useStore();

    console.log(toJS(projectStore.listProject));
  
    
    return (
        <div>
      
            <ProTable
                toolBarRender={false}
                toolbar={{}}
                search={false}
            />
     
        </div>
    );
});


export default Task;
