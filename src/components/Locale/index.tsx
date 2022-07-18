// import { Suspense } from "react";
import { ConfigProvider } from 'antd';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { antdLocaleAtom } from 'stores/atom/locale.js';

// import zh from "@/locales/vi-VN"; // 默认加载中文。 lingui-detect尚不稳定

const Locale: React.FunctionComponent = ({ children }):JSX.Element =>
{
    const antdLocale = useRecoilValue(antdLocaleAtom);

    console.log(antdLocale);

    return (
        <ConfigProvider locale={antdLocale}>{children}</ConfigProvider>
    );
};

export default Locale;
