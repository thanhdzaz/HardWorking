/* eslint-disable multiline-ternary */
import { DownOutlined } from '@ant-design/icons';
import { ProFormDateRangePicker } from '@ant-design/pro-form';

import { useDebounce } from 'ahooks';
import {
    Avatar,
    Button,
    Checkbox,
    Dropdown,
    Form,
    Input,
    Menu,
    Select,
} from 'antd';
import Text from 'antd/lib/typography/Text';
import { CharacterAvatar } from 'components/Avatar/CharacterAvatar';
import { STATUS_LIST } from 'constant';
import { auth } from 'firebase';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { userProjectAtom } from 'stores/atom/user';

const formItemLayout = {
    style: {
        marginBottom: 0,
    },
    labelCol: {
        xs: { span: 10 },
        sm: { span: 10 },
        md: { span: 10 },
        lg: { span: 10 },
        xl: { span: 10 },
        xxl: { span: 10 },
    },
    wrapperCol: {
        xs: { span: 18 },
        sm: { span: 18 },
        md: { span: 18 },
        lg: { span: 18 },
        xl: { span: 18 },
        xxl: { span: 18 },
    },
};
  

const HeaderFilter: React.FunctionComponent<any> = ({
    renderData,
    showMyIssue = true,
    showStatusFilter = true,
    showDateRangeFilter = true,
    showUsersFilter = true,
    showSearch = true,
    showChild = true,
    tasks,
    getTasks,
}) =>
{
    const [filterObj, setFilterObj] = useState<any>({});
    const users = useRecoilValue(userProjectAtom);
    const user = auth?.currentUser;
    const [search, setSearch] = useState('');
    const debounceSearch = useDebounce(search);


    const handleChangeFilter = (key, value?) =>
    {
        switch (key)
        {
            case 'myIssue':
                setFilterObj((prev) =>
                    prev.myIssue
                        ? { ...prev, myIssue: false }
                        : { ...prev, myIssue: true },
                );
                break;
            case 'isShowChild':
                setFilterObj((prev) =>
                    prev.isShowChild
                        ? { ...prev, isShowChild: false }
                        : { ...prev, isShowChild: true },
                );
                break;
            case 'new':
                setFilterObj((prev) =>
                    prev.new ? { ...prev, new: false } : { ...prev, new: true },
                );
                break;
            case 'status':
                setFilterObj((prev) => ({ ...prev, status: value }));
                break;
            case 'dateRange':
                setFilterObj((prev) => ({ ...prev, dateRange: value }));
                break;
            case 'userIds':
                setFilterObj((prev) =>
                {
                    if (prev.userIds)
                    {
                        const ids = [...prev.userIds];
                        const id = ids.find((_id) => _id === value);
                        if (id)
                        {
                            ids.splice(ids.indexOf(id), 1);
                            return { ...prev, userIds: ids };
                        }
                        ids.push(value);
                        return { ...prev, userIds: [...ids] };
                    }
                    return { ...prev, userIds: [value] };
                    // return { ...prev, userIds: value };
                });
                break;
            case 'search':
                setFilterObj((prev) => ({ ...prev, search: value }));
                break;
            default:
                break;
        }
    };

    const getChildren = (id, data) =>
    {
        const d = [
            ...data.filter((s) => s?.parentId?.toString() === id.toString()),
        ];
        return d.map((e) =>
        {
            const child = getChildren(e.id, data);
            return {
                ...e,
                ...(child.length > 0 ? { children: child } : {}),
            };
        });
    };

    const filterIssue = () =>
    {
        let data = [...tasks];

        if (filterObj)
        {
            if (filterObj.isShowChild)
            {
                let currentData = [...data];
                let tmp = currentData.filter((d) => !d.parentId);
                currentData = currentData.filter((d) => d.parentId);
                tmp = [
                    ...tmp.map((e) =>
                    {
                        const child = getChildren(e.id, data);
                        return {
                            ...e,
                            ...(child.length > 0 ? { children: child } : {}),
                        };
                    }),
                ];
                data = tmp;
            }

            if (filterObj.myIssue)
            {
                data = data.filter((item) => item?.assignTo === user?.uid);
            }

            if (filterObj.userIds)
            {
                const selectedUsers = [...filterObj.userIds];
                if (selectedUsers.length)
                {
                    data = data.filter((item) =>
                        selectedUsers.includes(item.assignTo),
                    );
                }
            }

            if (filterObj.myIssue)
            {
                data = data.filter((item) => item?.assignTo === user?.uid);
            }
            if (filterObj.dateRange)
            {
                const startDate = filterObj.dateRange[0];
                const endDate = filterObj.dateRange[1];
                data = data.filter(
                    (e) =>
                        (endDate.isSameOrAfter(
                            moment(e.endTime, 'DD/MM/YYYY'),
                        ) &&
              startDate.isSameOrBefore(
                  moment(e.endTime, 'DD/MM/YYYY'),
              )) ||
            (endDate.isSameOrAfter(
                moment(e.startTime, 'DD/MM/YYYY'),
            ) &&
              startDate.isSameOrBefore(
                  moment(e.startTime, 'DD/MM/YYYY'),
              )),
                );
            }
            if (filterObj.status)
            {
                data = data.filter((e) => filterObj.status === e.status);
            }

            if (filterObj.search)
            {
                data = data.filter((e) =>
                    e.title
                        .toString()
                        .toLowerCase()
                        .includes(filterObj.search.toLowerCase()),
                );
            }
            renderData(data);
        }
    };

    useEffect(() =>
    {
        handleChangeFilter('search', search);
    }, [debounceSearch]);

    useEffect(() =>
    {
        getTasks();
    }, []);

    useEffect(() =>
    {
        filterIssue();
    }, [tasks, filterObj]);

    return (
        <>
            {showChild && (
                <div>
                    <span>Kiểu quan hệ:</span>
          &nbsp;
                    <input
                        type="checkbox"
                        name="isShowChild"
                        style={{ marginRight: 10 }}
                        checked={filterObj?.isShowChild ?? false}
                        onChange={() => handleChangeFilter('isShowChild')}
                    />
                </div>
            )}

            {showMyIssue && (
                <span
                    className={
                        filterObj.myIssue
                            ? 'content-right__btn-grey content-right__btn-active'
                            : 'content-right__btn-grey'
                    }
                    onClick={() => handleChangeFilter('myIssue')}
                >
          Công việc của tôi
                </span>
            )}

            {showStatusFilter && (
                <>
                    <span className="content-right__status-text">Trạng thái</span>
                    <Form.Item {...formItemLayout}>
                        <Select
                            style={{ width: 150, marginRight: 10 }}
                            defaultValue=""
                            placeholder="Chọn trạng thái"
                            allowClear
                            onChange={(value) => handleChangeFilter('status', value)}
                        >
                            {STATUS_LIST.map((st) => (
                                <Select.Option
                                    key={st.id}
                                    value={st.id}
                                >
                                    {st.title}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </>
            )}

            {showUsersFilter && (
                <div style={{ marginRight: 10 }}>
                    <Dropdown
                        trigger={['click']}
                        overlay={(
                            <Menu
                                style={{
                                    background: '#fff',
                                    maxHeight: 300,
                                    overflowY: 'scroll',
                                }}
                            >
                                {users?.map((us) => (
                                    <Menu.Item
                                        key={us.id}
                                        // onClick={(e: any) => e?.stopPropagation()}
                                    >
                                        <Checkbox
                                            key={us.id}
                                            style={{ marginRight: 5 }}
                                            onChange={() => handleChangeFilter('userIds', us.id)}
                                        />
                                        {us.avatarUrl ? (
                                            <Avatar
                                                size={35}
                                                src={us.avatarUrl}
                                            />
                                        ) : (
                                            <CharacterAvatar
                                                size={35}
                                                title={`${us.firstName ?? ''} ${us.lastName ?? ''}`}
                                            />
                                        )}

                                        <Text style={{ marginLeft: 5 }}>
                                            {`${us.firstName ?? ''} ${us.lastName ?? ''}`}
                                        </Text>
                                    </Menu.Item>
                                ))}
                            </Menu>
                        )}
                    >
                        <Button>
              Lọc theo thành viên <DownOutlined />
                        </Button>
                    </Dropdown>
                </div>
            )}

            {showDateRangeFilter && (
                <div className="content-right__date-range-picker">
                    <ProFormDateRangePicker
                        fieldProps={{
                            ...formItemLayout,
                            format: 'DD-MM-YYYY',
                            onChange: (value) => handleChangeFilter('dateRange', value),
                            placeholder: ['Từ ngày', 'Đến ngày'],

                        }}
                        width={270}
                        placeholder={['Chọn ngày', 'Chọn ngày']}
                        name="dateRange"
                    />
                </div>
            )}

            {showSearch && (
                <Form.Item {...formItemLayout}>
                    <Input
                        style={{ width: 200 }}
                        placeholder="Tìm kiếm"
                        allowClear
                        onKeyDown={(e: any) => setSearch(e.target.value)}
                    />
                </Form.Item>
            )}
        </>
    );
};

export default HeaderFilter;
