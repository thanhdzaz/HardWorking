import './index.less';
import './media_query.less';

import { Col, Row } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
// import LanguageSelect from '../LanguageSelect';
import Title from './BreadcrumbTitle';
import Project from './ProjectChoose';
import React, { useEffect } from 'react';
import UserOverView from './UserOverView';
// import AppComponentBase from 'components/AppComponentBase';

import utils from '../../utils/utils';
import { auth, firestore } from 'firebase';
import { listUserInfoAtom, userInfoAtom } from 'stores/atom/user';
import { useRecoilState, useSetRecoilState } from 'recoil';

export interface IHeaderProps {
  collapsed?: any;
  toggle?: any;
  data?: [];
}


export const Header:React.FC <IHeaderProps> = (props)=>
{
    const [os, setOs] = React.useState('PC');
    const [userInfo,setUserInfo] = useRecoilState(userInfoAtom);
    const setListUserInfo = useSetRecoilState(listUserInfoAtom);
    
    useEffect(()=>
    {
        setOs(utils.getOS());
        firestore.get('Users').then(setListUserInfo);
       
    },[]);
   
    useEffect(() =>
    {
        if (auth.currentUser?.uid)
        {
            firestore.getByDoc('Users',auth.currentUser?.uid ?? '').then((userInfo) =>
            {
                setUserInfo(userInfo);
            });
        }
    },[auth.currentUser]);
    
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
};


export default Header;
