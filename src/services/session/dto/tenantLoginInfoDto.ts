import { EntityDto } from '../../dto/entityDto';

export default class TenantLoginInfoDto extends EntityDto
{
  tenancyName!: string;

  name!: string;
}
