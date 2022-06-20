import { ReadExcel } from './../services/user/dto/readExcel';
import { action, makeObservable, observable } from 'mobx';

import { CreateOrUpdateUserInput } from '../services/user/dto/createOrUpdateUserInput';
import { EntityDto } from '../services/dto/entityDto';
import { GetRoles } from '../services/user/dto/getRolesOuput';
import { GetUserOutput } from '../services/user/dto/getUserOutput';
// import { PagedResultUserDto } from '../services/dto/pagedResultDto';
// import { PagedUserResultRequestDto } from '../services/user/dto/PagedUserResultRequestDto';
import { PagedUserResultRequestDtoUser } from '../services/user/dto/PagedUserResultRequestDto';
import { UpdateUserInput } from '../services/user/dto/updateUserInput';
// import { ResetUserPass } from '../services/user/dto/updateUserInput';
import userService from '../services/user/userService';

class UserStore
{
  @observable users!: GetUserOutput[];

  @observable editUser!: CreateOrUpdateUserInput[];

  @observable roles: GetRoles[] = [];

  @observable dataReadExcel:ReadExcel[] = [] as any;

  constructor()
  {
      makeObservable(this);
  }

  @action
  async create(createUserInput: CreateOrUpdateUserInput): Promise<any>
  {
      const result = await userService.create(createUserInput);
      return result;
  }

  //   @action
  //   async createFromExcel(createUserInput: ReadExcel): Promise<any>
  //   {
  //       const result = await userService.createByExcel(createUserInput);
  //       this.users.push(result.data.result);
  //       return result;
  //   }

  @action
  async setDataReadExcel(data:[]):Promise<void>
  {
      this.dataReadExcel = data;
  }

  @action
  async update(updateUserInput: UpdateUserInput): Promise<any>
  {
      const result = await userService.update(updateUserInput);
      this.users = this.users.map((x: GetUserOutput) =>
      {
          if (x.id === updateUserInput.id)
          {
              x = result.data.result;
          }
          return x;
      });
      return result;
  }

  @action
  async delete(entityDto: EntityDto): Promise<void>
  {
      await userService.delete(entityDto);
      this.users = this.users.filter((x: GetUserOutput) => x.id !== entityDto.id);
  }

  //   @action
  //   async resetPass(resetPass: ResetUserPass): Promise<void>
  //   {
  //       await userService.resetPass(resetPass);
  //   }

  @action
  async getRoles(): Promise<void>
  {
      const result = await userService.getRoles();
      this.roles = result;
  }

  //   @action
  //   async get(entityDto: EntityDto): Promise<void>
  //   {
  //       const result = await userService.get(entityDto);
  //       this.editUser = result;
  //   }
  @action
  async get(pagedFilterAndSortedRequest: PagedUserResultRequestDtoUser): Promise<void>
  {
      const result = await userService.get(pagedFilterAndSortedRequest);
      this.editUser = result;
  }

  @action
  async createUser(): Promise<void>
  {
      this.editUser = [{
          userName: '',
          fullName: '',
          emailAddress: '',
          phoneNumber: 0,
          password: '',
          roleNames: [],
          idEmployee: '',
          department: '',
          subdivision: '',
          postition: '',
          isResetPassword: false,
          isStopWork: false,
      }];
      this.roles = [];
  }

  @action
  async getAll(pagedFilterAndSortedRequest: PagedUserResultRequestDtoUser): Promise<any>
  {
      const result = await userService.getAll(pagedFilterAndSortedRequest);
      this.users = result.data ?? [];
      return result;
  }

  async readExcel(fileName: object): Promise<ReadExcel[]>
  {
      const result = await userService.readExcel(fileName);
      this.dataReadExcel = result;
      return result;
  }

  async changeLanguage(languageName: string): Promise<void>
  {
      await userService.changeLanguage({ languageName });
  }
}

export default UserStore;
