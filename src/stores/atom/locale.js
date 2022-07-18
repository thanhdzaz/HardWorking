import { atom, selector } from 'recoil';

export const locales = {
    'vi-VN': {
        name: 'Tiếng Việt',
        // UILocale:zhCN
        // antd:zhCN
        antd: {
            ...require('antd/es/locale/vi_VN').default,
        },
        ...require('dayjs/locale/vi'),
    },
    'en-US': {
        name: 'Tiếng Anh',
        // UILocale:enUS
        // antd:enUS
        antd: {
            ...require('antd/es/locale/en_US').default,
        },
        ...require('dayjs/locale/en'),
    },
};

export const curLangAtom = atom({
    key: 'curLangAtom',
    default: 'vi-VN',
});

export const curLocaleLoadAtom = selector({
    key: 'curLocaleLoadAtom',
    default: 'none',
    get: async ({ get }) =>
    {
        const lang = get(curLangAtom);
        return lang;
    },
});

// UI 国际化内容
// UI 内容随curLangAtom 而改变，故为selector

export const antdLocaleAtom = selector({
    key: 'antdLocaleAtom',
    get: () => locales['vi-VN'].antd,
});
