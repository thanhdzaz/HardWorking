import { Spin } from 'antd';
import { inject, observer } from 'mobx-react';
import SessionStore from 'stores/sessionStore';
import React from 'react';
import Stores from 'stores/storeIdentifier';
import { LoadingOutlined } from '@ant-design/icons';


export interface IUserProps {
    sessionStore?: SessionStore;
}

@inject(Stores.SessionStore)
@observer
class LoadingOverlay extends React.Component<IUserProps>
{

    public render(): JSX.Element
    {
        const styleCustom = {
            zIndex: 99999,
            top: 0,
            left: 0,
            width: '100%',
            // position: 'absolute',
        };

        const loading = this.props.sessionStore?.loading as boolean;
        if (loading)
        {
            return (
                <>
                    <div style={{ ...styleCustom, background: 'gray', opacity: 0.55, position: 'absolute', height: '100%' }} />
                    <div style={{ ...styleCustom, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', height: '100vh' }}>
                        <Spin
                            indicator={<LoadingOutlined />}
                            spinning={loading}
                            size="large"
                        />
                    </div>
                </>

            );
        }

        return <></>;
    }
}

export default LoadingOverlay;
