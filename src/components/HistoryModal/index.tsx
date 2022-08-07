import { Modal } from 'antd';
import { LEAVE_STATUS_OBJ } from 'constant';
import { firestore } from 'firebase';
import { getDocs, query, where } from 'firebase/firestore/lite';
import { CheckLog } from 'models/Task/dto';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { ACTION, LOGKEYS } from 'utils';
import './index.less';

const HistoryModal: React.FunctionComponent<any> = ({ id, users, toggleModal }) =>
{
    const [logs,setLogs] = useState<CheckLog[]>([]);

    const getLogs = async() =>
    {
        const q = query(firestore.collection('CheckLogs'),where('taskId', '==', id));
        const querySnapshot = await getDocs(q);
                
        const l:CheckLog[] = [];
        querySnapshot.forEach((doc: any) =>
        {
            l.push(doc.data());
        });
        setLogs(l.sort((a, b) =>b.time.seconds - a.time.seconds));
    };

    useEffect(() =>
    {
        getLogs();
    }, []);

    return (
        <div className="history-popup">
            <Modal
                width="60%"
                title={'Lịch sử thay đổi'}
                okButtonProps={{
                    style: {
                        display: 'none',
                    },
                }}
                cancelText='Đóng'
                visible
                onCancel={toggleModal}
                onOk={toggleModal}
            >
                <div className="checklog-box">
                    {
                        logs.length
                            ? logs.map((log) =>
                            {
                                const u = users.find((u) =>u.id === log.userId);
  
                                const oldVal = LEAVE_STATUS_OBJ[log.oldValue];
                                const newVal = LEAVE_STATUS_OBJ[log.newValue];
                                                                 
                                return (
                                    <div key={log.id}>
                                        <b>{moment.unix(log.time.seconds).format('DD/MM/YYYY HH:mm')}</b> <b>{u?.fullName}</b> - {ACTION[log.action]} {LOGKEYS[log.field]} từ <b>{oldVal}</b> sang <b>{newVal}</b>
                                    </div>
                                );


                            })
                            : <div className="empty-text">Trống</div>
                    }
                </div>
            </Modal>
        </div>
       
    );
};

export default HistoryModal;
