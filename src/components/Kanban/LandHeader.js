/* eslint-disable no-alert */
import { Dropdown } from 'antd';
import { COLOR_TINT } from 'constant/index';
import { observer } from 'mobx-react';
import * as React from 'react';

export const CustomLaneHeader = observer(({
    title,
    changeColor,
    // onDelete,
    color,
    // updateTitle,
    onDoubleClick,
    // handleStartCreate,
    // index: ordered,
})=>
{
    const [showPopover, setShowPopOver] = React.useState(false);
    showPopover;
    const [showMenu, setShowMenu] = React.useState(false);
    // const [isEdit, setIsEdit] = React.useState(false);
    // const [saveState, setSaveState] = React.useState(false);
    const [t] = React.useState(title);
    // const inputRef = React.useRef();
    return (
        <div>
            <header
                title=''
                style={{
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    paddingRight: 10,
                    paddingBottom: 6,
                    marginBottom: 10,
                    minWidth: 250,
                    maxHeight: 40,
                    display: 'flex',
                    overflow: 'hidden',
                    flexDirection: 'row',
                    backgroundColor: '#FFFFFF',
                }}
                className="lane-header-custom"
                onDoubleClick={onDoubleClick}
            >
                <Dropdown
                    trigger={[]}
                    overlay={(
                        <div className="popoverChooseColorKanban">
                            {COLOR_TINT.map((value) => (
                                <div
                                    key={value}
                                    style={{
                                        padding: '1px',
                                        border: color === value ? `1px solid ${color}` : 'none',
                                        borderRadius: 50,
                                        width: 35.5,
                                        height: 35.5,
                                        cursor: 'pointer',
                                    }}
                                    onClick={() =>
                                    {
                                        if (value === color)
                                        {
                                            setShowPopOver(false);
                                        }
                                        else
                                        {
                                            changeColor(value);
                                            setShowPopOver(false);
                                        }
                                    }}
                                >
                                    <div
                                        style={{
                                            backgroundColor: value,
                                            border: color === value ? `1px solid ${color}` : 'none',
                                        }}
                                        className="circle-btn"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                >
                    {/* <Popover content={'Đổi màu'}> */}
                    <span
                        style={{
                            borderTopLeftRadius: 10,
                            width: 9,
                            height: 40,
                            backgroundColor: color,
                            cursor: 'pointer',
                        }}
                        // onClick={() =>
                        // {
                        //     setShowPopOver(!showPopover);
                        //     setShowMenu(false);
                        // }}
                    />
                    {/* </Popover> */}
                </Dropdown>

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: 5,
                        fontSize: 14,
                        fontWeight: 'bold',
                        width: '90%',
                    }}
                >
                    {t}
                        
                </div>

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                    }}
                    onClick={() =>
                    {
                        setShowMenu(!showMenu);
                        setShowPopOver(false);
                    }}
                />
                {/* <Dropdown
                    trigger={['click']}
                    overlay={(
                        <Menu
                            style={{
                                borderRadius: 10,
                                overflow: 'hidden',
                            }}
                        >
                            <Menu.Item
                                key={0}
                                onClick={() =>
                                {
                                    setIsEdit(true);
                                    setSaveState(true);
                                    inputRef.current.focus();
                                }}
                            >
                Sửa
                            </Menu.Item>
                            <Menu.Item
                                key={1}
                                onClick={() =>
                                {
                                    onDelete();
                                }}
                            >
                Xóa
                            </Menu.Item>
                            <Menu.Item
                                key={2}
                                onClick={() =>
                                {
                                    handleStartCreate && handleStartCreate(ordered + 1);
                                }}
                            >
                Thêm trạng thái -{'>'}
                            </Menu.Item>
                            <Menu.Item
                                key={3}
                                onClick={() =>
                                {
                                    handleStartCreate && handleStartCreate(ordered);
                                }}
                            >
                Thêm trạng thái {'<'}-
                            </Menu.Item>
                        </Menu>
                    )}
                >
                    <Popover content={'Cài đặt'}>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                cursor: 'pointer',
                            }}
                        >
                            <EllipsisOutlined width={40} />
                        </div>
                    </Popover>
                </Dropdown> */}
            </header>
        </div>
    );
});
