import { action, makeObservable, observable } from 'mobx';

import AppConsts from '../lib/appconst';
import LoginModel from '../models/Login/loginModel';
import tokenAuthService from '../services/tokenAuth/tokenAuthService';
import Cookie from 'js-cookie';
import { GetUserOutput } from 'services/user/dto/getUserOutput';

declare let abp: any;

class AuthenticationStore
{

    @observable loginModel: LoginModel = new LoginModel();
    @observable currentLogin: GetUserOutput = {} as GetUserOutput;

    constructor()
    {
        makeObservable(this);
    }

    get isAuthenticated(): boolean
    {
        if (abp.auth.getToken() !== undefined)
        {
            return false;
        }

        return true;
    }

    @action
    public async login(model: LoginModel): Promise<any>
    {

        const data:any = await tokenAuthService.authenticate({
            userNameOrEmailAddress: model.userNameOrEmailAddress,
            password: model.password,
            rememberClient: model.rememberMe,
        });
        if (data.status === true)
        {
       
        
            const result = data.data;
            Cookie.set('epCode',result.userIdEmployee,{ path: '/' });
            const tokenExpireDate = model.rememberMe ? new Date(new Date().getTime() + 1000 * result.expireInSeconds) : undefined;
            abp.auth.setToken(result.accessToken, tokenExpireDate);
            abp.utils.setCookieValue(AppConsts.authorization.encrptedAuthTokenName, result.encryptedAccessToken, tokenExpireDate, abp.appPath);
            return true;
        }
        return data.message;
    }

    @action
    logout(): void
    {
        localStorage.clear();
        sessionStorage.clear();
        abp.auth.clearToken();
    }
}
export default AuthenticationStore;
