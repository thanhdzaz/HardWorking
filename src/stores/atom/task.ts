import { TaskDto } from 'models/Task/dto';
import { atom } from 'recoil';

export const taskAtom = atom({
    default: [] as TaskDto[],
    key: 'taskAtom',
});
