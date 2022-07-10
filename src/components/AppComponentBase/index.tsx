import { L } from 'lib/abpUtility';
import React from 'react';

class AppComponentBase<P = {}, S = {}, SS = any> extends React.Component<P, S, SS>
{
    L(key: string): string
    {
        return L(key);
    }
}

export default AppComponentBase;
