import { ChangeLanguagaInput } from './dto/changeLanguageInput';
import { CreateOrUpdateUserInput } from './dto/createOrUpdateUserInput';
import { EntityDto } from '../dto/entityDto';
import { PagedUserResultRequestDtoUser } from './dto/PagedUserResultRequestDto';
import { UpdateUserInput } from './dto/updateUserInput';
import { ResetUserPass } from './dto/updateUserInput';
import http from '../http';
import { ReadExcel } from './dto/readExcel';

class UserService
{
    http = new http('account');
    public async create(createUserInput: CreateOrUpdateUserInput)
    {
        const result = await this.http.client.post('/api/services/app/User/Create', createUserInput);
        return result;
    }

    public async update(updateUserInput: UpdateUserInput)
    {
        const result = await this.http.client.put('/api/services/app/User/Update', updateUserInput);
        return result;
    }

    public async delete(entityDto: EntityDto)
    {
        const result = await this.http.client.delete('/api/services/app/User/Delete', { data: { id: entityDto.id } });
        return result;
    }

    public async multiDelete(entityDto: number[])
    {
        const list: number[] = [];
        entityDto.forEach((id:any)=>list.push(parseInt(id)));
        const result = await this.http.client.delete('/api/services/app/User/DeleteList',{ data: list });
        return result.data;
    }

    public async resetPass(resetPass: ResetUserPass)
    {
        const result = await this.http.client.post('/api/services/app/User/ResetPassword', resetPass);
        return result;
    }

    public async getRoles()
    {
        const result = await this.http.client.get('/api/services/app/User/GetRoles');
        return result.data;
    }

    public async changeLanguage(changeLanguageInput: ChangeLanguagaInput)
    {
        const result = await this.http.client.post('/api/services/app/User/ChangeLanguage', changeLanguageInput);
        return result.data;
    }

    public async get(pagedFilterAndSortedRequest: PagedUserResultRequestDtoUser): Promise<CreateOrUpdateUserInput[]>
    {
        const result = await this.http.client.get('/api/services/app/User/SearchAccount', { params: pagedFilterAndSortedRequest });
        // console.log(result);
        return result.data;
    }

    public async getAll(pagedFilterAndSortedRequest: PagedUserResultRequestDtoUser): Promise<any>
    {
        const result = await this.http.client.get('/api/services/app/User/SearchAccount',{ params: pagedFilterAndSortedRequest });
        // console.log(result);
        return result;
    }

    public async readExcel(fileName: object)
    {
        const result = await this.http.client.post('/api/services/app/User/ReadDataFromExcel', fileName);
        return result.data;
    }

    public async createByExcel(ExcelData: ReadExcel)
    {
        const result = await this.http.client.post('/api/services/app/User/CreateListUser', ExcelData);
        return result;
    }
}

export default new UserService();
