/** Danh sách màu mặc định */
export const COLOR_TINT = [
    '#1890FF', // 0
    '#DD241D', // 1
    '#4DB24D', // 2
    '#904EE2', // 3
    '#F58632', // 4
    '#FFD426', // 5
    '#96DB0B', // 6
    '#2BD9D9', // 7
    '#3D474D', // 8
    '#8A9499', // 9
    '#FF7BE2', // 10
    '#F2A49C', // 11
];

export const STATUS_LIST = [
    {
        id: 0,
        title: 'Khởi tạo',
        color: 'red',
    },
    {
        id: 1,
        title: 'Đang làm',
        color: '#FFFF00',
    },
    {
        id: 2,
        title: 'Hoàn thành',
        color: '#FFFF00',
    },
    {
        id: 3,
        title: 'Xác nhận',
        color: '#FFFF00',
    },
    {
        id: 4,
        title: 'Đóng',
        color: '#FFFF00',
    },
];


export const PRIORITY_LIST = [
    {
        id: 0,
        title: 'Rất thấp',
        color: 'yellow',
    },
    {
        id: 1,
        title: 'Thấp',
        color: '#00F044',
    },
    {
        id: 2,
        title: 'Trung bình',
        color: 'orange',
    },
    {
        id: 3,
        title: 'Cao',
        color: '#f00008',
    },
    {
        id: 4,
        title: 'Rất cao',
        color: '#ff0000',
    },
];

export const PERMISSIONS = [
    {
        'name': 'Xem người dùng',
        'key': 'USERS_VIEW',
    },
    {
        'name': 'Thêm người dùng',
        'key': 'USERS_ADD',
    },
    {
        'name': 'Xóa người dùng',
        'key': 'USER_DELETE',
    },
    {
        'name': 'Cập nhập người dùng',
        'key': 'USERS_EDIT',
    },
    // vai trò
    {
        'name': 'Xem vai trò',
        'key': 'ROLES_VIEW',
    },
    {
        'name': 'Thêm vai trò',
        'key': 'ROLES_ADD',
    },
    {
        'name': 'Xóa Vai trò',
        'key': 'ROLES_DELETE',
    },
    {
        'name': 'Sửa vai trò',
        'key': 'ROLES_EDIT',
    },
    // project
    {
        'name': 'Xem dự án',
        'key': 'PJ_VIEW',
    },
    {
        'name': 'Thêm dự án',
        'key': 'PJ_ADD',
    }, {
        'name': 'Xóa dự án',
        'key': 'PJ_DELETE',
    },
    {
        'name': 'Sửa dự án',
        'key': 'PJ_EDIT',
    },
];

export const NGHI_KHONG_PHEP = 0;
export const NGHI_CO_PHEP = 1;

export const LEAVE_STATUS_OBJ = {
    0: 'Nghỉ không phép',
    1: 'Nghỉ có phép',
};

export const SHIFT_OBJ = {
    startTime: '08:00:00',
    endTime: '18:00:00',
};

export const LAUCH_OBJ = {
    startTime: '12:00:00',
    endTime: '13:30:00',
};
