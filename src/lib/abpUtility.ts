import { rootStore } from 'stores';
import AppConsts from './appconst';

declare let abp: any;

const {
    permission,
} = rootStore;

export function L(key: string, sourceName?: string): string
{
    const localizationSourceName = AppConsts.localization.defaultLocalizationSourceName;
    return abp.localization.localize(key, sourceName || localizationSourceName);
}

export function isGranted(_permissionName: string): boolean
{
    const p = permission.myPermissions;
    if (_permissionName.includes('|'))
    {
        const name = _permissionName.split('|');
        let flag = false;
        name.forEach((val)=>
        {
            if (p.includes(val))
            {
                flag = true;
            }
        });
        return flag;
    }
    return p.includes(_permissionName);
}
