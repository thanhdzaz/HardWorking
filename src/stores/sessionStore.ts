import { action, makeObservable, observable } from 'mobx';

import { GetCurrentLoginInformations } from '../services/session/dto/getCurrentLoginInformations';
import sessionService from '../services/session/sessionService';

class SessionStore
{
  @observable currentLogin: GetCurrentLoginInformations = new GetCurrentLoginInformations();

  @observable loading: Boolean = false;
  @observable project = localStorage.getItem('project') || '';
  @observable idEmployee = '';

  constructor()
  {
      makeObservable(this);
  }

  @action
  async getCurrentLoginInformations(): Promise<void>
  {
      const result = await sessionService.getCurrentLoginInformations();
      this.currentLogin = result;
  }

  @action
  setLoading = (status: Boolean): void =>
  {
      if (status === false)
      {
          setTimeout(() =>
              this.loading = status
          ,250);
      }
      else
      {
          this.loading = status;
      }
  };

  @action
  setProject = (id: string): void =>
  {
      this.project = id;
  };
  async getEmployee():Promise<string>
  {
      return this.idEmployee;
  }

  @action
  setEmployee = (id: string): void =>
  {
      this.idEmployee = id;
  };
}

export default SessionStore;
