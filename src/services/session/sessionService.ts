import { GetCurrentLoginInformations } from './dto/getCurrentLoginInformations';
import http from '../httpService';

declare let abp: any;

class SessionService
{
    public async getCurrentLoginInformations(): Promise<GetCurrentLoginInformations>
    {
        const result = await http.get('api/services/app/Session/GetCurrentLoginInformations', {
            headers: {
                'Abp.TenantId': abp.multiTenancy.getTenantIdCookie(),
            },
        });

        return result.data.result;
    }
}

export default new SessionService();
