import './index.less';
import 'famfamfam-flags/dist/sprite/famfamfam-flags.css';


import { Dropdown, Menu } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';

import classNames from 'classnames';
import { inject } from 'mobx-react';
import { L } from 'lib/abpUtility';
import Stores from 'stores/storeIdentifier';
import UserStore from 'stores/userStore';
import React from 'react';

declare let abp: any;

export interface ILanguageSelectProps {
  userStore?: UserStore;
}

@inject(Stores.UserStore)
class LanguageSelect extends React.Component<ILanguageSelectProps>
{
    get languages(): any
    {
        return abp.localization.languages.filter((val: any) =>
        {
            return !val.isDisabled;
        });
    }

    async changeLanguage(languageName: string): Promise<any>
    {
        await this.props.userStore?.changeLanguage(languageName);

        abp.utils.setCookieValue(
            'Abp.Localization.CultureName',
            languageName,
            new Date(new Date().getTime() + 5 * 365 * 86400000), // 5 year
            abp.appPath,
        );

        window.location.reload();
    }

    get currentLanguage(): any
    {
        return abp.localization.currentLanguage;
    }

    render(): JSX.Element
    {
        const langMenu = (
            <Menu
                className="menu"
                selectedKeys={[this.currentLanguage.name]}
            >
                {this.languages.map((item: any) => (
                    <Menu.Item
                        key={item.name}
                        onClick={() => this.changeLanguage(item.name)}
                    >
                        <i className={item.icon} /> {item.displayName}
                    </Menu.Item>
                ))}
            </Menu>
        );

        return (
            <Dropdown
                overlay={langMenu}
                placement="bottomRight"
            >
                <GlobalOutlined
                    className={classNames('dropDown', 'className')}
                    title={L('Languages')}
                />
            </Dropdown>
        );
    }
}

export default LanguageSelect;
