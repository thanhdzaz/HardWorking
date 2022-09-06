import { atom } from 'recoil';

export const ProjectAtom = atom({
    key: 'ProjectAtom',
    default: localStorage.getItem('project') ?? '',
});
