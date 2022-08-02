export const iconRotate = (deg:number):any =>
{
    return ({
        onMouseOver: (e)=>
        {
            e.currentTarget.style.rotate = `${deg}deg`;
        },
        onMouseLeave: (e)=>
        {
        
            e.currentTarget.style.rotate = '0deg';
          
        },
        style: {
            transition: '200ms linear',
        },
    });
};

export const ACTION = {
    update: 'Cập nhật',
    add: 'Thêm mới',
    delete: 'Xóa',
};


export const LOGKEYS = {
    assignTo: 'Giao cho',
    title: 'Tên nhiệm vụ',
    description: 'Mô tả',
    parentId: 'Công việc cha',
    status: 'Trạng thái',
    progress: 'Tiến độ',
    priority: 'Độ ưu tiên',
};


export const getDate = (date:string):Date =>
{
    const d = date.split('/');
    return new Date(`${d[1]}/${d[0]}/${d[2]}`);
};
