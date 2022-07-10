import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { Checkbox, Table } from 'antd';
import { PERMISSIONS } from 'constant';
import { firestore } from 'firebase';
import { RoleDto } from 'models/Roles';
import React, { useEffect, useState } from 'react';

interface Props{
  onOk: ()=>void;
  onCancel: ()=>void;
  currentRecord: RoleDto
}

export const UpdateRole:React.FunctionComponent<Props> = (props) =>
{

    const [data,setData] = useState(PERMISSIONS.map(e=>({ ...e,allow: false })));
    // const [selectedKeys,setSelectedKeys] = useState<React.Key[]>([]);
    const [checkAll,setCheckAll] = useState(false);

    useEffect(() =>
    {
        if (props.currentRecord)
        {
            const p = props.currentRecord.permission.map(x => x.key);

            setData(pre=>pre.map(x =>({ ...x,allow: p.includes(x.key) })));
        }
       
    },[props.currentRecord]);

    useEffect(() =>
    {
        // const a = data.filter(d => !d.allow);
        const b = data.filter(d => d.allow);
        
       
        if (b.length === data.length)
        {
            console.log('heeh');
          
            setCheckAll(true);
        }
        else
        {
            setCheckAll(false);
        }
       
    },[data]);
    
    return (
        <ModalForm
            title={'Sửa mới vai trò'}
            modalProps={
                {
                    ...props,
                    okText: 'Sửa',
                    cancelText: 'Đóng',
                }
            }
            width="75%"
            initialValues={props.currentRecord}
            visible
            onFinish={(val)=>
            {
                
                const formData = { ...val,permission: data.filter(d=>d.allow).map((e:any)=>
                {
                    delete e.allow;
                    return e;
                }),
                key: val.name.toUpperCase(),
                };

                firestore.update('Role',props.currentRecord.id,formData);
              
                return Promise.resolve(false);
            }}
        >
            <ProFormText
                name={'name'}
                label="Tên vai trò"
                rules={[{ required: true, message: 'Tên vai trò không được rỗng' }]}
                placeholder={'Tên vai trò'}
            />
            <Table
                dataSource={data}
                rowKey="key"
                columns={[
                    { title: 'Quyền', dataIndex: 'name' },
                    { title: ()=>
                    {
                        return (
                            <Checkbox
                                key={'hehe'}
                                checked={checkAll}
                                onChange={(e)=>
                                {
                                    setCheckAll(e.target.checked);
                                    if (e.target.checked)
                                    {
                                        const d = [...data].map(e=>({
                                            ...e,allow: true,
                                        }));
                                        setData(d);
                                    }
                                    else
                                    {
                                        const d = [...data].map(e=>({
                                            ...e,allow: false,
                                        }));
                                        setData(d);
                                    }
                                }}
                            />
                        );
                    }, dataIndex: 'allow',render: (val:boolean,item) =>(
                        <Checkbox
                            key={item.key}
                            checked={val}
                            onChange={()=>
                            {
                                const index = data.indexOf(item);
                                const d = [...data];
                                d[index].allow = !data[index].allow;
                                setData(d);
                            }}
                        />
                    ) },

                ]}
            />
        </ModalForm>
    );

};
