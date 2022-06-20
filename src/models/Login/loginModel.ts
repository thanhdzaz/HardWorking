import { observable } from 'mobx';

class LoginModel
{
  tenancyName!: string;

  userNameOrEmailAddress!: string;

  password!: string;

  @observable rememberMe!: boolean;

  @observable showModal!: boolean;

  toggleRememberMe = (): void =>
  {
      this.rememberMe = !this.rememberMe;
  };

  toggleShowModal = (): void =>
  {
      this.showModal = !this.showModal;
  };
}

export default LoginModel;
