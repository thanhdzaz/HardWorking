import { Col, Row, Button } from 'antd';
import { MenuOutlined, PlusCircleOutlined, CloseOutlined, UploadOutlined, ImportOutlined, DatabaseOutlined, SearchOutlined, PrinterOutlined } from '@ant-design/icons';
import './index.less';
import React from 'react';

export interface IHeaderProps {
    Click1?:any
    Click2?:any
    Click3?:any
    Click4?:any
    Click5?:any
    Click6?:any
    Click7?:any
    Click8?:any
    hidden1?:boolean
    hidden2?:boolean
    hidden3?:boolean
    hidden4?:boolean
    hidden5?:boolean
    hidden6?:boolean
    hidden7?:boolean
    hidden8?:boolean
}


export class Header extends React.Component<IHeaderProps>
{
    state = {
        bgColorCheck1: '#7961BF',
    };

    render(): JSX.Element
    {
        return (
            <React.Fragment>
                <Row className='RowTool'>
    
                    <Col
                        className='IconTool'
                        title='Tổng quan'
                        span={3}
                        hidden={this.props.hidden1}
                    >
                        <Button
                            type="primary"
                            icon={<MenuOutlined />}
                            size='large'
                            style={{ backgroundColor: '#7961BF', border: 0, borderRadius: '10px' }}
                            disabled={this.props.Click1 ? false : true}
                            onClick={this.props.Click1}
                        />
                    </Col>
                            
    
                    <Col
                        className='IconTool'
                        title='Thêm'
                        span={3}
                        hidden={this.props.hidden2}
                    >
                        <Button
                            type="primary"
                            icon={<PlusCircleOutlined />}
                            size='large'
                            style={{ backgroundColor: '#7961BF', border: 0, borderRadius: '10px' }}
                            disabled={this.props.Click2 ? false : true}
                            onClick={this.props.Click2}
                        />
                    </Col>
                            
    
                    <Col
                        className='IconTool'
                        title='Xoá'
                        span={3}
                        hidden={this.props.hidden3}
                    >
                        <Button
                            type="primary"
                            icon={<CloseOutlined />}
                            size='large'
                            style={{ backgroundColor: '#D26A5C', border: 0, borderRadius: '10px' }}
                            disabled={this.props.Click3 ? false : true}
                            onClick={this.props.Click3}
                        />
                    </Col>
                            
    
                    <Col
                        className='IconTool'
                        title='Tìm kiếm'
                        span={3}
                        hidden={this.props.hidden4}
                    >
                        <Button
                            type="primary"
                            icon={<SearchOutlined />}
                            size='large'
                            style={{ backgroundColor: '#7961BF', border: 0, borderRadius: '10px' }}
                            disabled={this.props.Click4 ? false : true}
                            onClick={this.props.Click4}
                        />
                    </Col>
                            
    
                    <Col
                        className='IconTool'
                        title='Xuất file'
                        span={3}
                        hidden={this.props.hidden5}
                    >
                        <Button
                            type="primary"
                            icon={<UploadOutlined />}
                            size='large'
                            // style={...this.props.Click1 !== undefined ? [{ backgroundColor: '#7961BF', border: 0, borderRadius: '10px' }] : [{ backgroundColor: '#633DCE', border: 0, borderRadius: '10px' }]}
                            style={{ backgroundColor: '#7961BF', border: 0, borderRadius: '10px' }}
                            disabled={this.props.Click5 ? false : true}
                            onClick={this.props.Click5}
                        />
                    </Col>

    
                    <Col
                        className='IconTool'
                        title='Kết nhập'
                        span={3}
                        hidden={this.props.hidden6}
                    >
                        <Button
                            type="primary"
                            icon={<ImportOutlined />}
                            size='large'
                            style={{ backgroundColor: '#7961BF', border: 0, borderRadius: '10px' }}
                            disabled={this.props.Click6 ? false : true}
                            onClick={this.props.Click6}
                        />
                    </Col>
                
                
                    <Col
                        className='IconTool'
                        title=''
                        span={3}
                        hidden={this.props.hidden7}
                    >
                        <Button
                            type="primary"
                            icon={<DatabaseOutlined />}
                            size='large'
                            style={{ backgroundColor: '#7961BF', border: 0, borderRadius: '10px' }}
                            disabled={this.props.Click7 ? false : true}
                            onClick={this.props.Click7}
                        />
                    </Col>

               
                    <Col
                        className='IconTool'
                        title='BOM tổng'
                        span={3}
                        hidden={this.props.hidden8}
                    >
                        <Button
                            type="primary"
                            icon={<PrinterOutlined />}
                            size='large'
                            // style={...this.props.Click1 !== undefined ? [{ backgroundColor: '#7961BF', border: 0, borderRadius: '10px' }] : [{ backgroundColor: '#633DCE', border: 0, borderRadius: '10px' }]}
                            style={{ backgroundColor: '#7961BF', border: 0, borderRadius: '10px' }}
                            disabled={this.props.Click8 ? false : true}
                            onClick={this.props.Click8}
                        />
                    </Col>
                          
                </Row>
            </React.Fragment>
        );
    }
}

export default Header;
