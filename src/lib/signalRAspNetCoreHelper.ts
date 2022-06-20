import AppConsts from './appconst';
import Util from '../utils/utils';

declare let abp: any;

class SignalRAspNetCoreHelper
{
    initSignalR()
    {
        const encryptedAuthToken = abp.utils.getCookieValue(AppConsts.authorization.encrptedAuthTokenName);

        abp.signalr = {
            autoConnect: true,
            connect: undefined,
            hubs: undefined,
            qs: `${AppConsts.authorization.encrptedAuthTokenName }=${ encodeURIComponent(encryptedAuthToken)}`,
            remoteServiceBaseUrl: AppConsts.remoteServiceBaseUrl,
            url: '/signalr',
        };

        Util.loadScript(`${AppConsts.appBaseUrl }/dist/abp.signalr-client.js`);
    }
}
export default new SignalRAspNetCoreHelper();
