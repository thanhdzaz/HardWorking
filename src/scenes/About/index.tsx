

import ProTable from '@ant-design/pro-table';
import { Card } from 'antd';
import React from 'react';

export class About extends React.Component<any>
{
    render(): JSX.Element
    {
        return (
            <Card>
                <ProTable />
            </Card>
        );
    }
}
export default About;
