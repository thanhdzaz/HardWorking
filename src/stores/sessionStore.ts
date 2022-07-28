import { auth, firebaseApp, firestore } from 'firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { action, makeObservable, observable } from 'mobx';
import type { UserInfo } from 'models/User/dto';

// import { GetCurrentLoginInformations } from '../services/session/dto/getCurrentLoginInformations';
class SessionStore
{
  @observable currentLogin: UserInfo = {} as any;

  @observable loading: Boolean = false;
  @observable project = localStorage.getItem('project') || '';
  @observable idEmployee = '';

  constructor()
  {
      makeObservable(this);
      this.currentLogin = auth.currentUser ?? {} as any;
  }

@action
  async setCurrentLogin(login:UserInfo):Promise<string>
  {
      this.currentLogin = login;
      return login.role;
  }

  @action
async getCurrentLoginInformations(): Promise<void>
{
    onAuthStateChanged(getAuth(firebaseApp()),(user) =>
    {
        if (user)
        {
            const uid = user.uid;
            console.log(uid,'uid');
            firestore.getByDoc('Users',uid).then((doc) =>
            {
                this.currentLogin = doc;
            
            });
        }
        else
        {
            // User is signed out
            // ...
        }
    });
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
