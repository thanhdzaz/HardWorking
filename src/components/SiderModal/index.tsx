import { Modal, ModalProps } from 'antd';
import './index.less';

import React from 'react';

interface Props{
    config: ModalProps;
    position: 'left' | 'right';
    children: React.ReactElement<any> | JSX.Element | any;
    headerButton?: React.ReactElement<any> | JSX.Element | any;
}

class SiderModal extends React.Component<Props>
{
    render(): JSX.Element
    {
        return (
            <>
                <style>
                    
                    {
                        `.ant-modal-close{ 
                ${this.props.position !== 'left' ? 'left' : 'right'}: 0;
                }` +
                        `.ant-header-btn-custom {
                    ${this.props.position !== 'left' ? 'right' : 'left'}: 0;
                    top: 0;
                }` +
                        `
                ${
            this.props.config.footer === false && '.ant-modal-body{max-height: 93vh !important;}'
            }
                `
                
                    }
                
                </style>
                <Modal
                    {...this.props.config}
                    className={'siderModal'}
                    style={{ position: 'absolute',[this.props.position]: 0, top: '0px !important' }}
                >
                    <div
                        style={{ position: 'absolute' }}
                        className="ant-header-btn-custom"
                    >
                        {this.props.headerButton}
                    </div>
                    {this.props.children}
                </Modal>
            </>
        );
    }
}

export default SiderModal;
