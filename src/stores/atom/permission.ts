import { atom } from 'recoil';

export const permissionsAtom = atom({
    key: 'permissions',
    default: [] as string[],
    
});
