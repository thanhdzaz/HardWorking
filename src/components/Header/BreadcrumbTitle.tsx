import './index.less';
import 'famfamfam-flags/dist/sprite/famfamfam-flags.css';


import { inject } from 'mobx-react';
import { appRoutersAndChild } from '../Router/router.config';

import Stores from 'stores/storeIdentifier';
import UserStore from 'stores/userStore';
import React from 'react';
import { Breadcrumb } from 'antd';


export interface IBreadcumbTitleProps {
  userStore?: UserStore;
  data?: [];
}

export interface State {
    F: string;
    pre: string;
}

@inject(Stores.UserStore)
class BreadcumbTitle extends React.Component<IBreadcumbTitleProps,State>
{
    state = {
        F: '',
        pre: 'def',
    };

    componentDidMount():void
    {
        this.getParentPath();
    }
    getParentPath = ():void =>
    {
        let count = 0;
        let txt = '';
        const path = (window.location.pathname.indexOf('/',1) < 0) ? window.location.pathname : window.location.pathname.slice(1,window.location.pathname.indexOf('/',1));
        this.props.data?.
            filter((item: any) => item.children?.length > 0).
            map((tmp: any)=>
                tmp.children.
                    map((data: any)=> data.path === path &&
                        (
                            count += 1,
                            txt = tmp.title
                        ),
                        
                    ),
            );
        count === 1 ? this.setState({ F: txt }) : this.setState({ F: '' });
    };

    render(): JSX.Element
    {
        const path = (window.location.pathname.indexOf('/',1) < 0) ? window.location.pathname : window.location.pathname.slice(1,window.location.pathname.indexOf('/',1));
        const data:any = appRoutersAndChild.filter((item: any) => item.path === path);
        this.state.pre !== path && (
            this.getParentPath(),
            this.setState({ pre: path })
        );
        const first = this.state.F;
        return (
            <div className='title-txt'>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        {first || ''}
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        {data[0]?.title || ''}
                    </Breadcrumb.Item>
                </Breadcrumb>
            </div>
        );
    }
}

export default BreadcumbTitle;
