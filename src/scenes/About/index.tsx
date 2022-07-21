

import { Card, Input } from 'antd';
import { storage } from 'firebase';
import React from 'react';

export class About extends React.Component<any>
{
    render(): JSX.Element
    {
        return (
            <Card>
                <Input
                    type='file'
                    onChange={(e)=>
                    {
                        const file = e?.currentTarget?.files?.[0];
                        storage.upload('public/avatar/hehe.png',file).then((response)=>
                        {
                            console.log(response);
                            
                        }).catch((error)=>console.log(error),
                        );
                    }}
                />
            </Card>
        );
    }
}
export default About;
