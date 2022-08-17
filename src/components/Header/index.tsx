import './index.less';
import './media_query.less';

import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
// import LanguageSelect from '../LanguageSelect';
import React, { useEffect } from 'react';
import Title from './BreadcrumbTitle';
import Project from './ProjectChoose';
import UserOverView from './UserOverView';
// import AppComponentBase from 'components/AppComponentBase';

import { firestore } from 'firebase';
import { observer } from 'mobx-react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { listUserInfoAtom, userInfoAtom } from 'stores/atom/user';
import utils from '../../utils/utils';

export interface IHeaderProps {
  collapsed?: any;
  toggle?: any;
  data?: [];
}


export const Header:React.FC <IHeaderProps> = observer((props)=>
{
    const [os, setOs] = React.useState('PC');
    const userInfo = useRecoilValue(userInfoAtom);
    const setListUserInfo = useSetRecoilState(listUserInfoAtom);
    
    useEffect(()=>
    {
        setOs(utils.getOS());
        firestore.get('Users').then(setListUserInfo);
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
                span={11}
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
                span={5}
            >
                <div
                    className="user-name"
                    style={{ marginRight: 10 , fontWeight: 'bold' }}
                >
                    {userInfo?.fullName ?? ''}
                </div>
                <UserOverView avatarUrl={userInfo?.avatarUrl} />
            </Col>
        </Row>
    );
});


export default Header;
