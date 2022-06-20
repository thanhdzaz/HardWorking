import './index.less';
import './media_query.less';

import { Col, Row } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
// import LanguageSelect from '../LanguageSelect';
import Title from './BreadcrumbTitle';
import Project from './ProjectChoose';
import React from 'react';
import UserOverView from './UserOverView';
// import AppComponentBase from 'components/AppComponentBase';

import utils from '../../utils/utils';

export interface IHeaderProps {
  collapsed?: any;
  toggle?: any;
  data?: [];
}


export const Header:React.FC <IHeaderProps> = (props)=>
{
    const [os, setOs] = React.useState('PC');
    React.useEffect(()=>
    {
        setOs(utils.getOS());
    },[]);
   
    return (
        <Row className="header-container">
            <Col
                id="button-trigger-sider-menu"
                style={{ textAlign: 'left' }}
                span={3}
                    
            >
                {props.collapsed
                    ? (
                            <MenuUnfoldOutlined
                                className="trigger"
                                id={'toggle-menu'}
                                onClick={props.toggle}
                            />
                        )
                    : (
                            <MenuFoldOutlined
                                className="trigger"
                                id={'toggle-menu'}
                                onClick={props.toggle}
                            />
                        )}
            </Col>
            <Col
                span={13}
                style={{ justifyContent: 'center', alignItems: 'center' }}
            >
                <Title data={props.data} />
            </Col>
            <Col span={5}>
                <Project os={os} />
            </Col>
                
            
            <Col
                style={{
                    padding: '0px 15px 0px 15px',
                    textAlign: 'right',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignContent: 'center',
                    alignItems: 'center' }}
                span={3}
            >
                <UserOverView />
            </Col>
        </Row>
    );
};


export default Header;
