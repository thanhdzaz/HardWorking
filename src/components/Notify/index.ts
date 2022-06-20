import { notification } from 'antd';

const Notify = (type = '', txt = ''):void =>
{
    notification.config({ duration: 5 });
    notification[type]({
        message: type === 'success' ? 'Thành công' : 'Lỗi',
        description: txt,
        placement: 'bottomRight',
    });

};

export default Notify;
