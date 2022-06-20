import { action, makeObservable, observable } from 'mobx';

import IsTenantAvaibleOutput from '../services/account/dto/isTenantAvailableOutput';
import accountService from '../services/account/accountService';

class AccountStore
{
  @observable tenant: IsTenantAvaibleOutput = new IsTenantAvaibleOutput();

  constructor()
  {
      makeObservable(this);
  }

  @action
  public isTenantAvailable = async (tenancyName: string): Promise<void> =>
  {
      this.tenant = await accountService.isTenantAvailable({ tenancyName });
  };
}

export default AccountStore;
