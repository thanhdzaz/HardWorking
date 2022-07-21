import { UserInfo } from 'models/User/dto';
import { atom } from 'recoil';

export const userAtom = atom({
    default: [] as UserInfo[],
    key: 'userAtom',
});


export const userInfoAtom = atom({
    default: {} as UserInfo,
    key: 'userInfoAtom',
});
