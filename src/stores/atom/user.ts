import { UserInfo } from 'models/User/dto';
import { atom } from 'recoil';

export const userProjectAtom = atom({
    default: [] as UserInfo[],
    key: 'userAtom',
});


export const userInfoAtom = atom({
    default: {} as UserInfo,
    key: 'userInfoAtom',
});

export const listUserInfoAtom = atom({
    default: [] as UserInfo[],
    key: 'listUserInfoAtom',
});
