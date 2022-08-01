import React from 'react';

export const CharacterAvatar:React.FunctionComponent<any> = ({ title, size }) =>
{
    const titleAfterSplit = (title?.split(' ') || []).map((val) => val?.[0]?.toUpperCase()).join('').replace(/[^A-Z]/g,'');
    const formatTitle = titleAfterSplit.slice(0,2);
    return (
        <div
            style={{
                width: size ?? 35,
                height: size ?? 35,
                backgroundColor: 'var(--ant-primary-color)',
                color: '#fff',
                borderRadius: '50%',
                justifyContent: 'center',
                alignItems: 'center',
                display: 'inline-flex',
                padding: 1,
                fontWeight: 'bold',
            }}
        >
            {formatTitle}
        </div>
    );
};

export default CharacterAvatar;
