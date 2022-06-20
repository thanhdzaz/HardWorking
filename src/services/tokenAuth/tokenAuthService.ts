import { AuthenticationModel } from './dto/authenticationModel';
import { AuthenticationResultModel } from './dto/authenticationResultModel';
// import http from '../httpService';
import axios from 'axios';
import AppConsts from 'lib/appconst';

class TokenAuthService
{
    public async authenticate(authenticationInput: AuthenticationModel): Promise<AuthenticationResultModel>
    {
        console.log(`${AppConsts.remoteServiceBaseUrl}api/services/app/TokenAuth/Authenticate`);
        const result = await axios.post(`${AppConsts.remoteServiceBaseUrl}api/services/app/TokenAuth/Authenticate`, authenticationInput);
        const data = JSON.parse(result.data);
        return data;
    }
}

export default new TokenAuthService();
